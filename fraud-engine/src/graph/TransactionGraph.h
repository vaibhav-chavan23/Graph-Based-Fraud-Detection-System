#pragma once
#include <string>
#include <vector>
#include <map>
#include "../models/Transaction.h"

struct Edge {
    std::string to;
    double amount;
    long long timestamp;
    std::string txnId;
};

class TransactionGraph {
public:
    std::map<std::string, std::vector<Edge>> adj;
    std::map<std::string, std::vector<Edge>> rev_adj;
    std::vector<std::string> nodes;

    TransactionGraph() {
        for (char c = 'A'; c <= 'T'; ++c) {
            std::string id(1, c);
            nodes.push_back(id);
            adj[id] = {};
            rev_adj[id] = {};
        }
    }

    void addEdge(const Transaction& t) {
        adj[t.sender].push_back({t.receiver, t.amount, t.timestamp, t.txnId});
        rev_adj[t.receiver].push_back({t.sender, t.amount, t.timestamp, t.txnId});
    }
};
