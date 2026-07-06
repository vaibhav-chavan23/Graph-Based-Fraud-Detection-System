import React from 'react';
import SeverityBadge from '../shared/SeverityBadge';

const TopSuspiciousTable = ({ rankedAccounts }) => {
    return (
        <div className="bg-white border border-sky-200 rounded-lg overflow-hidden">
            <div className="bg-sky-50 p-4 border-b border-sky-200">
                <h2 className="font-bold text-slate-800">Top Suspicious Accounts</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-sky-200 text-slate-500 text-sm">
                            <th className="p-3 font-semibold">Rank</th>
                            <th className="p-3 font-semibold">Account ID</th>
                            <th className="p-3 font-semibold">Risk Score</th>
                            <th className="p-3 font-semibold">Severity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankedAccounts.map(acc => (
                            <tr key={acc.accountId} className="border-b border-slate-100">
                                <td className="p-3 font-semibold text-slate-700">#{acc.rank}</td>
                                <td className="p-3">{acc.accountId}</td>
                                <td className="p-3 font-mono">{acc.finalRiskScore.toFixed(1)}</td>
                                <td className="p-3"><SeverityBadge severity={acc.severityLevel} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopSuspiciousTable;
