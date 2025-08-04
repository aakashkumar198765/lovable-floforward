import React, { useState } from 'react';
import Input from './Input';

const InputDemo: React.FC = () => {
  const [value, setValue] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="p-8 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Clean Input Component Demo
      </h1>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Basic Usage</h2>
        
        {/* Basic Input */}
        <Input
          id="basic-input"
          label="Basic Input"
          placeholder="Enter some text..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="This is a clean, reusable input component"
        />
        
        {/* Email Input */}
        <Input
          id="email-input"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        {/* Password Input */}
        <Input
          id="password-input"
          type="password"
          label="Password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          helperText="Minimum 8 characters"
        />
        
        {/* Different Sizes */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Sizes</h3>
          <Input
            id="small-input"
            label="Small Input"
            placeholder="Small size"
            size="sm"
          />
          <Input
            id="medium-input"
            label="Medium Input"
            placeholder="Medium size"
            size="md"
          />
          <Input
            id="large-input"
            label="Large Input"
            placeholder="Large size"
            size="lg"
          />
        </div>
        
        {/* Different Variants */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Variants</h3>
          <Input
            id="default-variant"
            label="Default Variant"
            placeholder="Default styling"
            variant="default"
          />
          <Input
            id="outlined-variant"
            label="Outlined Variant"
            placeholder="Outlined styling"
            variant="outlined"
          />
          <Input
            id="filled-variant"
            label="Filled Variant"
            placeholder="Filled styling"
            variant="filled"
          />
        </div>
        
        {/* Status States */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Status States</h3>
          <Input
            id="error-input"
            label="Error State"
            placeholder="This has an error"
            status="error"
            errorMessage="This field is required"
          />
          <Input
            id="warning-input"
            label="Warning State"
            placeholder="This has a warning"
            status="warning"
            helperText="Please verify this information"
          />
          <Input
            id="success-input"
            label="Success State"
            placeholder="This is successful"
            status="success"
            helperText="Looks good!"
          />
        </div>
        
        {/* Disabled and Readonly */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Disabled & Readonly</h3>
          <Input
            id="disabled-input"
            label="Disabled Input"
            placeholder="This is disabled"
            disabled
            value="Disabled value"
          />
          <Input
            id="readonly-input"
            label="Readonly Input"
            placeholder="This is readonly"
            readonly
            value="Readonly value"
          />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
          ✅ Component Cleanup Complete
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          The Input component has been successfully cleaned up and now only includes essential props:
        </p>
        <ul className="text-sm text-green-700 dark:text-green-300 mt-2 list-disc list-inside">
          <li>Basic HTML input props (value, onChange, disabled, etc.)</li>
          <li>Styling props (size, variant, status, className)</li>
          <li>Label and helper text support</li>
          <li>Icon support (leftIcon, rightIcon)</li>
          <li>Accessibility props</li>
        </ul>
        <p className="text-sm text-green-700 dark:text-green-300 mt-2">
          <strong>Removed:</strong> commerceState, workflowContext, aiConfig, schema, allowedActions, 
          userRole, data, onUpdate, auditTrail, encryptionLevel
        </p>
      </div>
    </div>
  );
};

export default InputDemo;