import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import TransactionPage from './pages/TransactionPage';
import DashboardPage from './pages/DashboardPage';
import DetectorPage from './pages/DetectorPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-slate-800">
        <Navbar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<TransactionPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/detectors" element={<DetectorPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
