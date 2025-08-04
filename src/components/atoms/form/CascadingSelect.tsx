import React, { forwardRef, useState, useEffect } from 'react';
import { CascadingSelectProps, SelectOption, SelectGroup } from '../../../types';
import { cn } from '../../../utils/cn';
import { formInputSizeClasses } from '../../../utils/tailwindClassMaps';

const CascadingSelect = forwardRef<HTMLDivElement, CascadingSelectProps>(
  (
    {
      id = '',
      name = '',
      placeholder = 'Select an option',
      disabled = false,
      readonly = false,
      required = false,
      size = 'md',
      variant = 'default',
      status = 'default',
      label = '',
      helperText = '',
      errorMessage = '',
      levels = [],
      value = [],
      defaultValue = [],
      className = '',
      style = {},
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const [internalValues, setInternalValues] = useState<string[]>(
      value && value.length > 0 ? value : defaultValue && defaultValue.length > 0 ? defaultValue : []
    );
    const [availableOptions, setAvailableOptions] = useState<Array<SelectOption[]>>([]);

    // Handle commerce state based behavior
    const isReadonly = readonly;
    const isDisabled = disabled;

    // Update internal values when external value changes
    useEffect(() => {
      if (value !== undefined && Array.isArray(value)) {
        setInternalValues(value);
      }
    }, [value]);

    // Helper function to get options from data
    const getOptionsFromData = (data: any): SelectOption[] => {
      if (!data) return [];
      
      if (Array.isArray(data)) {
        // Check if it's an array of SelectOption or SelectGroup
        if (data.length === 0) return [];
        
        // If first item has 'options' property, it's grouped
        if (data[0] && typeof data[0] === 'object' && 'options' in data[0]) {
          const groups = data as SelectGroup[];
          return groups.flatMap(group => group.options || []);
        }
        
        // Otherwise it's an array of SelectOption
        return data as SelectOption[];
      }
      
      if (typeof data === 'object') {
        // It's a mapping object, get all values and flatten
        return Object.values(data).flatMap(options => getOptionsFromData(options));
      }
      
      return [];
    };

    // Initialize available options and update cascading options
    useEffect(() => {
      if (levels.length === 0) return;

      const newAvailableOptions: Array<SelectOption[]> = [];
      
      // First level - always available
      const firstLevelData = levels[0]?.data;
      if (firstLevelData) {
        newAvailableOptions[0] = getOptionsFromData(firstLevelData);
      }

      // Subsequent levels - based on previous selections
      for (let i = 1; i < levels.length; i++) {
        const previousValue = internalValues[i - 1];
        const currentLevelData = levels[i]?.data;
        
        if (previousValue && currentLevelData) {
          if (Array.isArray(currentLevelData)) {
            // If current level data is an array, use it directly
            newAvailableOptions[i] = getOptionsFromData(currentLevelData);
          } else if (typeof currentLevelData === 'object') {
            // If it's an object, get options based on previous selection
            const optionsForPreviousValue = currentLevelData[previousValue];
            if (optionsForPreviousValue) {
              newAvailableOptions[i] = getOptionsFromData(optionsForPreviousValue);
            } else {
              newAvailableOptions[i] = [];
            }
          } else {
            newAvailableOptions[i] = [];
          }
        } else {
          newAvailableOptions[i] = [];
        }
      }

      setAvailableOptions(newAvailableOptions);
    }, [levels, internalValues]);

    // Handle value changes with audit trail
    const handleChange = (newValue: string, levelIndex: number) => {
      // Update values - clear all subsequent levels
      const newValues = [...internalValues];
      newValues[levelIndex] = newValue;
      
      // Clear all subsequent levels
      for (let i = levelIndex + 1; i < levels.length; i++) {
        newValues[i] = '';
      }
      
      // Remove empty values from the end
      while (newValues.length > 0 && newValues[newValues.length - 1] === '') {
        newValues.pop();
      }
      
      setInternalValues(newValues);
      
      // Call external onChange
      if (onChange && typeof onChange === 'function') {
        onChange(newValues, levelIndex);
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLSelectElement>, levelIndex: number) => {
      if (onFocus && typeof onFocus === 'function') {
        onFocus(event, levelIndex);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLSelectElement>, levelIndex: number) => {
      if (onBlur && typeof onBlur === 'function') {
        onBlur(event, levelIndex);
      }
    };

    // Variant classes
    const variantClasses = {
      default: 'border border-gray-300 bg-white',
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


    // Build select classes
    const selectClasses = cn(
      'w-full rounded-md transition-all duration-200',
      'font-work-sans',
      'focus:outline-none focus:ring-2 focus:ring-opacity-50',
      'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
      'readonly:bg-gray-50 readonly:cursor-default',
      formInputSizeClasses[size] || formInputSizeClasses.md,
      variantClasses[variant] || variantClasses.default,
      status && status !== 'default' && statusClasses[status] ? statusClasses[status] : statusClasses.default,
    );

    // Label classes
    const labelClasses = cn(
      'block text-sm font-medium text-gray-700 mb-1',
      required && 'after:content-["*"] after:text-error-500 after:ml-1',
    );

    // Helper text classes
    const helperTextClasses = cn(
      'mt-1 text-sm text-gray-500',
      status === 'error' && 'text-error-500',
      status === 'warning' && 'text-warning-500',
      status === 'success' && 'text-success-500'
    );

    // Container classes
    const containerClasses = cn(
      'relative space-y-4',
      style && typeof style === 'object' && 'custom-style',
      className || ''
    );

    // Get option label by value
    const getOptionLabel = (options: SelectOption[], value: string): string => {
      if (!options || !Array.isArray(options) || !value) return value;
      const option = options.find(opt => opt.value === value);
      return option ? option?.label ? option?.label : '' : value;
    };

    return (
      <div className={containerClasses} style={style} ref={ref}>
        {label && label !== '' && (
          <label className={labelClasses}>
            {label}
          </label>
        )}
        
        {/* Render all select levels */}
        {levels.map((level, levelIndex) => {
          const levelValue = internalValues[levelIndex] || '';
          const levelOptions = availableOptions[levelIndex] || [];
          const isLevelDisabled = isDisabled || 
            (levelIndex > 0 && !internalValues[levelIndex - 1]) ||
            levelOptions.length === 0;

          return (
            <div key={levelIndex} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {level.label || `Level ${levelIndex + 1}`}
              </label>
              
              <select
                id={levelIndex === 0 ? (id || '') : `${id || 'cascading'}-${levelIndex}`}
                name={levelIndex === 0 ? (name || '') : `${name || 'cascading'}-${levelIndex}`}
                value={levelValue}
                disabled={isLevelDisabled || isReadonly}
                required={required && levelIndex === 0}
                className={selectClasses}
                onChange={(e) => handleChange(e.target.value, levelIndex)}
                onFocus={(e) => handleFocus(e, levelIndex)}
                onBlur={(e) => handleBlur(e, levelIndex)}
                aria-invalid={status === 'error'}
                aria-describedby={
                  levelIndex === 0 && ((helperText && helperText !== '') || (errorMessage && errorMessage !== ''))
                    ? `${id || 'cascading-select'}-description`
                    : undefined
                }
              >
                <option value="">
                  {level.placeholder || placeholder || 'Select an option'}
                </option>
                
                {levelOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
        
        {/* Selection summary */}
        {internalValues.length > 0 && internalValues.some(val => val !== '') && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
            <strong>Selected Path:</strong>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {internalValues.map((value, index) => {
                if (!value) return null;
                const levelOptions = availableOptions[index] || [];
                const optionLabel = getOptionLabel(levelOptions, value);
                
                return (
                  <React.Fragment key={index}>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {levels[index]?.label || `Level ${index + 1}`}: {optionLabel}
                    </span>
                    {index < internalValues.length - 1 && internalValues[index + 1] && (
                      <span className="text-gray-400">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
        
        {((helperText && helperText !== '') || (errorMessage && errorMessage !== '')) && (
          <p id={`${id || 'cascading-select'}-description`} className={helperTextClasses}>
            {status === 'error' && errorMessage && errorMessage !== '' ? errorMessage : helperText}
          </p>
        )}
      </div>
    );
  }
);

CascadingSelect.displayName = 'CascadingSelect';

export default CascadingSelect;