#include "OutputSerializer.h"

using json = nlohmann::json;

std::string OutputSerializer::serialize(
    size_t totalTransactions,
    size_t totalAccounts,
    const std::map<std::string, int>& summary,
    const std::vector<RankedAccount>& rankedAccounts,
    const json& highlights,
    const json& detectorStats
) {
    json j;
    j["totalTransactions"] = totalTransactions;
    j["totalAccounts"] = totalAccounts;
    
    j["summary"] = summary;
    
    json rankedArray = json::array();
    for (const auto& ra : rankedAccounts) {
        json item;
        item["rank"] = ra.rank;
        item["accountId"] = ra.accountId;
        item["cycleScore"] = ra.cycleScore;
        item["velocityScore"] = ra.velocityScore;
        item["smurfingScore"] = ra.smurfingScore;
        item["muleScore"] = ra.muleScore;
        item["propagationScore"] = ra.propagationScore;
        item["finalRiskScore"] = ra.finalRiskScore;
        item["severityLevel"] = ra.severityLevel;
        rankedArray.push_back(item);
    }
    j["rankedAccounts"] = rankedArray;
    
    j["highlights"] = highlights;
    j["detectorStats"] = detectorStats;
    
    return j.dump(); // returns minified JSON string
}

std::string OutputSerializer::serializeError(const std::string& errorMsg) {
    json j;
    j["error"] = errorMsg;
    return j.dump();
}
