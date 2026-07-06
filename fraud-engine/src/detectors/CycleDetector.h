#pragma once
#include "BaseDetector.h"
#include <set>
#include <algorithm>
#include <vector>
#include <numeric>

class CycleDetector : public BaseDetector {
    std::vector<nlohmann::json> allCycles;

    void dfs(const TransactionGraph& graph, const std::string& u, const std::string& startNode,
             std::vector<std::string>& path, std::set<std::string>& visited, ScoreStore& store) {
        
        if (path.size() > 6) return; // limit to 6

        for (const auto& edge : graph.adj.at(u)) {
            const std::string& v = edge.to;
            
            if (v == startNode && path.size() >= 2) {
                // found a cycle
                int cycleLength = path.size();
                int risk = std::min(40, 8 * cycleLength);
                
                // add score to all nodes in cycle
                for (const auto& node : path) {
                    store.addCycleScore(node, risk);
                }

                nlohmann::json h;
                std::vector<std::string> currentCycle = path;
                currentCycle.push_back(startNode);
                h["cycle"] = currentCycle;
                h["cycleLength"] = cycleLength;
                h["riskContribution"] = risk;
                
                std::vector<std::string> involved = path;
                h["accountsInvolved"] = involved;

                std::string desc;
                for (size_t i = 0; i < currentCycle.size(); ++i) {
                    desc += currentCycle[i];
                    if (i + 1 < currentCycle.size()) desc += " \u2192 "; // right arrow
                }
                h["description"] = desc;
                
                allCycles.push_back(h);

            } else if (visited.find(v) == visited.end() && path.size() < 6) {
                // To avoid redundant undirected-like combinations, we only search paths where startNode is min
                if (v > startNode) {
                    visited.insert(v);
                    path.push_back(v);
                    dfs(graph, v, startNode, path, visited, store);
                    path.pop_back();
                    visited.erase(v);
                }
            }
        }
    }

public:
    void detect(const TransactionGraph& graph, ScoreStore& store, HighlightExtractor& extractor) override {
        allCycles.clear();

        for (const auto& node : graph.nodes) {
            std::vector<std::string> path = {node};
            std::set<std::string> visited = {node};
            dfs(graph, node, node, path, visited, store);
        }

        // Sort all cycles by riskContribution descending
        std::sort(allCycles.begin(), allCycles.end(), [](const nlohmann::json& a, const nlohmann::json& b) {
            return a["riskContribution"].get<int>() > b["riskContribution"].get<int>();
        });

        int totalCycles = allCycles.size();
        int longestCycle = 0;
        int totalLength = 0;

        for (const auto& c : allCycles) {
            int len = c["cycleLength"].get<int>();
            if (len > longestCycle) longestCycle = len;
            totalLength += len;
        }

        double avgLength = totalCycles > 0 ? (double)totalLength / totalCycles : 0.0;

        nlohmann::json summary;
        summary["totalCyclesFound"] = totalCycles;
        summary["longestCycleLength"] = longestCycle;
        summary["averageCycleLength"] = avgLength;

        nlohmann::json topFindings = nlohmann::json::array();
        for (size_t i = 0; i < std::min((size_t)5, allCycles.size()); ++i) {
            topFindings.push_back(allCycles[i]);
        }

        nlohmann::json result;
        result["summary"] = summary;
        result["topFindings"] = topFindings;
        result["allFindings"] = allCycles;

        extractor.setCycleHighlight(result);
    }
};
