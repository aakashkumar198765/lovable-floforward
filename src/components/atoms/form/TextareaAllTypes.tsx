import React, { useState } from 'react';
import Textarea from './Textarea';
import Select from './Select';
import { CommerceState } from '../../../types';

interface TextareaAllTypesProps {
  className?: string;
  style?: React.CSSProperties;
  onStateChange?: (state: CommerceState) => void;
  onValueChange?: (value: string) => void;
  initialCommerceState?: CommerceState;
  initialTextareaValue?: string;
}

const TextareaAllTypes: React.FC<TextareaAllTypesProps> = ({
  className = '',
  style = {},
  onStateChange,
  onValueChange,
  initialCommerceState = 'initiation',
  initialTextareaValue = ''
}) => {
  const [textareaValue, setTextareaValue] = useState<string>(initialTextareaValue);
  const [commerceState, setCommerceState] = useState<CommerceState>(initialCommerceState);

  const commerceStates: CommerceState[] = [
    'initiation',
    'agreement', 
    'execution',
    'settlement',
    'completion'
  ];

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setTextareaValue(newValue);
    
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
        <Select
          id="commerce-state-selector"
          label="Commerce State"
          value={commerceState}
          onChange={(value) => {
            const newState = Array.isArray(value) ? value[0] : value;
            if (commerceStates.includes(newState as CommerceState)) {
              handleCommerceStateChange(newState as CommerceState);
            }
          }}
          options={commerceStates.map((state) => ({
            value: state,
            label: state.charAt(0).toUpperCase() + state.slice(1)
          }))}
        />
      </div>

      {/* Basic Textarea */}
      <Textarea
        id="basic-textarea"
        label="Basic Textarea"
        placeholder="Enter your message..."
        value={textareaValue}
        onChange={handleTextareaChange}
        commerceState={commerceState}
        helperText="This is a basic textarea component"
        rows={4}
      />

      {/* Textarea with different sizes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Textarea
          id="small-textarea"
          label="Small Size"
          placeholder="Small textarea"
          size="sm"
          commerceState={commerceState}
          rows={3}
        />
        <Textarea
          id="medium-textarea"
          label="Medium Size"
          placeholder="Medium textarea"
          size="md"
          commerceState={commerceState}
          rows={4}
        />
        <Textarea
          id="large-textarea"
          label="Large Size"
          placeholder="Large textarea"
          size="lg"
          commerceState={commerceState}
          rows={5}
        />
      </div>

      {/* Textarea with different statuses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          id="error-textarea"
          label="Error State"
          placeholder="Error textarea"
          status="error"
          errorMessage="This field has an error"
          commerceState={commerceState}
          rows={3}
        />
        <Textarea
          id="success-textarea"
          label="Success State"
          placeholder="Success textarea"
          status="success"
          helperText="This field is valid"
          commerceState={commerceState}
          rows={3}
        />
        <Textarea
          id="warning-textarea"
          label="Warning State"
          placeholder="Warning textarea"
          status="warning"
          helperText="This field has a warning"
          commerceState={commerceState}
          rows={3}
        />
      </div>

      {/* Textarea with different variants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Textarea
          id="default-variant default-variant-textarea"
          label="Default Variant"
          placeholder="Default variant"
          variant="default"
          commerceState={commerceState}
          rows={3}
        />
        <Textarea
          id="outlined-variant outlined-variant-textarea"
          label="Outlined Variant"
          placeholder="Outlined variant"
          variant="outlined"
          commerceState={commerceState}
          rows={3}
        />
        <Textarea
          id="filled-variant filled-variant-textarea"
          label="Filled Variant"
          placeholder="Filled variant"
          variant="filled"
          commerceState={commerceState}
          rows={3}
        />
      </div>

      {/* Textarea with different resize options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          id="resize-none"
          label="No Resize"
          placeholder="Cannot be resized"
          resize="none"
          commerceState={commerceState}
          rows={3}
          helperText="Resize is disabled"
        />
        <Textarea
          id="resize-vertical"
          label="Vertical Resize"
          placeholder="Can be resized vertically"
          resize="vertical"
          commerceState={commerceState}
          rows={3}
          helperText="Can resize vertically only"
        />
        <Textarea
          id="resize-horizontal"
          label="Horizontal Resize"
          placeholder="Can be resized horizontally"
          resize="horizontal"
          commerceState={commerceState}
          rows={3}
          helperText="Can resize horizontally only"
        />
        <Textarea
          id="resize-both"
          label="Both Resize"
          placeholder="Can be resized in both directions"
          resize="both"
          commerceState={commerceState}
          rows={3}
          helperText="Can resize in both directions"
        />
      </div>

      {/* Textarea with different row counts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Textarea
          id="small-rows"
          label="2 Rows"
          placeholder="Small textarea"
          rows={2}
          commerceState={commerceState}
          helperText="2 rows height"
        />
        <Textarea
          id="medium-rows"
          label="6 Rows"
          placeholder="Medium textarea"
          rows={6}
          commerceState={commerceState}
          helperText="6 rows height"
        />
        <Textarea
          id="large-rows"
          label="8 Rows"
          placeholder="Large textarea"
          rows={8}
          commerceState={commerceState}
          helperText="8 rows height"
        />
      </div>

      {/* Disabled and readonly textareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          id="disabled-textarea"
          label="Disabled Textarea"
          placeholder="Disabled"
          disabled
          commerceState={commerceState}
          rows={3}
        />
        <Textarea
          id="readonly-textarea"
          label="Readonly Textarea"
          placeholder="Readonly"
          readonly
          value="This is readonly content that cannot be edited."
          commerceState={commerceState}
          rows={3}
        />
      </div>

      {/* Required and validation textareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          id="required-textarea"
          label="Required Textarea"
          placeholder="Required field"
          required
          commerceState={commerceState}
          rows={3}
        />
        <Textarea
          id="max-length-textarea"
          label="Max Length Textarea"
          placeholder="Max 100 characters"
          maxLength={100}
          helperText="Maximum 100 characters"
          commerceState={commerceState}
          rows={3}
        />
      </div>

      {/* AI Configuration Demo */}
      <Textarea
        id="ai-config-textarea"
        label="AI Configured Textarea"
        placeholder="AI managed textarea"
        commerceState={commerceState}
        rows={4}
        aiConfig={{
          layout: 'expanded',
          features: ['spellcheck', 'grammar', 'suggestions'],
          customization: { theme: 'enterprise' },
          hints: ['Use for detailed descriptions', 'Auto-suggestions enabled']
        }}
        helperText="This textarea has AI configuration (check console in dev mode)"
      />

      {/* Enterprise Features Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          id="audit-trail-textarea"
          label="Audit Trail Textarea"
          placeholder="Changes are tracked"
          commerceState={commerceState}
          rows={4}
          auditTrail={{
            enabled: true,
            level: 'detailed',
            trackChanges: true,
            logUserActions: true
          }}
          helperText="All changes are logged"
        />
        <Textarea
          id="encrypted-textarea"
          label="Encrypted Textarea"
          placeholder="Encrypted data"
          commerceState={commerceState}
          rows={4}
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
          <Textarea
            id="initiation-example"
            label="Initiation State Example"
            placeholder="Full editing capabilities"
            commerceState="initiation"
            rows={3}
            helperText="All features available"
          />
          <Textarea
            id="completion-example"
            label="Completion State Example"
            placeholder="Read-only mode"
            commerceState="completion"
            value="This is a completed transaction that cannot be modified."
            rows={3}
            helperText="Read-only in completion state"
          />
          <Textarea
            id="settlement-example"
            label="Settlement State Example"
            placeholder="Restricted editing"
            commerceState="settlement"
            allowedActions={[]} // No edit permissions
            rows={3}
            helperText="Limited editing based on permissions"
          />
          <Textarea
            id="execution-example"
            label="Execution State Example"
            placeholder="Active processing"
            commerceState="execution"
            rows={3}
            helperText="Active state with full features"
          />
        </div>
      </div>

      {/* Use Cases Demo */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Common Use Cases
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            id="description-field"
            label="Product Description"
            placeholder="Enter product description..."
            commerceState={commerceState}
            rows={4}
            helperText="Detailed product description"
          />
          <Textarea
            id="feedback-field"
            label="Customer Feedback"
            placeholder="Share your feedback..."
            commerceState={commerceState}
            rows={4}
            helperText="Customer feedback form"
          />
          <Textarea
            id="notes-field"
            label="Internal Notes"
            placeholder="Add internal notes..."
            commerceState={commerceState}
            rows={6}
            helperText="Internal team notes"
          />
          <Textarea
            id="comment-field"
            label="Comment"
            placeholder="Leave a comment..."
            commerceState={commerceState}
            rows={3}
            maxLength={500}
            helperText="Maximum 500 characters"
          />
        </div>
      </div>
    </div>
  );
};

export default TextareaAllTypes;