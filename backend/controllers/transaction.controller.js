const transactionService = require('../services/transaction.service');

exports.getAllTransactions = async (req, res) => {
    try {
        const data = await transactionService.getAllTransactions();
        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const data = await transactionService.updateTransaction(req.params.txnId, req.body);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.uploadCsv = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No file uploaded." });
        }
        const count = await transactionService.uploadCsv(req.file.path);
        res.status(200).json({ success: true, message: "Dataset replaced successfully.", count });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
