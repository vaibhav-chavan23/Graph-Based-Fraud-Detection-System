import React, { useState } from 'react';
import { transactionApi } from '../../api/transactionApi';

const EditModal = ({ txn, onClose, onSuccess }) => {
    const [sender, setSender] = useState(txn.sender);
    const [receiver, setReceiver] = useState(txn.receiver);
    const [amount, setAmount] = useState(txn.amount);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setError(null);
        if (!sender || !receiver) {
            setError("Sender and receiver are required.");
            return;
        }
        const s = sender.toUpperCase();
        const r = receiver.toUpperCase();
        
        if (s === r) {
            setError("Sender and receiver cannot be the same account.");
            return;
        }
        if (Number(amount) <= 0) {
            setError("Amount must be greater than zero.");
            return;
        }

        try {
            setSaving(true);
            await transactionApi.update(txn.txnId, { sender: s, receiver: r, amount: Number(amount) });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md border border-sky-200">
                <h2 className="text-xl font-bold mb-4">Edit Transaction {txn.txnId}</h2>
                
                {error && <div className="mb-4 text-rose-600 text-sm font-semibold">{error}</div>}
                
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-slate-500 mb-1">Timestamp (Read-only)</label>
                        <input type="text" value={txn.timestamp} disabled className="w-full border border-slate-200 rounded p-2 bg-slate-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Sender</label>
                        <input type="text" value={sender} onChange={e => setSender(e.target.value)} maxLength={1} className="w-full border border-sky-300 rounded p-2 focus:outline-none focus:border-sky-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Receiver</label>
                        <input type="text" value={receiver} onChange={e => setReceiver(e.target.value)} maxLength={1} className="w-full border border-sky-300 rounded p-2 focus:outline-none focus:border-sky-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Amount</label>
                        <input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border border-sky-300 rounded p-2 focus:outline-none focus:border-sky-500" />
                    </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 disabled:bg-sky-200 disabled:cursor-not-allowed">
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
