import React, { forwardRef, useState, useEffect } from 'react';
import { SwitchProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      disabled = false,
      readonly = false,
      size = 'md',
      color = 'primary',
      label = '',
      description = '',
      labelPosition = 'right',
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

    // Handle commerce state based behavior
    const isReadonly = readonly || commerceState === 'completion';
    const isDisabled = disabled || (commerceState === 'settlement' && allowedActions && Array.isArray(allowedActions) && !allowedActions.includes('edit'));

    // Update internal checked state when external checked changes
    useEffect(() => {
      if (checked !== undefined) {
        setInternalChecked(checked);
      }
    }, [checked]);

    // Handle switch changes with audit trail
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled || isReadonly) return;

      const newChecked = event.target.checked;
      setInternalChecked(newChecked);

      // Audit trail logging
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.trackChanges) {
        console.log('Switch change tracked:', {
          field: 'switch-toggle',
          oldValue: internalChecked,
          newValue: newChecked,
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

    // Size classes
    const sizeClasses = {
      sm: {
        track: 'h-4 w-7',
        thumb: 'h-3 w-3',
        translate: 'translate-x-3'
      },
      md: {
        track: 'h-5 w-9',
        thumb: 'h-4 w-4',
        translate: 'translate-x-4'
      },
      lg: {
        track: 'h-6 w-11',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5'
      }
    };

    // Color classes
    const colorClasses = {
      primary: 'bg-primary-600 focus:ring-primary-500',
      secondary: 'bg-gray-600 focus:ring-gray-500',
      success: 'bg-success-600 focus:ring-success-500',
      warning: 'bg-warning-600 focus:ring-warning-500',
      danger: 'bg-error-600 focus:ring-error-500'
    };

    // Commerce state classes
    const commerceStateClasses = {
      initiation: 'ring-primary-300',
      agreement: 'ring-warning-300',
      execution: 'ring-primary-500',
      settlement: 'ring-gray-400',
      completion: 'ring-gray-300 bg-gray-50',
      none: 'ring-0'
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;

    // Track classes
    const trackClasses = cn(
      'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2',
      'font-work-sans',
      currentSize.track,
      internalChecked ? (colorClasses[color] || colorClasses.primary) : 'bg-gray-200',
      commerceState && commerceStateClasses[commerceState] ? commerceStateClasses[commerceState] : '',
      (isDisabled || isReadonly) && 'cursor-not-allowed opacity-50',
      !internalChecked && 'focus:ring-gray-500'
    );

    // Thumb classes
    const thumbClasses = cn(
      'pointer-events-none inline-block rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out transform',
      currentSize.thumb,
      internalChecked ? currentSize.translate : 'translate-x-0'
    );

    // Label classes
    const labelClasses = cn(
      'text-sm font-medium text-gray-700 cursor-pointer select-none',
      (isDisabled || isReadonly) && 'cursor-not-allowed opacity-50',
      commerceState === 'completion' && 'text-gray-500'
    );

    // Description classes
    const descriptionClasses = cn(
      'text-xs text-gray-500 mt-1'
    );

    // Container classes
    const containerClasses = cn(
      'flex items-start gap-3',
      labelPosition === 'left' && 'flex-row-reverse',
      style && typeof style === 'object' && 'custom-style',
      className || ''
    );

    // Switch wrapper classes
    const switchWrapperClasses = cn(
      'flex flex-col',
      labelPosition === 'left' ? 'items-end' : 'items-start'
    );

    return (
      <div className={containerClasses} style={style}>
        <div className={switchWrapperClasses}>
          <button
            type="button"
            role="switch"
            aria-checked={internalChecked}
            disabled={isDisabled}
            className={trackClasses}
            onClick={() => {
              if (!isDisabled && !isReadonly) {
                const event = {
                  target: { checked: !internalChecked },
                  currentTarget: { checked: !internalChecked }
                } as React.ChangeEvent<HTMLInputElement>;
                handleChange(event);
              }
            }}
          >
            <span className={thumbClasses} />
            
            {/* Hidden input for form submission */}
            {/* <input
              ref={ref}
              type="checkbox"
              checked={internalChecked}
              disabled={isDisabled}
              readOnly={isReadonly}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="sr-only"
              aria-hidden="true"
              {...props}
            /> */}
          </button>
          
          {/* Commerce state indicator */}
          {commerceState && commerceState !== 'initiation' && commerceState !== 'none' && (
            <div className={cn(
              'w-1.5 h-1.5 rounded-full mt-1',
              commerceState === 'agreement' && 'bg-warning-500',
              commerceState === 'execution' && 'bg-primary-600',
              commerceState === 'settlement' && 'bg-gray-500',
              commerceState === 'completion' && 'bg-success-500'
            )} />
          )}
        </div>
        
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && label !== '' && (
              <label className={labelClasses}>
                {label}
                {commerceState && commerceState !== 'initiation' && (
                  <span className="ml-2 text-xs text-gray-500 uppercase">
                    {commerceState}
                  </span>
                )}
              </label>
            )}
            
            {description && description !== '' && (
              <div className={descriptionClasses}>
                {description}
              </div>
            )}
          </div>
        )}

        {/* AI Config Display (development only) */}
        {process.env.NODE_ENV === 'development' && aiConfig && (
          <div className="absolute -top-8 left-0 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
            AI Config: {JSON.stringify(aiConfig, null, 2)}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;