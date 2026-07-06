import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { engineApi } from '../../api/engineApi';

const RunEngineButton = () => {
    const [running, setRunning] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRun = async () => {
        setRunning(true);
        setError(null);
        try {
            await engineApi.runEngine();
            navigate('/dashboard');
        } catch (err) {
            setError("Engine execution failed. Please try again.");
            setRunning(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <button 
                onClick={handleRun}
                disabled={running}
                className="bg-sky-500 text-white hover:bg-sky-600 px-4 py-2 rounded-md font-semibold disabled:bg-sky-200 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {running ? (
                    <>
                        <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                        Running...
                    </>
                ) : (
                    "Run Fraud Engine"
                )}
            </button>
            {error && <span className="text-rose-600 text-xs font-semibold">{error}</span>}
        </div>
    );
};

export default RunEngineButton;
