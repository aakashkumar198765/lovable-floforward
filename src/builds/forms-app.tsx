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
            {/* InputAllTypes doesn't support label prop - it's a commerce state demo component */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <Atoms.InputAllTypes 
                initialInputValue="Enter your name"
                onValueChange={(value) => console.log('Name:', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Atoms.InputAllTypes 
                initialInputValue="Enter your email"
                onValueChange={(value) => console.log('Email:', value)}
              />
            </div>
            
            {/* SelectAllTypes doesn't support label or options props - it's a demo component */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <Atoms.SelectAllTypes 
                onStateChange={(state) => console.log('Role state:', state)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <Atoms.TextareaAllTypes 
                initialTextareaValue="Enter your message"
                onValueChange={(value) => console.log('Message:', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <Atoms.DatePickerAllTypes />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
              <Atoms.FileUploadAllTypes />
            </div>
            
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