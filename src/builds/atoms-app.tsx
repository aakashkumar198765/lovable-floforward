import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import * as Atoms from '../components/atoms';

const AtomsShowcase = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Atomic Components</h1>
          <p className="text-xl text-gray-600">
            Basic building blocks of our design system
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Avatar Examples */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Avatar</h3>
            <div className="space-y-4">
              <Atoms.Avatar name="John Doe" size="sm" />
              <Atoms.Avatar name="Jane Smith" size="md" />
              <Atoms.Avatar name="Bob Johnson" size="lg" />
            </div>
          </div>

          {/* Badge Examples */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Badges</h3>
            <div className="space-y-2">
              <Atoms.Badge variant="primary">Primary</Atoms.Badge>
              <Atoms.Badge variant="success">Success</Atoms.Badge>
              <Atoms.Badge variant="warning">Warning</Atoms.Badge>
              <Atoms.Badge variant="danger">Danger</Atoms.Badge>
            </div>
          </div>

          {/* Button Examples */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Buttons</h3>
            <div className="space-y-2">
              <Atoms.Button variant="primary">Primary</Atoms.Button>
              <Atoms.Button variant="secondary">Secondary</Atoms.Button>
              <Atoms.Button variant="outline">Outline</Atoms.Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<AtomsShowcase />);