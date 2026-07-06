#pragma once
#include "TransactionGraph.h"
#include <vector>

class TransactionGraphBuilder {
public:
    static TransactionGraph build(const std::vector<Transaction>& transactions) {
        TransactionGraph graph;
        for (const auto& t : transactions) {
            graph.addEdge(t);
        }
        return graph;
    }
};
