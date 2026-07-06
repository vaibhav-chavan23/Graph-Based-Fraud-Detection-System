#pragma once
#include "BaseDetector.h"
#include <set>
#include <cmath>
#include <iomanip>
#include <sstream>
#include <vector>

class MuleDetector : public BaseDetector {
public:
    void detect(const TransactionGraph& graph, ScoreStore& store, HighlightExtractor& extractor) override {
        std::vector<nlohmann::json> allCandidates;
        int highestInDegree = 0;
        int totalInDegree = 0;

        for (const auto& node : graph.nodes) {
            std::set<std::string> incoming;
            for (const auto& edge : graph.rev_adj.at(node)) {
                incoming.insert(edge.to); // "to" in rev_adj is the sender
            }

            std::set<std::string> outgoing;
            double outgoingAmount = 0.0;
            for (const auto& edge : graph.adj.at(node)) {
                outgoing.insert(edge.to);
                outgoingAmount += edge.amount;
            }

            if (incoming.size() >= 3 && outgoing.size() <= 1) {
                double muleRatio = (double)incoming.size() / std::max(1.0, (double)outgoing.size());
                double score = std::min(35.0, std::round(muleRatio * 5.0));
                
                store.setMuleScore(node, score);

                if (incoming.size() > highestInDegree) {
                    highestInDegree = incoming.size();
                }
                totalInDegree += incoming.size();

                nlohmann::json highlight;
                highlight["accountId"] = node;
                highlight["incomingAccountCount"] = incoming.size();
                highlight["outgoingAccountCount"] = outgoing.size();
                highlight["muleRatio"] = muleRatio;
                highlight["muleScore"] = score;

                std::stringstream ss;
                ss << incoming.size() << " senders \u2192 " << node << " \u2192 " << outgoing.size() 
                   << " receiver ($" << std::fixed << std::setprecision(0) << outgoingAmount << " outgoing)";
                highlight["description"] = ss.str();
                
                allCandidates.push_back(highlight);
            }
        }

        std::sort(allCandidates.begin(), allCandidates.end(), [](const nlohmann::json& a, const nlohmann::json& b) {
            return a["muleScore"].get<double>() > b["muleScore"].get<double>();
        });

        double avgInDegree = allCandidates.empty() ? 0.0 : (double)totalInDegree / allCandidates.size();

        nlohmann::json summary;
        summary["muleCandidatesFound"] = allCandidates.size();
        summary["highestInDegree"] = highestInDegree;
        summary["averageInDegree"] = avgInDegree;

        nlohmann::json topFindings = nlohmann::json::array();
        for (size_t i = 0; i < std::min((size_t)5, allCandidates.size()); ++i) {
            topFindings.push_back(allCandidates[i]);
        }

        nlohmann::json result;
        result["summary"] = summary;
        result["topFindings"] = topFindings;
        result["allFindings"] = allCandidates;

        extractor.setMuleHighlight(result);
    }
};
