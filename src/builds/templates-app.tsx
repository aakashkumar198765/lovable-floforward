import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import * as Templates from '../components/templates';

const TemplatesShowcase = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900">Page Templates</h1>
            <p className="text-gray-600 mt-2">Complete page layouts and templates</p>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Templates.ListingPage />} />
          <Route path="/detail" element={<Templates.DetailPage />} />
          <Route path="/create" element={<Templates.CreatePage />} />
        </Routes>
      </div>
    </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<TemplatesShowcase />);