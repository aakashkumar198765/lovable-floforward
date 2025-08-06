import React, { forwardRef, useState, useEffect } from 'react';
import { RadioProps, RadioOption } from '../../../types';
import { cn } from '../../../utils/utils';

// Reusable RadioInput component
interface RadioInputProps {
  id?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
  ({ id, name, value, checked, disabled, readonly, required, className, onChange, onFocus, onBlur, ...props }, ref) => {
    return (
      <input
        ref={ref}
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        readOnly={readonly}
        required={required}
        className={className}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
    );
  }
);

RadioInput.displayName = 'RadioInput';

const Radio = forwardRef<HTMLDivElement, RadioProps>(
  (
    {
      options = [],
      value,
      defaultValue = '',
      name = '',
      disabled = false,
      readonly = false,
      required = false,
      orientation = 'vertical',
      label = '',
      description = '',
      errorMessage = '',
      className = '',
      style = {},
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>(
      value !== undefined ? value : defaultValue !== undefined ? defaultValue : ''
    );


    // Update internal value when external value changes
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    // Validate required options array
    const validOptions = Array.isArray(options) ? options : [];

    // Handle radio changes with audit trail
    const handleChange = (newValue: string, event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || readonly) return;

      const selectedOption = validOptions.find(opt => opt.value === newValue);
      setInternalValue(newValue);

      // Call external onChange
      if (onChange && typeof onChange === 'function') {
        onChange(newValue, event);
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


    // Radio input classes
    const radioClasses = cn(
      'h-4 w-4 border-gray-300 dark:text-white text-primary-600 transition-colors duration-200',
      'focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 focus:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'font-work-sans',
    );

    // Container classes
    const containerClasses = cn(
      'space-y-2',
      style && typeof style === 'object' && 'custom-style',
      className || ''
    );

    // Group classes
    const groupClasses = cn(
      'space-y-2',
      orientation === 'horizontal' && 'flex flex-wrap gap-4 space-y-0'
    );

    // Label classes for group
    const groupLabelClasses = cn(
      'block text-sm font-medium dark:text-white text-gray-700 mb-2',
      required && 'after:content-["*"] after:text-error-500 after:ml-1'
    );

    // Option label classes
    const optionLabelClasses = cn(
      'flex items-start gap-3 cursor-pointer font-work-sans text-sm',
      'disabled:cursor-not-allowed disabled:opacity-50',
      (disabled || readonly) && 'cursor-not-allowed opacity-50'
    );

    // Description classes
    const descriptionClasses = cn(
      'text-xs dark:text-white text-gray-500 mt-1',
      errorMessage && errorMessage !== '' && 'text-error-500'
    );

    // Render radio option
    const renderOption = (option: RadioOption, index: number) => {
      const isOptionDisabled = option.disabled || disabled || readonly;
      const isSelected = internalValue === option.value;
      const optionId = `${name || 'radio'}-${option.value}-${index}`;

      return (
        <label key={option.value} className={optionLabelClasses}>
          <RadioInput
            id={optionId}
            name={name}
            value={option.value}
            checked={isSelected}
            disabled={isOptionDisabled}
            readonly={readonly}
            required={required && index === 0} // Only first option needs required attribute
            className={radioClasses}
            onChange={(e) => option.value && handleChange(option.value, e)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={errorMessage && errorMessage !== '' ? true : undefined}
            aria-describedby={
              (description && description !== '') || (errorMessage && errorMessage !== '')
                ? `radio-${name || 'unnamed'}-description`
                : undefined
            }
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
              <span className={cn(
                'dark:text-white text-gray-700 select-none',
                isSelected && 'font-medium dark:text-white text-gray-900',
                isOptionDisabled && 'text-gray-400'
              )}>
                {option.label}
              </span>
            </div>
            
            {option.description && (
              <div className="text-xs dark:text-white text-gray-500 mt-1 select-none">
                {option.description}
              </div>
            )}
          </div>
        </label>
      );
    };

    return (
      <div className={containerClasses} style={style} ref={ref} {...props}>
        {label && label !== '' && (
          <legend className={groupLabelClasses}>
            {label}
          </legend>
        )}
        
        <fieldset className={groupClasses}>
          {validOptions.length > 0 ? (
            validOptions.map((option, index) => renderOption(option, index))
          ) : (
            <div className="text-sm text-gray-500 italic">
              No options available
            </div>
          )}
        </fieldset>
        
        {((description && description !== '') || (errorMessage && errorMessage !== '')) && (
          <div
            id={`radio-${name || 'unnamed'}-description`}
            className={descriptionClasses}
          >
            {errorMessage && errorMessage !== '' ? errorMessage : description}
          </div>
        )}

        {/* Selected value display */}
        {internalValue && (
          <div className="mt-2 text-xs dark:text-white text-gray-500">
            Selected: {validOptions.find(opt => opt.value === internalValue)?.label || internalValue}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;