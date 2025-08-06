import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { CleanCheckboxProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Checkbox = forwardRef<HTMLInputElement, CleanCheckboxProps>(
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
      size = 'md',
      variant = 'default',
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

    // Handle checkbox changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || readonly) return;

      const newChecked = event.target.checked;
      setInternalChecked(newChecked);

      // Call external onChange
      if (onChange && typeof onChange === 'function') {
        onChange(newChecked, event);
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
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };

    // Variant classes
    const variantClasses = {
      default: 'border-gray-300 text-primary-600',
      outlined: 'border-2 border-gray-400 text-primary-600',
      filled: 'border-primary-600 bg-primary-50 text-primary-600'
    };

    // Checkbox input classes
    const checkboxClasses = cn(
      'rounded transition-colors duration-200',
      'focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 focus:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'font-work-sans dark:text-white',
      sizeClasses[size],
      variantClasses[variant],
      (disabled || readonly) && 'cursor-not-allowed opacity-50'
    );

    // Label classes
    const labelClasses = cn(
      'flex items-center gap-3 cursor-pointer font-work-sans',
      'disabled:cursor-not-allowed disabled:opacity-50',
      (disabled || readonly) && 'cursor-not-allowed opacity-50',
      className || ''
    );

    // Text classes
    const textClasses = cn(
      'text-sm dark:text-white text-gray-700 select-none',
      required && 'after:content-["*"] after:text-error-500 after:ml-1'
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
    const inputProps = props;

    return (
      <div className={containerClasses} style={style}>
        <label className={labelClasses}>
          <input
            ref={ref || checkboxRef}
            type="checkbox"
            checked={internalChecked}
            value={value}
            name={name}
            disabled={disabled}
            readOnly={readonly}
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
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;