#pragma once
#include <string>
#include "DetectorScores.h"

struct AccountRisk {
    std::string accountId;
    DetectorScores scores;
    double finalRiskScore = 0.0;
    std::string severityLevel = "SAFE";
};
