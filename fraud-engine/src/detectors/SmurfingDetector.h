#pragma once
#include "BaseDetector.h"
#include <map>
#include <set>
#include <iomanip>
#include <sstream>
#include <vector>

class SmurfingDetector : public BaseDetector {
public:
    void detect(const TransactionGraph& graph, ScoreStore& store, HighlightExtractor& extractor) override {
        std::vector<nlohmann::json> allCandidates;
        int largestRecipientCount = 0;
        double totalStructuredAmount = 0.0;

        for (const auto& node : graph.nodes) {
            std::set<std::string> uniqueRecipients;
            double totalAmount = 0.0;
            bool allBelow1000 = true;
            int countBelow1000 = 0;

            for (const auto& edge : graph.adj.at(node)) {
                if (edge.amount < 1000.0) {
                    uniqueRecipients.insert(edge.to);
                    totalAmount += edge.amount;
                    countBelow1000++;
                } else {
                    allBelow1000 = false;
                }
            }

            if (uniqueRecipients.size() >= 4 && countBelow1000 == graph.adj.at(node).size() && countBelow1000 > 0) {
                double score = std::min(30.0, (double)uniqueRecipients.size() * 5.0);
                store.setSmurfingScore(node, score);

                if (uniqueRecipients.size() > largestRecipientCount) {
                    largestRecipientCount = uniqueRecipients.size();
                }
                totalStructuredAmount += totalAmount;

                nlohmann::json highlight;
                highlight["accountId"] = node;
                highlight["uniqueRecipientCount"] = uniqueRecipients.size();
                highlight["totalAmount"] = totalAmount;
                highlight["smurfingScore"] = score;
                
                std::stringstream ss;
                ss << uniqueRecipients.size() << " recipients, $" << std::fixed << std::setprecision(0) << totalAmount << " total, all below $1,000";
                highlight["description"] = ss.str();
                
                allCandidates.push_back(highlight);
            }
        }

        std::sort(allCandidates.begin(), allCandidates.end(), [](const nlohmann::json& a, const nlohmann::json& b) {
            return a["smurfingScore"].get<double>() > b["smurfingScore"].get<double>();
        });

        nlohmann::json summary;
        summary["candidatesFound"] = allCandidates.size();
        summary["largestRecipientCount"] = largestRecipientCount;
        summary["totalStructuredAmount"] = totalStructuredAmount;

        nlohmann::json topFindings = nlohmann::json::array();
        for (size_t i = 0; i < std::min((size_t)5, allCandidates.size()); ++i) {
            topFindings.push_back(allCandidates[i]);
        }

        nlohmann::json result;
        result["summary"] = summary;
        result["topFindings"] = topFindings;
        result["allFindings"] = allCandidates;

        extractor.setSmurfingHighlight(result);
    }
};
