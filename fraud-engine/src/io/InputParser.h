#pragma once
#include <vector>
#include <string>
#include "../models/Transaction.h"

class InputParser {
public:
    static std::vector<Transaction> parse(const std::string& jsonInput);
};
