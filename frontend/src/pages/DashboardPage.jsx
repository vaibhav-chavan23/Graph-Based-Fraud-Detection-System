import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultsApi } from '../api/resultsApi';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import SummaryCards from '../components/dashboard/SummaryCards';
import TopSuspiciousTable from '../components/dashboard/TopSuspiciousTable';
import AccountRiskTable from '../components/dashboard/AccountRiskTable';
import DetectorStats from '../components/dashboard/DetectorStats';

const DashboardPage = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setLoading(true);
                const res = await resultsApi.getLatestResult();
                setResult(res.data);
                setError(null);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError("No analysis available. Go to the Transaction Management page and click RUN FRAUD ENGINE.");
                } else {
                    setError("Failed to load dashboard data.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border border-sky-200 rounded-lg text-center">
                <p className="text-slate-600 mb-4">{error}</p>
                <Link to="/" className="inline-block bg-sky-500 text-white px-4 py-2 rounded font-semibold hover:bg-sky-600">
                    Go to Transactions
                </Link>
            </div>
        );
    }

    if (!result) return null;

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <h1 className="text-2xl font-bold text-slate-800">Fraud Analysis Dashboard</h1>
            
            <SummaryCards 
                totalTransactions={result.totalTransactions}
                totalAccounts={result.totalAccounts}
                summary={result.summary} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <TopSuspiciousTable rankedAccounts={result.rankedAccounts.slice(0, 5)} />
                    <AccountRiskTable rankedAccounts={result.rankedAccounts} />
                </div>
                <div className="lg:col-span-1">
                    <DetectorStats stats={result.detectorStats} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
