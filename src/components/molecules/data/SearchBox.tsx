import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SearchBoxProps } from '../../../types';
import { cn } from '../../../utils/cn';
import Input from '../../atoms/form/Input';
import Button from '../../atoms/form/Button';

const SearchBox: React.FC<SearchBoxProps> = ({
  id = 'search-box',
  name = 'search',
  placeholder = 'Search...',
  value,
  defaultValue = '',
  disabled = false,
  readonly = false,
  searchOnType = true,
  debounceMs = 300,
  showClearButton = true,
  showSearchButton = false,
  size = 'md',
  variant = 'default',
  status = 'default',
  label = '',
  helperText = '',
  errorMessage = '',
  searchIcon,
  clearIcon,
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
  onSearch = () => {},
  onClear = () => {},
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
}) => {
  const [internalValue, setInternalValue] = useState(
    value !== undefined ? value : defaultValue
  );
  const debounceRef = useRef<NodeJS.Timeout>({} as NodeJS.Timeout);

  // Handle commerce state based behavior
  const isReadonly = readonly || commerceState === 'completion';
  const isDisabled = disabled || (commerceState === 'settlement' && !allowedActions.includes('search'));

  // Update internal value when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchValue: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (searchOnType && onSearch) {
          onSearch(searchValue);
        }

        // Audit trail logging
        if (auditTrail.enabled && auditTrail.logUserActions) {
          console.log('Search performed:', {
            action: 'search',
            value: searchValue,
            timestamp: new Date(),
            commerceState,
            workflowContext,
            userRole
          });
        }

        // Call update callback
        if (onUpdate) {
          onUpdate(searchValue);
        }
      }, debounceMs);
    },
    [searchOnType, onSearch, onUpdate, debounceMs, auditTrail, commerceState, workflowContext, userRole]
  );

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInternalValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    if (searchOnType) {
      debouncedSearch(newValue);
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(internalValue);
    }

    // Audit trail logging
    if (auditTrail.enabled && auditTrail.logUserActions) {
      console.log('Search button clicked:', {
        action: 'search_button_click',
        value: internalValue,
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }
  };

  // Handle clear button click
  const handleClearClick = () => {
    setInternalValue('');
    if (onChange) {
      onChange('');
    }
    if (onClear) {
      onClear();
    }
    if (searchOnType && onSearch) {
      onSearch('');
    }

    // Audit trail logging
    if (auditTrail.enabled && auditTrail.logUserActions) {
      console.log('Search cleared:', {
        action: 'search_clear',
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }
  };

  // Handle key press for search
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !searchOnType) {
      handleSearchClick();
    }
  };

  // Default search icon
  const defaultSearchIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  // Default clear icon
  const defaultClearIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  // Build container classes
  const containerClasses = cn(
    'search-box relative',
    className
  );

  // Build input group classes
  const inputGroupClasses = cn(
    'flex items-center gap-2',
    showSearchButton && 'rounded-lg border border-gray-300 p-1 bg-white focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-opacity-50'
  );

  return (
    <div className={containerClasses} style={style}>
      {!showSearchButton ? (
        <Input
          id={`${id}-search-input`}
          name={name}
          placeholder={placeholder}
          value={internalValue}
          disabled={isDisabled}
          readonly={isReadonly}
          size={size}
          variant={variant}
          status={status}
          label={label}
          helperText={helperText}
          errorMessage={errorMessage}
          leftIcon={searchIcon || defaultSearchIcon}
          rightIcon={
            showClearButton && internalValue && !isDisabled && !isReadonly ? (
              <button
                type="button"
                onClick={handleClearClick}
                className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                aria-label="Clear search"
              >
                {clearIcon || defaultClearIcon}
              </button>
            ) : undefined
          }
          commerceState={commerceState}
          workflowContext={workflowContext}
          aiConfig={aiConfig}
          schema={schema}
          allowedActions={allowedActions}
          userRole={userRole}
          data={data}
          onUpdate={onUpdate}
          auditTrail={auditTrail}
          encryptionLevel={encryptionLevel}
          onChange={handleInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyPress}
        />
      ) : (
        <>
          {label && (
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {commerceState && (
                <span className="ml-2 text-xs text-gray-500 uppercase">
                  {commerceState}
                </span>
              )}
            </label>
          )}
          
          <div className={inputGroupClasses}>
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {searchIcon || defaultSearchIcon}
              </div>
              
              <input
                id={`${id}-search-input`}
                name={name}
                type="text"
                placeholder={placeholder}
                value={internalValue}
                disabled={isDisabled}
                readOnly={isReadonly}
                className={cn(
                  'w-full pl-10 pr-4 py-2 border-0 focus:outline-none bg-transparent',
                  size === 'sm' && 'text-sm py-1.5',
                  size === 'lg' && 'text-lg py-3'
                )}
                onChange={handleInputChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={handleKeyPress}
                aria-invalid={status === 'error'}
                aria-describedby={
                  helperText || errorMessage ? `${id}-description` : undefined
                }
              />
              
              {showClearButton && internalValue && !isDisabled && !isReadonly && (
                <button
                  type="button"
                  onClick={handleClearClick}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  aria-label="Clear search"
                >
                  {clearIcon || defaultClearIcon}
                </button>
              )}
            </div>
            
            <Button
              variant="primary"
              size={size}
              disabled={isDisabled}
              onClick={handleSearchClick}
              commerceState={commerceState}
              allowedActions={allowedActions}
              userRole={userRole}
              auditTrail={auditTrail}
              className="flex-shrink-0"
            >
              Search
            </Button>
          </div>
          
          {(helperText || errorMessage) && (
            <p
              id={`${id}-description`}
              className={cn(
                'mt-1 text-sm',
                status === 'error' ? 'text-error-500' : 'text-gray-500',
                status === 'warning' && 'text-warning-500',
                status === 'success' && 'text-success-500'
              )}
            >
              {status === 'error' && errorMessage ? errorMessage : helperText}
            </p>
          )}
        </>
      )}

      {/* AI Config Display (development only) */}
      {process.env.NODE_ENV === 'development' && aiConfig && (
        <div className="absolute -top-6 left-0 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
          AI: {JSON.stringify(aiConfig.layout)}
        </div>
      )}
    </div>
  );
};

SearchBox.displayName = 'SearchBox';

export default SearchBox;