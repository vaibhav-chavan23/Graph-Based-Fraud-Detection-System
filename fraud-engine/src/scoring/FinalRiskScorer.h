#pragma once
#include "ScoreStore.h"
#include "TopKRanker.h"
#include <vector>
#include <queue>
#include <cmath>

class FinalRiskScorer {
public:
    static void scoreAll(ScoreStore& store) {
        for (auto& pair : store.accounts) {
            auto& scores = pair.second.scores;
            double rawTotal = scores.cycleScore + scores.velocityScore + 
                              scores.smurfingScore + scores.muleScore + 
                              scores.propagationScore;
            
            double finalScore = (rawTotal / 130.0) * 100.0;
            if (finalScore > 100.0) finalScore = 100.0;
            
            // Round to 1 decimal
            finalScore = std::round(finalScore * 10.0) / 10.0;
            pair.second.finalRiskScore = finalScore;
            
            if (finalScore <= 19.9) pair.second.severityLevel = "SAFE";
            else if (finalScore <= 39.9) pair.second.severityLevel = "LOW";
            else if (finalScore <= 59.9) pair.second.severityLevel = "MEDIUM";
            else if (finalScore <= 79.9) pair.second.severityLevel = "HIGH";
            else pair.second.severityLevel = "CRITICAL";
        }
    }
};

class TopKRanker {
public:
    static std::vector<RankedAccount> rank(const ScoreStore& store) {
        auto cmp = [](const RankedAccount& left, const RankedAccount& right) {
            return left.finalRiskScore < right.finalRiskScore; // max heap
        };
        std::priority_queue<RankedAccount, std::vector<RankedAccount>, decltype(cmp)> pq(cmp);

        for (const auto& pair : store.accounts) {
            const auto& acc = pair.second;
            RankedAccount ra;
            ra.accountId = acc.accountId;
            ra.cycleScore = acc.scores.cycleScore;
            ra.velocityScore = acc.scores.velocityScore;
            ra.smurfingScore = acc.scores.smurfingScore;
            ra.muleScore = acc.scores.muleScore;
            ra.propagationScore = acc.scores.propagationScore;
            ra.finalRiskScore = acc.finalRiskScore;
            ra.severityLevel = acc.severityLevel;
            pq.push(ra);
        }

        std::vector<RankedAccount> ranked;
        int currentRank = 1;
        while (!pq.empty()) {
            RankedAccount ra = pq.top();
            pq.pop();
            ra.rank = currentRank++;
            ranked.push_back(ra);
        }
        return ranked;
    }
};
