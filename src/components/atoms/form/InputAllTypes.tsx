import React, { useState } from 'react';
import { CommerceState } from '../../../types';
import Input from './Input';

interface InputAllTypesProps {
  className?: string;
  style?: React.CSSProperties;
  onStateChange?: (state: CommerceState) => void;
  onValueChange?: (value: string) => void;
  initialCommerceState?: CommerceState;
  initialInputValue?: string;
}

const InputAllTypes: React.FC<InputAllTypesProps> = ({
  className = '',
  style = {},
  onStateChange,
  onValueChange,
  initialCommerceState = 'initiation',
  initialInputValue = ''
}) => {
  const [inputValue, setInputValue] = useState<string>(initialInputValue);
  const [commerceState, setCommerceState] = useState<CommerceState>(initialCommerceState);

  const commerceStates: CommerceState[] = [
    'initiation',
    'agreement', 
    'execution',
    'settlement',
    'completion'
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    
    if (onValueChange && typeof onValueChange === 'function') {
      onValueChange(newValue);
    }
  };

  const handleCommerceStateChange = (newState: CommerceState) => {
    setCommerceState(newState);
    
    if (onStateChange && typeof onStateChange === 'function') {
      onStateChange(newState);
    }
  };

  return (
    <div className={`space-y-6 ${className}`} style={style}>
      {/* Commerce State Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Commerce State
        </label>
        <select
          value={commerceState}
          onChange={(e) => {
            const newState = e.target.value as CommerceState;
            if (commerceStates.includes(newState)) {
              handleCommerceStateChange(newState);
            }
          }}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {commerceStates.map((state) => (
            <option key={state} value={state}>
              {state.charAt(0).toUpperCase() + state.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Basic Input */}
      <Input
        id="basic-input"
        label="Basic Input"
        placeholder="Enter some text..."
        value={inputValue}
        onChange={handleInputChange}
        helperText=""
      />

      {/* Input with different sizes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          id="small-input"
          label="Small Size"
          placeholder="Small input"
          size="sm"

        />
        <Input
          id="medium-input"
          label="Medium Size"
          placeholder="Medium input"
          size="md"

        />
        <Input
          id="large-input"
          label="Large Size"
          placeholder="Large input"
          size="lg"

        />
      </div>

      {/* Input with different statuses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="error-input"
          label="Error State"
          placeholder="Error input"
          status="error"
          errorMessage="This field has an error"

        />
        <Input
          id="success-input"
          label="Success State"
          placeholder="Success input"
          status="success"
          helperText="This field is valid"

        />
        <Input
          id="warning-input"
          label="Warning State"
          placeholder="Warning input"
          status="warning"
          helperText="This field has a warning"

        />
      </div>

      {/* Input with different variants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          id="default-variant default-variant-input"
          label="Default Variant"
          placeholder="Default"
          variant="default"

        />
        <Input
          id="outlined-variant outlined-variant-input"
          label="Outlined Variant"
          placeholder="Outlined"
          variant="outlined"

        />
        <Input
          id="filled-variant filled-variant-input"
          label="Filled Variant"
          placeholder="Filled"
          variant="filled"

        />
      </div>

      {/* Input with different types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="email-input"
          label="Email Input"
          placeholder="Enter email"
          type="email"
        />
        <Input
          id="number-input"
          label="Number Input"
          placeholder="Enter number"
          type="number"

        />
        <Input
          id="password-input"
          label="Password Input"
          placeholder="Enter password"
          type="password"

        />
        <Input
          id="search-input"
          label="Search Input"
          placeholder="Search..."
          type="search"

        />
      </div>

      {/* Input with icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="left-icon-input"
          label="Left Icon"
          placeholder="Search..."
          leftIcon={<span>🔍</span>}

        />
        <Input
          id="right-icon-input"
          label="Right Icon"
          placeholder="Password"
          type="password"
          rightIcon={<span>👁️</span>}

        />
        <Input
          id="both-icons-input"
          label="Both Icons"
          placeholder="Username"
          leftIcon={<span>👤</span>}
          rightIcon={<span>✓</span>}

        />
      </div>

      {/* Disabled and readonly inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="disabled-input"
          label="Disabled Input"
          placeholder="Disabled"
          disabled

        />
        <Input
          id="readonly-input"
          label="Readonly Input"
          placeholder="Readonly"
          readonly
          value="This is readonly"

        />
      </div>

      {/* Required and validation inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="required-input"
          label="Required Input"
          placeholder="Required field"
          required

        />
        <Input
          id="pattern-input"
          label="Pattern Input"
          placeholder="Enter 3 digits"
          pattern="[0-9]{3}"
          helperText="Must be exactly 3 digits"

        />
      </div>

      {/* Input with length constraints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="min-length-input"
          label="Min Length Input"
          placeholder="Min 5 characters"
          minLength={5}
          helperText="Minimum 5 characters"

        />
        <Input
          id="max-length-input"
          label="Max Length Input"
          placeholder="Max 10 characters"
          maxLength={10}
          helperText="Maximum 10 characters"

        />
      </div>

      {/* AI Configuration Demo */}
      <Input
        id="ai-config-input"
        label="AI Configured Input"
        placeholder="AI managed input"
        helperText="This input has AI configuration (check console in dev mode)"
      />

      {/* Enterprise Features Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="audit-trail-input"
          label="Audit Trail Input"
          placeholder="Changes are tracked"
          helperText="All changes are logged"
        />
        <Input
          id="encrypted-input"
          label="Encrypted Input"
          placeholder="Encrypted data"

          encryptionLevel="field"
          helperText="Field-level encryption enabled"
        />
      </div>

      {/* Commerce State Specific Examples */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Commerce State Specific Behaviors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="initiation-example"
            label="Initiation State Example"
            placeholder="Full editing capabilities"
            helperText="All features available"
          />
          <Input
            id="completion-example"
            label="Completion State Example"
            placeholder="Read-only mode"
            value="Completed transaction"
            helperText="Read-only in completion state"
          />
          <Input
            id="settlement-example"
            label="Settlement State Example"
            placeholder="Restricted editing"
            helperText="Limited editing based on permissions"
          />
          <Input
            id="execution-example"
            label="Execution State Example"
            placeholder="Active processing"
            helperText="Active state with full features"
          />
        </div>
      </div>
    </div>
  );
};

export default InputAllTypes;