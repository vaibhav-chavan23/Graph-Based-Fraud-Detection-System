import React from 'react';

const ExpandedRow = ({ scores }) => {
    const data = [
        { label: "Cycle Score", value: scores.cycleScore },
        { label: "Velocity Score", value: scores.velocityScore },
        { label: "Smurfing Score", value: scores.smurfingScore },
        { label: "Mule Score", value: scores.muleScore },
        { label: "Propagation Score", value: scores.propagationScore }
    ];

    return (
        <div className="bg-slate-50 p-4 shadow-inner text-sm grid grid-cols-2 md:grid-cols-5 gap-4">
            {data.map((d, i) => (
                <div key={i} className="flex flex-col border border-slate-200 bg-white rounded p-2">
                    <span className="text-slate-500 font-semibold mb-1">{d.label}</span>
                    <span className="font-mono text-slate-800">{d.value.toFixed(1)}</span>
                </div>
            ))}
        </div>
    );
};

export default ExpandedRow;
