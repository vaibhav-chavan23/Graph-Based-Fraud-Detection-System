const mongoose = require('mongoose');

const fraudResultSchema = new mongoose.Schema({
    executedAt: { type: Date, default: Date.now },
    totalTransactions: { type: Number, required: true },
    totalAccounts: { type: Number, required: true },
    summary: { type: Object, required: true },
    rankedAccounts: { type: Array, required: true },
    highlights: { type: Object, required: true },
    detectorStats: { type: Object, required: true }
});

module.exports = mongoose.model('FraudResult', fraudResultSchema);
