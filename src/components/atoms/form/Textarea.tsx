import React, { forwardRef, useState, useEffect } from 'react';
import { TextareaProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id = '',
      name = '',
      placeholder = '',
      value,
      defaultValue = '',
      disabled = false,
      readonly = false,
      required = false,
      autoComplete = 'off',
      autoFocus = false,
      maxLength = undefined,
      minLength = undefined,
      rows = 4,
      cols,
      resize = 'vertical',
      size = 'md',
      variant = 'default',
      status = 'default',
      label = '',
      helperText = '',
      errorMessage = '',
      commerceState = 'none',
      workflowContext,
      aiConfig,
      schema,
      allowedActions = [],
      userRole,
      data,
      onUpdate = () => {},
      auditTrail = { enabled: false, level: 'basic', trackChanges: false, logUserActions: false },
      encryptionLevel = 'none',
      className = '',
      style = {},
      onChange = () => {},
      onBlur = () => {},
      onFocus = () => {},
      onKeyDown = () => {},
      onKeyUp = () => {},
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      value !== undefined ? value : defaultValue !== undefined ? defaultValue : ''
    );
    const [isFocused, setIsFocused] = useState(false);

    // Handle commerce state based behavior
    const isReadonly = readonly || commerceState === 'completion';
    const isDisabled = disabled || (commerceState === 'settlement' && allowedActions && Array.isArray(allowedActions) && !allowedActions.includes('edit'));

    // Update internal value when external value changes
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    // Handle value changes with audit trail
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      setInternalValue(newValue);
      
      // Audit trail logging
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.trackChanges) {
        // Log change event (in real implementation, this would go to audit service)
        console.log('Textarea change tracked:', {
          field: (name && name !== '') ? name : (id && id !== '') ? id : 'unnamed-textarea',
          oldValue: internalValue,
          newValue: newValue,
          timestamp: new Date(),
          commerceState,
          workflowContext
        });
      }
      
      // Call external onChange
      if (onChange && typeof onChange === 'function') {
        onChange(event);
      }
      
      // Call update callback for enterprise integration
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate(newValue);
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      if (onFocus && typeof onFocus === 'function') {
        onFocus(event);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      if (onBlur && typeof onBlur === 'function') {
        onBlur(event);
      }
    };

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg'
    };

    // Variant classes
    const variantClasses = {
      default: 'border border-gray-300 dark:bg-transparent bg-white',
      outlined: 'border-2 border-gray-300 bg-transparent',
      filled: 'border-0 bg-gray-100'
    };

    // Status classes
    const statusClasses = {
      default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
      error: 'border-error-500 focus:border-error-500 focus:ring-error-500',
      warning: 'border-warning-500 focus:border-warning-500 focus:ring-warning-500',
      success: 'border-success-500 focus:border-success-500 focus:ring-success-500'
    };

    // Commerce state styling
    const commerceStateClasses = {
      initiation: 'border-primary-300',
      agreement: 'border-warning-300',
      execution: 'border-primary-500',
      settlement: 'border-gray-400',
      completion: 'border-gray-300 dark:bg-transparent bg-gray-50',
      none: 'ring-0'
    };

    // Resize classes
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };

    // Build textarea classes
    const textareaClasses = cn(
      'w-full rounded-md transition-all duration-200',
      'font-work-sans',
      'focus:outline-none focus:ring-2 focus:ring-opacity-50',
      'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
      'readonly:bg-gray-50 readonly:cursor-default',
      sizeClasses[size] || sizeClasses.md,
      variantClasses[variant] || variantClasses.default,
      status && status !== 'default' && statusClasses[status] ? statusClasses[status] : statusClasses.default,
      commerceState && commerceStateClasses[commerceState] ? commerceStateClasses[commerceState] : '',
      resizeClasses[resize] || resizeClasses.vertical,
      className || ''
    );

    // Label classes
    const labelClasses = cn(
      'block text-sm font-medium dark:text-white text-gray-700 mb-1',
      required && 'after:content-["*"] after:text-error-500 after:ml-1',
      commerceState === 'completion' && 'dark:text-white text-gray-500'
    );

    // Helper text classes
    const helperTextClasses = cn(
      'mt-1 text-sm dark:text-white text-gray-500',
      status === 'error' && 'text-error-500',
      status === 'warning' && 'text-warning-500',
      status === 'success' && 'text-success-500'
    );

    // Container classes
    const containerClasses = cn(
      'relative',
      style && typeof style === 'object' && 'custom-style'
    );

    return (
      <div className={containerClasses} style={style}>
        {label && label !== '' && (
          <label htmlFor={id || ''} className={labelClasses}>
            {label}
            {commerceState && commerceState !== 'none' && (
              <span className="ml-2 text-xs dark:text-white text-gray-500 uppercase">
                {commerceState}
              </span>
            )}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            id={id || ''}
            name={name || ''}
            placeholder={placeholder || ''}
            value={internalValue}
            disabled={isDisabled}
            readOnly={isReadonly}
            required={required}
            autoComplete={autoComplete || 'off'}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            rows={rows}
            cols={cols}
            className={textareaClasses}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown && typeof onKeyDown === 'function' ? onKeyDown : undefined}
            onKeyUp={onKeyUp && typeof onKeyUp === 'function' ? onKeyUp : undefined}
            aria-invalid={status === 'error'}
            aria-describedby={
              (helperText && helperText !== '') || (errorMessage && errorMessage !== '')
                ? `${id || 'textarea'}-description`
                : undefined
            }
            {...props}
          />
        </div>
        
        {((helperText && helperText !== '') || (errorMessage && errorMessage !== '')) && (
          <p id={`${id || 'textarea'}-description`} className={helperTextClasses}>
            {status === 'error' && errorMessage && errorMessage !== '' ? errorMessage : helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;