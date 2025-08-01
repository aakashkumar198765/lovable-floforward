import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { CheckboxProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked = false,
      indeterminate = false,
      value = '',
      name = '',
      disabled = false,
      readonly = false,
      required = false,
      children,
      label = '',
      description = '',
      errorMessage = '',
      commerceState = 'none',
      workflowContext,
      aiConfig,
      schema,
      allowedActions = [],
      userRole,
      data,
      onUpdate,
      auditTrail = { enabled: false, level: 'basic', trackChanges: false, logUserActions: false },
      encryptionLevel = 'none',
      className = '',
      style = {},
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState<boolean>(
      checked !== undefined ? checked : defaultChecked !== undefined ? defaultChecked : false
    );
    const checkboxRef = useRef<HTMLInputElement>(null);

    // Handle commerce state based behavior
    const isReadonly = readonly || commerceState === 'completion';
    const isDisabled = disabled || (commerceState === 'settlement' && allowedActions && Array.isArray(allowedActions) && !allowedActions.includes('edit'));

    // Update internal checked state when external checked changes
    useEffect(() => {
      if (checked !== undefined) {
        setInternalChecked(checked);
      }
    }, [checked]);

    // Handle indeterminate state
    useEffect(() => {
      const checkbox = ref && 'current' in ref ? ref.current : checkboxRef.current;
      if (checkbox) {
        checkbox.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    // Handle checkbox changes with audit trail
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled || isReadonly) return;

      const newChecked = event.target.checked;
      setInternalChecked(newChecked);

      // Audit trail logging
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.trackChanges) {
        console.log('Checkbox change tracked:', {
          field: (name && name !== '') ? name : 'unnamed-checkbox',
          oldValue: internalChecked,
          newValue: newChecked,
          value: value,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      // Call external onChange
      if (onChange && typeof onChange === 'function') {
        onChange(newChecked, event);
      }

      // Call update callback for enterprise integration
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate(newChecked);
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus && typeof onFocus === 'function') {
        onFocus(event);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur && typeof onBlur === 'function') {
        onBlur(event);
      }
    };

    // Commerce state classes
    const commerceStateClasses = {
      initiation: 'border-primary-300',
      agreement: 'border-warning-300',
      execution: 'border-primary-500',
      settlement: 'border-gray-400',
      completion: 'border-gray-300 bg-gray-50',
      none: 'ring-0'
    };

    // Checkbox input classes
    const checkboxClasses = cn(
      'h-4 w-4 rounded border-gray-300 dark:text-white text-primary-600 transition-colors duration-200',
      'focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 focus:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'font-work-sans',
      commerceState && commerceStateClasses[commerceState] ? commerceStateClasses[commerceState] : '',
      (isDisabled || isReadonly) && 'cursor-not-allowed opacity-50'
    );

    // Label classes
    const labelClasses = cn(
      'flex items-center gap-3 cursor-pointer font-work-sans',
      'disabled:cursor-not-allowed disabled:opacity-50',
      (isDisabled || isReadonly) && 'cursor-not-allowed opacity-50',
      className || ''
    );

    // Text classes
    const textClasses = cn(
      'text-sm dark:text-white text-gray-700 select-none',
      required && 'after:content-["*"] after:text-error-500 after:ml-1',
      commerceState === 'completion' && 'dark:text-white text-gray-500'
    );

    // Description classes
    const descriptionClasses = cn(
      'text-xs dark:text-white text-gray-500 mt-1',
      errorMessage && errorMessage !== '' && 'text-error-500'
    );

    // Container classes
    const containerClasses = cn(
      'relative',
      style && typeof style === 'object' && 'custom-style'
    );

    const displayLabel = label && label !== '' ? label : children;
    const { size, status, ...inputProps } = props;

    return (
      <div className={containerClasses} style={style}>
        <label className={labelClasses}>
          <input
            ref={ref || checkboxRef}
            type="checkbox"
            checked={internalChecked}
            value={value}
            name={name}
            disabled={isDisabled}
            readOnly={isReadonly}
            required={required}
            className={checkboxClasses}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={errorMessage && errorMessage !== '' ? true : undefined}
            aria-describedby={
              (description && description !== '') || (errorMessage && errorMessage !== '')
                ? `checkbox-${name || 'unnamed'}-description`
                : undefined
            }
            {...inputProps}
          />
          
          <div className="flex-1 min-w-0">
            {displayLabel && (
              <span className={textClasses}>
                {displayLabel}
                {commerceState && commerceState !== 'initiation' && (
                  <span className="ml-2 text-xs dark:text-white text-gray-500 uppercase">
                    {commerceState}
                  </span>
                )}
              </span>
            )}
            
            {(description && description !== '') && (
              <div 
                id={`checkbox-${name || 'unnamed'}-description`}
                className={descriptionClasses}
              >
                {errorMessage && errorMessage !== '' ? errorMessage : description}
              </div>
            )}
          </div>
          
          {/* Commerce state indicator */}
          {commerceState && commerceState !== 'initiation' && (
            <div className={cn(
              'w-2 h-2 rounded-full flex-shrink-0 mt-1',
              commerceState === 'agreement' && 'bg-warning-500',
              commerceState === 'execution' && 'bg-primary-600',
              commerceState === 'settlement' && 'bg-gray-500',
              commerceState === 'completion' && 'bg-success-500'
            )} />
          )}
        </label>

        {/* AI Config Display (development only) */}
        {process.env.NODE_ENV === 'development' && aiConfig && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs dark:text-white text-blue-600">
            AI Config: {JSON.stringify(aiConfig, null, 2)}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;