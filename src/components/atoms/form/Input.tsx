import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '../../../utils/utils';
import { sizeClasses, variantClasses, statusClasses } from '../../../utils/tailwindClassMaps';
import { CleanInputProps } from '../../../types';

// Component uses the CleanInputProps interface from types file

const Input = forwardRef<HTMLInputElement, CleanInputProps>(
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
      min,
      max,
      step,
      size = 'md',
      variant = 'default',
      status = 'default',
      label = '',
      helperText = '',
      errorMessage = '',
      leftIcon = null,
      rightIcon = null,
      className = '',
      style = {},
      onChange = () => {},
      onBlur = () => {},
      onFocus = () => {},
      onKeyDown = () => {},
      onKeyUp = () => {},
      encryptionLevel = 'field', // Default to field-level encryption
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      value !== undefined ? value : defaultValue !== undefined ? defaultValue : ''
    );
    const [isFocused, setIsFocused] = useState(false);

    // Update internal value when external value changes
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    // Handle value changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInternalValue(newValue);
      
      // Clear custom validity to prevent HTML5 validation messages
      if (event.target.setCustomValidity) {
        event.target.setCustomValidity('');
      }
      
      // Call external onChange
      if (onChange && typeof onChange === 'function') {
        onChange(event);
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

    // Build input classes
    const inputClasses = cn(
      'w-full rounded-md transition-colors duration-200',
      'font-work-sans',
      'text-gray-900 dark:text-gray-100',
      'placeholder:text-gray-500 dark:placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-opacity-50',
      'disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400',
      'readonly:bg-gray-50 dark:readonly:bg-gray-800 readonly:cursor-default',
      sizeClasses.input[size] || sizeClasses.input.md,
      variantClasses.input[variant] || variantClasses.input.default,
      status && status !== 'default' && statusClasses.input[status] ? statusClasses.input[status] : statusClasses.input.default,
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className || ''
    );

    // Label classes
    const labelClasses = cn(
      'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200',
      required && 'after:content-["*"] after:text-error-500 dark:after:text-error-400 after:ml-1'
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
            disabled={disabled}
            readOnly={readonly}
            min={min}
            max={max}
            step={step}
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