import React, { useState } from 'react';
import SeverityBadge from '../shared/SeverityBadge';
import ExpandedRow from './ExpandedRow';

const AccountRiskTable = ({ rankedAccounts }) => {
    const [expandedAcc, setExpandedAcc] = useState(null);

    const toggleRow = (accountId) => {
        if (expandedAcc === accountId) setExpandedAcc(null);
        else setExpandedAcc(accountId);
    };

    return (
        <div className="bg-white border border-sky-200 rounded-lg overflow-hidden mt-6">
            <div className="bg-sky-50 p-4 border-b border-sky-200">
                <h2 className="font-bold text-slate-800">Full Account Rankings</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-sky-200 text-slate-500 text-sm">
                            <th className="p-3 font-semibold">Rank</th>
                            <th className="p-3 font-semibold">Account ID</th>
                            <th className="p-3 font-semibold">Final Score</th>
                            <th className="p-3 font-semibold">Severity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankedAccounts.map(acc => (
                            <React.Fragment key={acc.accountId}>
                                <tr 
                                    className={`border-b border-slate-100 hover:bg-sky-50 cursor-pointer ${expandedAcc === acc.accountId ? 'bg-sky-50' : ''}`}
                                    onClick={() => toggleRow(acc.accountId)}
                                >
                                    <td className="p-3 font-semibold text-slate-700">#{acc.rank}</td>
                                    <td className="p-3">{acc.accountId}</td>
                                    <td className="p-3 font-mono">{acc.finalRiskScore.toFixed(1)}</td>
                                    <td className="p-3"><SeverityBadge severity={acc.severityLevel} /></td>
                                </tr>
                                {expandedAcc === acc.accountId && (
                                    <tr>
                                        <td colSpan="4" className="p-0 border-b border-slate-200">
                                            <ExpandedRow scores={acc} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccountRiskTable;
