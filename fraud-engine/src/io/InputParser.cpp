#include "InputParser.h"
#include <nlohmann/json.hpp>
#include <stdexcept>

using json = nlohmann::json;

std::vector<Transaction> InputParser::parse(const std::string& jsonInput) {
    std::vector<Transaction> transactions;
    if (jsonInput.empty()) return transactions;
    
    try {
        json j = json::parse(jsonInput);
        if (!j.is_array()) {
            throw std::runtime_error("Input JSON must be an array of transactions.");
        }
        
        for (const auto& item : j) {
            Transaction t;
            t.txnId = item.value("txnId", "");
            t.sender = item.value("sender", "");
            t.receiver = item.value("receiver", "");
            t.amount = item.value("amount", 0.0);
            t.timestamp = item.value("timestamp", 0LL);
            transactions.push_back(t);
        }
    } catch (const std::exception& e) {
        throw std::runtime_error(std::string("JSON parsing error: ") + e.what());
    }
    
    return transactions;
}
