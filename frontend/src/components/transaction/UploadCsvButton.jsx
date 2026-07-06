import React, { useRef, useState } from 'react';
import { transactionApi } from '../../api/transactionApi';

const UploadCsvButton = ({ onUploadSuccess }) => {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError(null);
        setUploading(true);
        try {
            await transactionApi.uploadCsv(file);
            onUploadSuccess();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-white text-sky-700 border border-sky-300 hover:bg-sky-50 px-4 py-2 rounded-md font-semibold disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                {uploading ? "Uploading..." : "Upload CSV"}
            </button>
            {error && <span className="text-rose-600 text-xs font-semibold">{error}</span>}
        </div>
    );
};

export default UploadCsvButton;
