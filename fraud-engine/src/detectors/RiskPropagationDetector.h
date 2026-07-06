#pragma once
#include "BaseDetector.h"
#include <queue>
#include <set>
#include <vector>

class RiskPropagationDetector : public BaseDetector {
public:
    void detect(const TransactionGraph& graph, ScoreStore& store, HighlightExtractor& extractor) override {
        std::vector<nlohmann::json> allChains;
        int maxBfsDepth = 0;
        int totalDepth = 0;

        std::vector<std::string> sources;
        for (const auto& pair : store.accounts) {
            const auto& scores = pair.second.scores;
            if (scores.cycleScore + scores.smurfingScore + scores.muleScore > 30.0) {
                sources.push_back(pair.first);
            }
        }

        for (const auto& source : sources) {
            std::queue<std::pair<std::string, int>> q;
            std::set<std::string> visited;
            std::map<std::string, std::string> parent;

            q.push({source, 0});
            visited.insert(source);

            // We track chains per source. A chain goes up to depth 3.
            // Every path to a depth > 0 node could be considered a finding.
            // We'll extract only the deepest path from each source to avoid explosion, or all leaf paths.
            // The prompt says "Return all propagation chains". Let's return the longest chain per source for simplicity,
            // or all distinct paths. Let's do the single longest chain per source as in original, but track for all sources.
            std::string deepestNode = source;
            int maxDepthFromSource = 0;
            double scoreAtDeepest = 0.0;

            while (!q.empty()) {
                auto [u, depth] = q.front();
                q.pop();

                if (depth > 0 && depth <= 3) {
                    double addedScore = 0.0;
                    if (depth == 1) addedScore = 5.0;
                    else if (depth == 2) addedScore = 3.0;
                    else if (depth == 3) addedScore = 2.0;

                    store.addPropagationScore(u, addedScore);

                    if (depth > maxDepthFromSource) {
                        maxDepthFromSource = depth;
                        deepestNode = u;
                        scoreAtDeepest = addedScore;
                    }
                }

                if (depth < 3) {
                    for (const auto& edge : graph.adj.at(u)) {
                        if (visited.find(edge.to) == visited.end()) {
                            visited.insert(edge.to);
                            parent[edge.to] = u;
                            q.push({edge.to, depth + 1});
                        }
                    }
                }
            }

            if (maxDepthFromSource > 0) {
                std::vector<std::string> chain;
                std::string curr = deepestNode;
                while (curr != source) {
                    chain.push_back(curr);
                    curr = parent[curr];
                }
                chain.push_back(source);
                std::reverse(chain.begin(), chain.end());

                if (maxDepthFromSource > maxBfsDepth) {
                    maxBfsDepth = maxDepthFromSource;
                }
                totalDepth += maxDepthFromSource;

                nlohmann::json highlight;
                highlight["chain"] = chain;
                highlight["propagationDepth"] = maxDepthFromSource;
                highlight["sourceAccount"] = source;
                highlight["riskContribution"] = scoreAtDeepest;
                
                std::string desc;
                for (size_t i = 0; i < chain.size(); ++i) {
                    desc += chain[i];
                    if (i + 1 < chain.size()) desc += " \u2192 ";
                }
                highlight["description"] = desc;
                
                allChains.push_back(highlight);
            }
        }

        std::sort(allChains.begin(), allChains.end(), [](const nlohmann::json& a, const nlohmann::json& b) {
            return a["riskContribution"].get<double>() > b["riskContribution"].get<double>();
        });

        double avgDepth = allChains.empty() ? 0.0 : (double)totalDepth / allChains.size();

        nlohmann::json summary;
        summary["chainsFound"] = allChains.size();
        summary["maxBfsDepth"] = maxBfsDepth;
        summary["averageDepth"] = avgDepth;

        nlohmann::json topFindings = nlohmann::json::array();
        for (size_t i = 0; i < std::min((size_t)5, allChains.size()); ++i) {
            topFindings.push_back(allChains[i]);
        }

        nlohmann::json result;
        result["summary"] = summary;
        result["topFindings"] = topFindings;
        result["allFindings"] = allChains;

        extractor.setPropagationHighlight(result);
    }
};
