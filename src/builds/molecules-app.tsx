import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import * as Molecules from '../components/molecules';

const MoleculesShowcase = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Molecular Components</h1>
          <p className="text-xl text-gray-600">
            Combined atomic components forming functional units
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Box */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Search Box</h3>
            <Molecules.SearchBox placeholder="Search components..." />
          </div>

          {/* Metric Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Metric Card</h3>
            <Molecules.MetricCard 
              title="Total Users"
              metric={{
                value: 1234,
                format: 'number'
              }}
              trend={{
                value: 12,
                direction: 'up',
                period: 'vs last month',
                isPositive: true
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<MoleculesShowcase />);