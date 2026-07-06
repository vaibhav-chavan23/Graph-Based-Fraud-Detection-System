import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultsApi } from '../api/resultsApi';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import CycleCard from '../components/detector/CycleCard';
import VelocityCard from '../components/detector/VelocityCard';
import SmurfingCard from '../components/detector/SmurfingCard';
import MuleCard from '../components/detector/MuleCard';
import PropagationCard from '../components/detector/PropagationCard';

const DetectorPage = () => {
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
                    setError("Failed to load detector data.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, []);

    if (loading) return <LoadingSpinner />;

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
    const { highlights } = result;

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <h1 className="text-2xl font-bold text-slate-800">Detector Explorer</h1>
            <p className="text-slate-600">Deep dive into the highest-scoring findings produced by each of the 5 DSA-based detectors during the latest run.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CycleCard data={highlights.cycle} />
                <VelocityCard data={highlights.velocity} />
                <SmurfingCard data={highlights.smurfing} />
                <MuleCard data={highlights.mule} />
                <PropagationCard data={highlights.propagation} />
            </div>
        </div>
    );
};

export default DetectorPage;
