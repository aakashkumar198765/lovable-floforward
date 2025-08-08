import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import * as Atoms from '../components/atoms';
import * as Molecules from '../components/molecules';

const FormsShowcase = () => {
  const [formData, setFormData] = useState({});

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Form Components</h1>
          <p className="text-xl text-gray-600">
            Complete collection of form inputs and controls
          </p>
        </header>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Sample Form</h3>
          
          <div className="space-y-6">
            <Atoms.InputAllTypes 
              label="Name"
              placeholder="Enter your name"
              type="text"
            />
            
            <Atoms.InputAllTypes 
              label="Email"
              placeholder="Enter your email"
              type="email"
            />
            
            <Atoms.SelectAllTypes 
              label="Role"
              options={[
                { value: 'admin', label: 'Administrator' },
                { value: 'user', label: 'User' },
                { value: 'guest', label: 'Guest' }
              ]}
            />
            
            <Atoms.TextareaAllTypes 
              label="Message"
              placeholder="Enter your message"
            />
            
            <Atoms.DatePickerAllTypes 
              label="Date"
            />
            
            <Atoms.FileUploadAllTypes 
              label="Upload File"
            />
            
            <div className="flex space-x-4">
              <Atoms.Button variant="primary">Submit</Atoms.Button>
              <Atoms.Button variant="outline">Cancel</Atoms.Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<FormsShowcase />);