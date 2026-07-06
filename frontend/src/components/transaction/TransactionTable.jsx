import React, { useState } from 'react';
import EditModal from './EditModal';

const TransactionTable = ({ transactions, onUpdateSuccess }) => {
    const [editingTxn, setEditingTxn] = useState(null);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-sky-50 text-slate-600 border-b border-sky-200">
                        <th className="p-3 font-semibold">Transaction ID</th>
                        <th className="p-3 font-semibold">Sender</th>
                        <th className="p-3 font-semibold">Receiver</th>
                        <th className="p-3 font-semibold">Amount</th>
                        <th className="p-3 font-semibold">Timestamp</th>
                        <th className="p-3 font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(txn => (
                        <tr key={txn.txnId} className="border-b border-slate-100 hover:bg-sky-50">
                            <td className="p-3 flex items-center gap-2">
                                {txn.txnId}
                                {!txn.isDefault && (
                                    <span className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded border border-amber-200">
                                        Edited
                                    </span>
                                )}
                            </td>
                            <td className="p-3">{txn.sender}</td>
                            <td className="p-3">{txn.receiver}</td>
                            <td className="p-3">${txn.amount.toLocaleString()}</td>
                            <td className="p-3">{txn.timestamp}</td>
                            <td className="p-3">
                                <button 
                                    onClick={() => setEditingTxn(txn)}
                                    className="text-sky-600 hover:text-sky-800 font-semibold"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    {transactions.length === 0 && (
                        <tr>
                            <td colSpan="6" className="p-4 text-center text-slate-500">No transactions found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            {editingTxn && (
                <EditModal 
                    txn={editingTxn} 
                    onClose={() => setEditingTxn(null)} 
                    onSuccess={() => {
                        setEditingTxn(null);
                        onUpdateSuccess();
                    }} 
                />
            )}
        </div>
    );
};

export default TransactionTable;
