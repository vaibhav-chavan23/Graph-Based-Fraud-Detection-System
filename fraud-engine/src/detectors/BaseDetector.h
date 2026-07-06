#pragma once
#include "../graph/TransactionGraph.h"
#include "../scoring/ScoreStore.h"
#include "../highlights/HighlightExtractor.h"

class BaseDetector {
public:
    virtual ~BaseDetector() = default;
    virtual void detect(const TransactionGraph& graph, ScoreStore& store, HighlightExtractor& extractor) = 0;
};
