import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';

const DocsApp = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Component Library Documentation</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/getting-started" className="hover:underline">Getting Started</Link>
              <Link to="/api" className="hover:underline">API Reference</Link>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/api" element={<APIReference />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const HomePage = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">Welcome to Our Component Library</h1>
    <p className="text-lg text-gray-600 mb-8">
      A comprehensive collection of reusable React components built with modern best practices.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-2">🧱 Atomic Design</h3>
        <p className="text-gray-600">Built following atomic design principles for maximum reusability.</p>
      </div>
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-2">🎨 Tailwind CSS</h3>
        <p className="text-gray-600">Styled with Tailwind CSS for rapid customization.</p>
      </div>
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-2">📱 Responsive</h3>
        <p className="text-gray-600">Mobile-first responsive design for all screen sizes.</p>
      </div>
    </div>
  </div>
);

const GettingStarted = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">Getting Started</h1>
    <div className="prose max-w-none">
      <h2>Installation</h2>
      <pre className="bg-gray-100 p-4 rounded">npm install reusable-components</pre>
      
      <h2>Usage</h2>
      <pre className="bg-gray-100 p-4 rounded">
{`import { Button, Avatar } from 'reusable-components';

function MyApp() {
  return (
    <div>
      <Avatar name="John Doe" />
      <Button variant="primary">Click me</Button>
    </div>
  );
}`}
      </pre>
    </div>
  </div>
);

const APIReference = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">API Reference</h1>
    <p className="text-gray-600">Detailed API documentation for all components.</p>
  </div>
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<DocsApp />);