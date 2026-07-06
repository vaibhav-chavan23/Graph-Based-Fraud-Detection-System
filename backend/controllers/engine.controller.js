const transactionService = require('../services/transaction.service');
const engineService = require('../services/engine.service');
const resultsService = require('../services/results.service');

exports.runEngine = async (req, res) => {
    try {
        const transactions = await transactionService.getAllTransactions();
        
        // Exclude _id and format for C++ engine
        const formatted = transactions.map(t => ({
            txnId: t.txnId,
            sender: t.sender,
            receiver: t.receiver,
            amount: t.amount,
            timestamp: t.timestamp
        }));

        const engineOutput = await engineService.runEngine(formatted);
        await resultsService.saveResult(engineOutput);
        
        res.status(200).json({ success: true, message: "Fraud analysis complete. 20 accounts scored." });
    } catch (error) {
        res.status(500).json({ success: false, error: "Engine execution failed: " + error.message });
    }
};
