#pragma once
#include <string>

struct RankedAccount {
    int rank;
    std::string accountId;
    double cycleScore;
    double velocityScore;
    double smurfingScore;
    double muleScore;
    double propagationScore;
    double finalRiskScore;
    std::string severityLevel;
};
