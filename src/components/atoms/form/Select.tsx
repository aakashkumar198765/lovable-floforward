import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { SelectProps, SelectOption, SelectGroup } from '../../../types';
import { cn } from '../../../utils/utils';
import { Label } from '../display';
import Button from './Button';

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id = '',
      name = '',
      placeholder = 'Select an option',
      value = '',
      defaultValue = '',
      disabled = false,
      readonly = false,
      required = false,
      multiple = false,
      searchable = false,
      clearable = false,
      size = 'md',
      variant = 'default',
      status = 'default',
      label = '',
      helperText = '',
      errorMessage = '',
      options = [],
      groups = [],
      noOptionsMessage = 'No options available',
      loadingMessage = 'Loading...',
      isLoading = false,
      className = '',
      style = {},
      onChange = () => {},
      onBlur = () => {},
      onFocus = () => {},
      onSearch = () => {},
      onClear = () => {},
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      value !== undefined ? value : defaultValue !== undefined ? defaultValue : ''
    );
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isReadonly = readonly;
    const isDisabled = disabled;

    // Update internal value when external value changes
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle value changes with audit trail
    const handleChange = (newValue: string | string[], option?: SelectOption | SelectOption[]) => {
      setInternalValue(newValue);
      setIsOpen(false);
      setSearchTerm('');
      
      // Call external onChange
      if (onChange && typeof onChange === 'function') {
        onChange(newValue, option);
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      if (onFocus && typeof onFocus === 'function') {
        onFocus(event);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      if (onBlur && typeof onBlur === 'function') {
        onBlur(event);
      }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      const term = event.target.value;
      setSearchTerm(term);
      if (onSearch && typeof onSearch === 'function') {
        onSearch(term);
      }
    };

    const handleClear = () => {
      setInternalValue('');
      setSearchTerm('');
      if (onClear && typeof onClear === 'function') {
        onClear();
      }
      if (onChange && typeof onChange === 'function') {
        onChange('', undefined);
      }
    };

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
      option.label && option.value && (
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Filter groups based on search term
    const filteredGroups = groups.map(group => ({
      ...group,
      options: (group.options || []).filter(option =>
        option.label && option.value && (
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    })).filter(group => (group.options || []).length > 0);

    // Get selected option
    const selectedOption = options.find(option => option.value === internalValue) ||
      groups.flatMap(group => group.options || []).find(option => option && option.value === internalValue);

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


    // Build select classes
    const selectClasses = cn(
      'w-full rounded-md transition-all duration-200 cursor-pointer',
      'font-work-sans',
      'focus:outline-none focus:ring-2 focus:ring-opacity-50',
      'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
      'readonly:bg-gray-50 readonly:cursor-default',
      sizeClasses[size] || sizeClasses.md,
      variantClasses[variant] || variantClasses.default,
      status && status !== 'default' && statusClasses[status] ? statusClasses[status] : statusClasses.default,
      className || ''
    );

    // Label classes
    const labelClasses = cn(
      'block text-sm font-medium dark:text-white text-gray-700 mb-1',
      required && 'after:content-["*"] after:text-error-500 after:ml-1'
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
      'relative',
      style && typeof style === 'object' && 'custom-style'
    );

    // Render native select for simplicity (can be enhanced with custom dropdown)
    const renderNativeSelect = () => (
      <select
        ref={ref}
        id={id || ''}
        name={name || ''}
        value={internalValue as string}
        disabled={isDisabled}
        required={required}
        className={selectClasses}
        onChange={(e) => {
          const selectedValue = e.target.value;
          const selectedOpt = options.find(opt => opt.value === selectedValue) ||
            groups.flatMap(g => g.options || []).find(opt => opt && opt.value === selectedValue);
          handleChange(selectedValue, selectedOpt);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-invalid={status === 'error'}
        aria-describedby={
          (helperText && helperText !== '') || (errorMessage && errorMessage !== '')
            ? `${id || 'select'}-description`
            : undefined
        }
        {...props}
      >
        {placeholder && placeholder !== '' && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {/* Regular options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
        
        {/* Grouped options */}
        {groups.map((group) => (
          <optgroup key={group.label} label={group.label} disabled={group.disabled}>
            {(group.options || []).map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    );

    return (
      <div className={containerClasses} style={style}>
        {label && label !== '' && (
          // <label htmlFor={id || ''} className={labelClasses}>
          //   {label}
          // </label>
          <Label
            htmlFor={id || ''}
            className={labelClasses}
          >
            {label}
          </Label>
        )}
        
        <div className="relative" ref={dropdownRef}>
          {renderNativeSelect()}
          
          {/* Clear button */}
          {clearable && internalValue && !isDisabled && !isReadonly && (
            <Button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear selection"
            >
              <span className="text-lg">×</span>
            </Button>
          )}
        </div>
        
        {((helperText && helperText !== '') || (errorMessage && errorMessage !== '')) && (
          <p id={`${id || 'select'}-description`} className={helperTextClasses}>
            {status === 'error' && errorMessage && errorMessage !== '' ? errorMessage : helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;