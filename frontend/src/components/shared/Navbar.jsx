import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const linkClass = ({ isActive }) =>
        isActive
            ? "text-sky-600 font-semibold border-b-2 border-sky-600 pb-1"
            : "text-slate-600 hover:text-sky-600 pb-1";

    return (
        <nav className="bg-white border-b border-sky-200 px-6 py-4 flex items-center justify-between">
            <div className="font-bold text-xl text-sky-700">Fraud Engine</div>
            <div className="flex gap-6">
                <NavLink to="/" className={linkClass}>Transactions</NavLink>
                <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                <NavLink to="/detectors" className={linkClass}>Detectors</NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
