import React from 'react';

const SummaryCards = ({ totalTransactions, totalAccounts, summary }) => {
    const cards = [
        { label: "Transactions", value: totalTransactions, accent: false },
        { label: "Accounts", value: totalAccounts, accent: false },
        { label: "Safe", value: summary.safe, accent: false },
        { label: "Low Risk", value: summary.low, accent: false },
        { label: "Medium Risk", value: summary.medium, accent: true },
        { label: "High Risk", value: summary.high, accent: true },
        { label: "Critical", value: summary.critical, accent: true }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {cards.map((c, i) => (
                <div key={i} className={`border border-sky-200 rounded-lg p-4 flex flex-col items-center justify-center ${c.accent ? 'bg-orange-50' : 'bg-white'}`}>
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1 text-center">{c.label}</div>
                    <div className="text-2xl font-bold text-slate-800">{c.value}</div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
