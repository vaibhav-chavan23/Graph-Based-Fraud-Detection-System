#pragma once
#include <map>
#include <string>
#include <vector>
#include "../models/AccountRisk.h"

class ScoreStore {
public:
    std::map<std::string, AccountRisk> accounts;

    void initializeAccounts() {
        for (char c = 'A'; c <= 'T'; ++c) {
            std::string id(1, c);
            accounts[id] = AccountRisk{id, DetectorScores(), 0.0, "SAFE"};
        }
    }

    void addCycleScore(const std::string& accountId, double score) {
        accounts[accountId].scores.cycleScore = std::min(40.0, accounts[accountId].scores.cycleScore + score);
    }

    void setVelocityScore(const std::string& accountId, double score) {
        accounts[accountId].scores.velocityScore = score;
    }

    void setSmurfingScore(const std::string& accountId, double score) {
        accounts[accountId].scores.smurfingScore = score;
    }

    void setMuleScore(const std::string& accountId, double score) {
        accounts[accountId].scores.muleScore = score;
    }

    void addPropagationScore(const std::string& accountId, double score) {
        accounts[accountId].scores.propagationScore = std::min(10.0, accounts[accountId].scores.propagationScore + score);
    }
};
