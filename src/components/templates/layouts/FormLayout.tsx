import React, { useState, useCallback, useEffect } from 'react';
import { FormLayoutProps } from '../../../types';

export const FormLayout: React.FC<FormLayoutProps> = ({
  id,
  title = 'Form',
  description,
  steps = [],
  currentStep = 0,
  showProgress = true,
  showStepNavigation = true,
  autoSave = false,
  autoSaveInterval = 30000,
  validationMode = 'onChange',
  confirmBeforeLeave = true,
  size = 'md',
  layout = 'single-column',
  formActions,
  headerActions,
  showRequiredIndicator = true,
  onStepChange,
  onFormSubmit,
  onFormCancel,
  onFormSave,
  onFieldChange,
  onValidation,
  className = '',
  style = {},
  children,
  commerceState = 'none',
  allowedActions = [],
  userRole,
  encryptionLevel = 'none',
  auditTrail,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(currentStep);
  const [formData, setFormData] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      if (isDirty) {
        setIsAutoSaving(true);
        onFormSave?.(formData);
        setTimeout(() => setIsAutoSaving(false), 1000);
        setIsDirty(false);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, isDirty, formData, onFormSave]);

  // Warn before leaving if form is dirty
  useEffect(() => {
    if (!confirmBeforeLeave) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [confirmBeforeLeave, isDirty]);

  const handleStepChange = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
      onStepChange?.(stepIndex, steps[stepIndex]);
    }
  }, [steps, onStepChange]);

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }));
    setIsDirty(true);
    onFieldChange?.(fieldName, value);

    // Real-time validation
    if (validationMode === 'onChange') {
      // Simulate validation - in real implementation this would validate against schema
      const errors = { ...validationErrors };
      if (!value && fieldName.includes('required')) {
        errors[fieldName] = 'This field is required';
      } else {
        delete errors[fieldName];
      }
      setValidationErrors(errors);
      onValidation?.(fieldName, errors[fieldName]);
    }
  }, [validationMode, validationErrors, onFieldChange, onValidation]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const errors: any = {};
    // Add validation logic here
    
    if (Object.keys(errors).length === 0) {
      onFormSubmit?.(formData);
      setIsDirty(false);
    } else {
      setValidationErrors(errors);
    }
  }, [formData, onFormSubmit]);

  const handleFormCancel = useCallback(() => {
    if (isDirty && confirmBeforeLeave) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onFormCancel?.();
        setIsDirty(false);
      }
    } else {
      onFormCancel?.();
    }
  }, [isDirty, confirmBeforeLeave, onFormCancel]);

  const handleFormSave = useCallback(() => {
    onFormSave?.(formData);
    setIsDirty(false);
  }, [formData, onFormSave]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  const layoutClasses = {
    'single-column': 'grid-cols-1',
    'two-column': 'grid-cols-1 md:grid-cols-2',
    'three-column': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  const renderProgressBar = () => {
    if (!showProgress || steps.length <= 1) return null;

    const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {steps.length > 0 && (
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center cursor-pointer ${
                  index <= currentStepIndex ? 'text-blue-600' : 'text-gray-400'
                }`}
                onClick={() => showStepNavigation && handleStepChange(index)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStepIndex
                      ? 'bg-blue-600 text-white'
                      : index === currentStepIndex
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <span className="text-xs mt-1 text-center max-w-16 truncate">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStepNavigation = () => {
    if (!showStepNavigation || steps.length <= 1) return null;

    const currentStepData = steps[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === steps.length - 1;

    return (
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => handleStepChange(currentStepIndex - 1)}
          disabled={isFirstStep}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            isFirstStep
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          ← Previous
        </button>

        <div className="text-sm text-gray-600">
          {currentStepData?.title || `Step ${currentStepIndex + 1}`}
        </div>

        <button
          type="button"
          onClick={() => handleStepChange(currentStepIndex + 1)}
          disabled={isLastStep}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            isLastStep
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-white bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Next →
        </button>
      </div>
    );
  };

  const renderFormActions = () => {
    const defaultActions = [
      {
        id: 'cancel',
        label: 'Cancel',
        variant: 'secondary' as const,
        action: handleFormCancel,
        icon: undefined
      },
      {
        id: 'save',
        label: 'Save Draft',
        variant: 'secondary' as const,
        action: handleFormSave,
        disabled: !isDirty,
        icon: undefined
      },
      {
        id: 'submit',
        label: 'Submit',
        variant: 'primary' as const,
        action: handleFormSubmit,
        icon: undefined
      }
    ];

    const actions = formActions || defaultActions;

    return (
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        {autoSave && (
          <div className="flex items-center space-x-2 mr-auto">
            {isAutoSaving ? (
              <span className="text-sm text-blue-600">Saving...</span>
            ) : (
              <span className="text-sm text-gray-500">
                {isDirty ? 'Unsaved changes' : 'All changes saved'}
              </span>
            )}
          </div>
        )}
        
        {actions.map((action) => (
          <button
            key={action.id}
            type={action.id === 'submit' ? 'submit' : 'button'}
            onClick={action.action}
            disabled={action.disabled || !allowedActions.includes(action.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:ring-2 focus:ring-offset-2 ${
              action.variant === 'primary'
                ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                : action.variant === 'danger'
                ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500'
            } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  const renderHeader = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>
        {headerActions && (
          <div className="flex space-x-3">
            {headerActions}
          </div>
        )}
      </div>
      
      {showRequiredIndicator && (
        <p className="text-sm text-gray-600">
          Fields marked with <span className="text-red-500">*</span> are required
        </p>
      )}
    </div>
  );

  const renderCurrentStepContent = () => {
    if (steps.length > 0) {
      const currentStepData = steps[currentStepIndex];
      return currentStepData?.content || children;
    }
    return children;
  };

  return (
    <div
      id={id}
      className={`form-layout ${className}`}
      style={style}
      role="main"
      aria-label="Form Layout"
    >
      <div className="py-8">
        <div className={`mx-auto px-6 ${sizeClasses[size]}`}>
          <div className="bg-white shadow rounded-lg p-8">
            {renderHeader()}
            {renderProgressBar()}
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className={`grid gap-6 ${layoutClasses[layout]}`}>
                {renderCurrentStepContent()}
              </div>
              
              {renderStepNavigation()}
              {renderFormActions()}
            </form>
          </div>
        </div>
      </div>

      {/* Audit trail logging */}
      {auditTrail?.enabled && commerceState && (
        <div className="sr-only">
          Form layout rendered - Commerce State: {commerceState}, 
          Current Step: {currentStepIndex + 1} of {steps.length}, 
          Form Dirty: {isDirty},
          User: {userRole?.name || 'Unknown'}
        </div>
      )}
    </div>
  );
};

export default FormLayout;