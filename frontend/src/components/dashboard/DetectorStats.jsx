import React from 'react';

const DetectorStats = ({ stats }) => {
    const items = [
        { label: "Accounts w/ Cycle Risk", value: stats.cycleFlags },
        { label: "Accounts w/ Velocity Risk", value: stats.velocityFlags },
        { label: "Accounts w/ Smurfing Risk", value: stats.smurfingFlags },
        { label: "Accounts w/ Mule Risk", value: stats.muleFlags },
        { label: "Accounts w/ Propagation Risk", value: stats.propagationFlags }
    ];

    return (
        <div className="bg-white border border-sky-200 rounded-lg overflow-hidden">
            <div className="bg-sky-50 p-4 border-b border-sky-200">
                <h2 className="font-bold text-slate-800">Detector Trigger Stats</h2>
            </div>
            <div className="p-4 flex flex-col gap-3">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                        <span className="text-slate-600 text-sm font-semibold">{item.label}</span>
                        <span className="bg-sky-100 text-sky-800 font-mono px-2 py-0.5 rounded border border-sky-200 text-sm">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetectorStats;
