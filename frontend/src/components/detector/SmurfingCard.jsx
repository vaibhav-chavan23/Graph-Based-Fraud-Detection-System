import React, { useState } from 'react';

const SmurfingCard = ({ data }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!data || !data.allFindings) return null;

    const { summary, topFindings, allFindings } = data;
    const hasFindings = allFindings.length > 0;

    return (
        <div className="bg-white border border-sky-200 rounded-lg flex flex-col transition-all duration-300">
            <div className="bg-sky-50 p-4 border-b border-sky-200 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Smurfing Detector</h2>
                <span className="text-xs font-mono bg-sky-100 text-sky-700 px-2 py-1 rounded">HashMap</span>
            </div>
            
            <div className="p-4 flex flex-col gap-4">
                {!hasFindings ? (
                    <div className="text-center py-6">
                        <div className="text-sm font-semibold text-slate-500 mb-2">Total Findings: 0</div>
                        <div className="text-slate-600">No suspicious patterns detected.</div>
                    </div>
                ) : (
                    <>
                        {/* Summary Section */}
                        <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 border border-slate-200 rounded p-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 font-semibold uppercase leading-tight">Candidates</span>
                                <span className="font-mono text-slate-800 text-sm">{summary.candidatesFound}</span>
                            </div>
                            <div className="flex flex-col border-x border-slate-200">
                                <span className="text-[10px] text-slate-500 font-semibold uppercase leading-tight">Max Reqs</span>
                                <span className="font-mono text-slate-800 text-sm">{summary.largestRecipientCount}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 font-semibold uppercase leading-tight">Total Amt</span>
                                <span className="font-mono text-slate-800 text-sm">${summary.totalStructuredAmount?.toFixed(0)}</span>
                            </div>
                        </div>

                        {/* Top Findings */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-slate-700">Top Findings</span>
                                <div className="text-right">
                                    <div className="text-xs font-semibold text-slate-500">Total Findings: {allFindings.length}</div>
                                    <div className="text-[10px] text-slate-400">Showing Top {topFindings.length} by Risk Score</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {topFindings.map((finding, idx) => (
                                    <div key={idx} className="text-sm flex gap-2">
                                        <span className="text-slate-400 font-mono w-4">#{idx + 1}</span>
                                        <span className="font-mono text-slate-700 flex-1 break-all">
                                            {finding.accountId}: {finding.description}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* View All Button & Expanded Table */}
                        {allFindings.length > topFindings.length && (
                            <div className="mt-2 flex flex-col items-center">
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 px-3 py-1 rounded border border-sky-200 transition-colors"
                                >
                                    {isExpanded ? "View Less" : "View All"}
                                </button>

                                <div className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] mt-4 opacity-100' : 'max-h-0 mt-0 opacity-0'}`}>
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-sky-200 text-slate-500 text-xs">
                                                <th className="py-2 pr-2 font-semibold w-10">Rank</th>
                                                <th className="py-2 pr-2 font-semibold">Finding</th>
                                                <th className="py-2 font-semibold text-right">Risk</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allFindings.map((finding, idx) => (
                                                <tr key={idx} className="border-b border-slate-100 last:border-0">
                                                    <td className="py-2 pr-2 font-mono text-slate-500">{idx + 1}</td>
                                                    <td className="py-2 pr-2 font-mono text-slate-700 break-all leading-tight">
                                                        {finding.accountId}: {finding.description}
                                                    </td>
                                                    <td className="py-2 font-mono text-amber-600 text-right">{finding.smurfingScore}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SmurfingCard;
