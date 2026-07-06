import React from 'react';

const SeverityBadge = ({ severity }) => {
    let classes = "px-2 py-1 rounded text-xs font-semibold border ";
    
    switch(severity?.toUpperCase()) {
        case 'SAFE':
            classes += "bg-emerald-50 text-emerald-700 border-emerald-200";
            break;
        case 'LOW':
            classes += "bg-sky-50 text-sky-700 border-sky-200";
            break;
        case 'MEDIUM':
            classes += "bg-amber-50 text-amber-700 border-amber-200";
            break;
        case 'HIGH':
            classes += "bg-orange-50 text-orange-700 border-orange-200";
            break;
        case 'CRITICAL':
            classes += "bg-rose-50 text-rose-700 border-rose-200";
            break;
        default:
            classes += "bg-slate-50 text-slate-700 border-slate-200";
    }

    return (
        <span className={classes}>{severity?.toUpperCase() || 'UNKNOWN'}</span>
    );
};

export default SeverityBadge;
