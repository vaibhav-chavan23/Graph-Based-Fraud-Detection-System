const FraudResult = require('../models/FraudResult.model');

class ResultsService {
    async saveResult(data) {
        return FraudResult.findOneAndUpdate(
            {}, 
            { ...data, executedAt: Date.now() }, 
            { upsert: true, new: true }
        );
    }

    async getLatestResult() {
        return FraudResult.findOne();
    }
}

module.exports = new ResultsService();
