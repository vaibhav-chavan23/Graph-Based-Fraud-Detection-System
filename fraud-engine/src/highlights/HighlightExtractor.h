#pragma once
#include <nlohmann/json.hpp>
#include "../scoring/ScoreStore.h"

class HighlightExtractor {
public:
    nlohmann::json cycleHighlight;
    nlohmann::json velocityHighlight;
    nlohmann::json smurfingHighlight;
    nlohmann::json muleHighlight;
    nlohmann::json propagationHighlight;

    HighlightExtractor() {
        auto emptyHighlight = nlohmann::json{
            {"summary", nlohmann::json::object()},
            {"topFindings", nlohmann::json::array()},
            {"allFindings", nlohmann::json::array()}
        };
        cycleHighlight = emptyHighlight;
        velocityHighlight = emptyHighlight;
        smurfingHighlight = emptyHighlight;
        muleHighlight = emptyHighlight;
        propagationHighlight = emptyHighlight;
    }

    void setCycleHighlight(const nlohmann::json& highlight) { cycleHighlight = highlight; }
    void setVelocityHighlight(const nlohmann::json& highlight) { velocityHighlight = highlight; }
    void setSmurfingHighlight(const nlohmann::json& highlight) { smurfingHighlight = highlight; }
    void setMuleHighlight(const nlohmann::json& highlight) { muleHighlight = highlight; }
    void setPropagationHighlight(const nlohmann::json& highlight) { propagationHighlight = highlight; }

    nlohmann::json extract() const {
        nlohmann::json j;
        j["cycle"] = cycleHighlight;
        j["velocity"] = velocityHighlight;
        j["smurfing"] = smurfingHighlight;
        j["mule"] = muleHighlight;
        j["propagation"] = propagationHighlight;
        return j;
    }

    static nlohmann::json computeDetectorStats(const ScoreStore& store) {
        int cycleFlags = 0, velocityFlags = 0, smurfingFlags = 0, muleFlags = 0, propagationFlags = 0;
        
        for (const auto& pair : store.accounts) {
            const auto& scores = pair.second.scores;
            if (scores.cycleScore > 0) cycleFlags++;
            if (scores.velocityScore > 0) velocityFlags++;
            if (scores.smurfingScore > 0) smurfingFlags++;
            if (scores.muleScore > 0) muleFlags++;
            if (scores.propagationScore > 0) propagationFlags++;
        }
        
        nlohmann::json j;
        j["cycleFlags"] = cycleFlags;
        j["velocityFlags"] = velocityFlags;
        j["smurfingFlags"] = smurfingFlags;
        j["muleFlags"] = muleFlags;
        j["propagationFlags"] = propagationFlags;
        return j;
    }
};
