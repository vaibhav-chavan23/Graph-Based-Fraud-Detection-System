import React, { useState, useEffect } from 'react';
import { transactionApi } from '../api/transactionApi';
import TransactionTable from '../components/transaction/TransactionTable';
import UploadCsvButton from '../components/transaction/UploadCsvButton';
import RunEngineButton from '../components/transaction/RunEngineButton';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const TransactionPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await transactionApi.getAll();
            setTransactions(res.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Transaction Management</h1>
                <div className="flex gap-4">
                    <UploadCsvButton onUploadSuccess={fetchTransactions} />
                    <RunEngineButton />
                </div>
            </div>

            {error && <div className="text-rose-600 font-semibold">{error}</div>}
            
            <div className="bg-white border border-sky-200 rounded-lg overflow-hidden">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <TransactionTable transactions={transactions} onUpdateSuccess={fetchTransactions} />
                )}
            </div>
        </div>
    );
};

export default TransactionPage;
