#include <iostream>
#include <string>
#include <vector>
#include <nlohmann/json.hpp>

#include "io/InputParser.h"
#include "io/OutputSerializer.h"
#include "graph/TransactionGraphBuilder.h"
#include "scoring/ScoreStore.h"
#include "scoring/FinalRiskScorer.h"
#include "scoring/TopKRanker.h"
#include "highlights/HighlightExtractor.h"

#include "detectors/CycleDetector.h"
#include "detectors/VelocityDetector.h"
#include "detectors/SmurfingDetector.h"
#include "detectors/MuleDetector.h"
#include "detectors/RiskPropagationDetector.h"

int main() {
    try {
        std::string inputStr;
        std::string line;
        while (std::getline(std::cin, line)) {
            inputStr += line + "\n";
        }

        if (inputStr.empty()) {
            std::cerr << "Error: No input provided on stdin.\n";
            return 1;
        }

        std::vector<Transaction> transactions = InputParser::parse(inputStr);

        TransactionGraph graph = TransactionGraphBuilder::build(transactions);

        ScoreStore store;
        store.initializeAccounts();

        HighlightExtractor extractor;

        CycleDetector cycleDetector;
        cycleDetector.detect(graph, store, extractor);

        VelocityDetector velocityDetector;
        velocityDetector.detect(graph, store, extractor);

        SmurfingDetector smurfingDetector;
        smurfingDetector.detect(graph, store, extractor);

        MuleDetector muleDetector;
        muleDetector.detect(graph, store, extractor);

        RiskPropagationDetector propagationDetector;
        propagationDetector.detect(graph, store, extractor);

        FinalRiskScorer::scoreAll(store);

        std::vector<RankedAccount> ranked = TopKRanker::rank(store);

        nlohmann::json highlights = extractor.extract();
        nlohmann::json detectorStats = HighlightExtractor::computeDetectorStats(store);

        std::map<std::string, int> summary = {
            {"safe", 0}, {"low", 0}, {"medium", 0}, {"high", 0}, {"critical", 0}
        };
        for (const auto& pair : store.accounts) {
            std::string severity = pair.second.severityLevel;
            std::transform(severity.begin(), severity.end(), severity.begin(), ::tolower);
            summary[severity]++;
        }

        std::string output = OutputSerializer::serialize(
            transactions.size(),
            store.accounts.size(),
            summary,
            ranked,
            highlights,
            detectorStats
        );

        std::cout << output << std::endl;

    } catch (const std::exception& e) {
        std::cout << OutputSerializer::serializeError(e.what()) << std::endl;
        return 1;
    }

    return 0;
}
