#pragma once
#include <string>

struct Transaction {
    std::string txnId;
    std::string sender;
    std::string receiver;
    double amount;
    long long timestamp;
};
