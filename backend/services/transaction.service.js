const Transaction = require('../models/Transaction.model');
const defaultTransactions = require('../data/defaultTransactions');
const fs = require('fs');
const csv = require('csv-parser');

class TransactionService {
    async seedTransactions() {
        const count = await Transaction.countDocuments();
        if (count === 0) {
            await Transaction.insertMany(defaultTransactions);
            console.log('Database seeded with default transactions.');
        }
    }

    async getAllTransactions() {
        return Transaction.find().sort({ txnId: 1 }).lean();
    }

    async updateTransaction(txnId, data) {
        const { sender, receiver, amount } = data;
        
        // Validation
        if (!sender || !receiver || !amount) throw new Error("Missing fields.");
        if (sender === receiver) throw new Error("Sender and receiver cannot be the same account.");
        if (amount <= 0) throw new Error("Amount must be greater than zero.");
        
        const validAccounts = 'ABCDEFGHIJKLMNOPQRST'.split('');
        if (!validAccounts.includes(sender) || !validAccounts.includes(receiver)) {
            throw new Error("Invalid account ID.");
        }

        const txn = await Transaction.findOneAndUpdate(
            { txnId },
            { sender, receiver, amount, isDefault: false },
            { new: true }
        );

        if (!txn) throw new Error("Transaction not found.");
        return txn;
    }

    async uploadCsv(filePath) {
        const results = [];
        const validAccounts = 'ABCDEFGHIJKLMNOPQRST'.split('');
        
        return new Promise((resolve, reject) => {
            let rowNumber = 1;
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    rowNumber++;
                    const amount = parseFloat(data.amount);
                    const timestamp = parseInt(data.timestamp, 10);
                    
                    if (!data.txnId || !data.sender || !data.receiver || isNaN(amount) || isNaN(timestamp)) {
                        return reject(new Error(`Row ${rowNumber}: Missing or invalid fields.`));
                    }
                    if (data.sender === data.receiver) {
                        return reject(new Error(`Row ${rowNumber}: Sender and receiver cannot be the same account.`));
                    }
                    if (amount <= 0) {
                        return reject(new Error(`Row ${rowNumber}: Amount must be greater than zero.`));
                    }
                    if (!validAccounts.includes(data.sender) || !validAccounts.includes(data.receiver)) {
                        return reject(new Error(`Row ${rowNumber}: Invalid account ID.`));
                    }
                    
                    results.push({
                        txnId: data.txnId,
                        sender: data.sender,
                        receiver: data.receiver,
                        amount,
                        timestamp,
                        isDefault: true
                    });
                })
                .on('end', async () => {
                    if (results.length === 0 || results.length > 500) {
                        return reject(new Error("Row count must be between 1 and 500."));
                    }
                    
                    const txnIds = new Set(results.map(r => r.txnId));
                    if (txnIds.size !== results.length) {
                        return reject(new Error("Duplicate txnId found in CSV."));
                    }

                    try {
                        await Transaction.deleteMany({});
                        await Transaction.insertMany(results);
                        fs.unlinkSync(filePath);
                        resolve(results.length);
                    } catch (err) {
                        reject(err);
                    }
                })
                .on('error', (error) => reject(error));
        });
    }
}

module.exports = new TransactionService();
