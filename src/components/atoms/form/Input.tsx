import React, { forwardRef, useState, useEffect } from 'react';
import { InputProps, CommerceState } from '../../../types';
import { cn } from '../../../utils/cn';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id = '',
      name = '',
      type = 'text',
      placeholder = '',
      value,
      defaultValue = '',
      disabled = false,
      readonly = false,
      required = false,
      autoComplete = 'off',
      autoFocus = false,
      maxLength,
      minLength,
      pattern = '',
      size = 'md',
      variant = 'default',
      status = 'default',
      label = '',
      helperText = '',
      errorMessage = '',
      leftIcon = null,
      rightIcon = null,
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
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInternalValue(newValue);
      
      // Clear custom validity to prevent HTML5 validation messages
      if (event.target.setCustomValidity) {
        event.target.setCustomValidity('');
      }
      
      // Audit trail logging
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.trackChanges) {
        // Log change event (in real implementation, this would go to audit service)
        console.log('Input change tracked:', {
          field: (name && name !== '') ? name : (id && id !== '') ? id : 'unnamed-input',
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

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus && typeof onFocus === 'function') {
        onFocus(event);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
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
      default: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
      outlined: 'border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-transparent',
      filled: 'border-0 bg-gray-100 dark:bg-gray-700'
    };

    // Status classes
    const statusClasses = {
      default: 'border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400',
      error: 'border-error-500 dark:border-error-400 focus:border-error-500 dark:focus:border-error-400 focus:ring-error-500 dark:focus:ring-error-400',
      warning: 'border-warning-500 dark:border-warning-400 focus:border-warning-500 dark:focus:border-warning-400 focus:ring-warning-500 dark:focus:ring-warning-400',
      success: 'border-success-500 dark:border-success-400 focus:border-success-500 dark:focus:border-success-400 focus:ring-success-500 dark:focus:ring-success-400'
    };

    // Commerce state styling
    const commerceStateClasses = {
      initiation: 'border-primary-300 dark:border-primary-600',
      agreement: 'border-warning-300 dark:border-warning-600',
      execution: 'border-primary-500 dark:border-primary-400',
      settlement: 'border-gray-400 dark:border-gray-500',
      completion: 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-750',
      none: 'ring-0'
    };

    // Build input classes
    const inputClasses = cn(
      'w-full rounded-md transition-colors duration-200',
      'font-work-sans',
      'text-gray-900 dark:text-gray-100',
      'placeholder:text-gray-500 dark:placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-opacity-50',
      'disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400',
      'readonly:bg-gray-50 dark:readonly:bg-gray-800 readonly:cursor-default',
      sizeClasses[size] || sizeClasses.md,
      variantClasses[variant] || variantClasses.default,
      status && status !== 'default' && statusClasses[status] ? statusClasses[status] : statusClasses.default,
      commerceState && commerceStateClasses[commerceState] ? commerceStateClasses[commerceState] : '',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className || ''
    );

    // Label classes
    const labelClasses = cn(
      'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200',
      required && 'after:content-["*"] after:text-error-500 dark:after:text-error-400 after:ml-1',
      commerceState === 'completion' && 'text-gray-500 dark:text-gray-400'
    );

    // Helper text classes
    const helperTextClasses = cn(
      'mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200',
      status === 'error' && 'text-error-500 dark:text-error-400',
      status === 'warning' && 'text-warning-500 dark:text-warning-400',
      status === 'success' && 'text-success-500 dark:text-success-400'
    );

    // Container classes
    const containerClasses = cn(
      'relative',
      style && typeof style === 'object' && 'custom-style'
    );

    // Icon classes
    const iconClasses = cn(
      'absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-200',
      isFocused && 'text-primary-500 dark:text-primary-400'
    );

    return (
      <div className={containerClasses} style={style}>
        {label && label !== '' && (
          <label htmlFor={id || ''} className={labelClasses}>
            {label}
            {commerceState && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 uppercase transition-colors duration-200">
                {commerceState}
              </span>
            )}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={cn(iconClasses, 'left-3')}>
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={id || ''}
            name={name || ''}
            type={type || 'text'}
            placeholder={placeholder || ''}
            value={internalValue}
            disabled={isDisabled}
            readOnly={isReadonly}
            required={required}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            className={inputClasses}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown && typeof onKeyDown === 'function' ? onKeyDown : undefined}
            onKeyUp={onKeyUp && typeof onKeyUp === 'function' ? onKeyUp : undefined}
            onInvalid={(e) => e.preventDefault()}
            aria-invalid={status === 'error'}
            aria-describedby={
              (helperText && helperText !== '') || (errorMessage && errorMessage !== '')
                ? `${id || 'input'}-description`
                : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <div className={cn(iconClasses, 'right-3')}>
              {rightIcon}
            </div>
          )}
          
        </div>
        
        {((helperText && helperText !== '') || (errorMessage && errorMessage !== '')) && (
          <p id={`${id || 'input'}-description`} className={helperTextClasses}>
            {status === 'error' && errorMessage && errorMessage !== '' ? errorMessage : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;