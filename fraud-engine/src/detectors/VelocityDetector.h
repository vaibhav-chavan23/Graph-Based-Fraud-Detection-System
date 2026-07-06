#pragma once
#include "BaseDetector.h"
#include <algorithm>
#include <vector>

class VelocityDetector : public BaseDetector {
public:
    void detect(const TransactionGraph& graph, ScoreStore& store, HighlightExtractor& extractor) override {
        std::vector<nlohmann::json> allViolations;
        int highestBurst = 0;

        for (const auto& node : graph.nodes) {
            std::vector<long long> timestamps;
            for (const auto& edge : graph.adj.at(node)) {
                timestamps.push_back(edge.timestamp);
            }
            std::sort(timestamps.begin(), timestamps.end());

            int maxCountInAnyWindow = 0;
            long long bestElapsed = 0;

            for (size_t i = 0; i < timestamps.size(); ++i) {
                for (size_t j = i; j < timestamps.size(); ++j) {
                    long long elapsed = timestamps[j] - timestamps[i];
                    if (elapsed <= 300) {
                        int count = j - i + 1;
                        if (count > maxCountInAnyWindow) {
                            maxCountInAnyWindow = count;
                            bestElapsed = elapsed;
                        }
                    } else {
                        break;
                    }
                }
            }

            if (maxCountInAnyWindow >= 5) {
                double score = std::min(15.0, (double)(maxCountInAnyWindow - 4) * 4.0);
                store.setVelocityScore(node, score);

                if (maxCountInAnyWindow > highestBurst) {
                    highestBurst = maxCountInAnyWindow;
                }

                nlohmann::json highlight;
                highlight["accountId"] = node;
                highlight["transactionCount"] = maxCountInAnyWindow;
                highlight["timeWindowSeconds"] = bestElapsed;
                highlight["velocityScore"] = score;
                highlight["description"] = std::to_string(maxCountInAnyWindow) + " transactions in " + std::to_string(bestElapsed) + " seconds";
                allViolations.push_back(highlight);
            }
        }

        std::sort(allViolations.begin(), allViolations.end(), [](const nlohmann::json& a, const nlohmann::json& b) {
            return a["velocityScore"].get<double>() > b["velocityScore"].get<double>();
        });

        nlohmann::json summary;
        summary["accountsScanned"] = graph.nodes.size();
        summary["velocityViolationsFound"] = allViolations.size();
        summary["highestBurst"] = highestBurst;

        nlohmann::json topFindings = nlohmann::json::array();
        for (size_t i = 0; i < std::min((size_t)5, allViolations.size()); ++i) {
            topFindings.push_back(allViolations[i]);
        }

        nlohmann::json result;
        result["summary"] = summary;
        result["topFindings"] = topFindings;
        result["allFindings"] = allViolations;

        extractor.setVelocityHighlight(result);
    }
};
