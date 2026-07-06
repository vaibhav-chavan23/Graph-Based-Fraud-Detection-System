const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    txnId: { type: String, required: true, unique: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    isDefault: { type: Boolean, default: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);
