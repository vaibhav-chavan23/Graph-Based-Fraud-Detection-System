#pragma once
#include <string>
#include <nlohmann/json.hpp>
#include "../models/AccountRisk.h"
#include "../scoring/TopKRanker.h"
#include "../highlights/HighlightExtractor.h"

class OutputSerializer {
public:
    static std::string serialize(
        size_t totalTransactions,
        size_t totalAccounts,
        const std::map<std::string, int>& summary,
        const std::vector<RankedAccount>& rankedAccounts,
        const nlohmann::json& highlights,
        const nlohmann::json& detectorStats
    );
    static std::string serializeError(const std::string& errorMsg);
};
