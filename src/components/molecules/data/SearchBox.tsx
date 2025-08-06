import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SearchBoxProps } from '../../../types';
import { cn } from '../../../utils/utils';
import Input from '../../atoms/form/Input';
import Button from '../../atoms/form/Button';
import Label from '../../atoms/display/Label';
import { Search, X } from 'lucide-react';

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

      }, debounceMs);
    },
    [searchOnType, onSearch, debounceMs]
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
  };

  // Handle key press for search
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !searchOnType) {
      handleSearchClick();
    }
  };

  // Default search icon
  const defaultSearchIcon = <Search className="w-5 h-5" />;

  // Default clear icon
  const defaultClearIcon = <X className="w-4 h-4" />;

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
          disabled={disabled}
          readonly={readonly}
          size={size}
          variant={variant}
          status={status}
          label={label}
          helperText={helperText}
          errorMessage={errorMessage}
          leftIcon={searchIcon || defaultSearchIcon}
          rightIcon={
            showClearButton && internalValue && !disabled && !readonly ? (
              <Button
                variant="ghost"
                size="xs"
                onClick={handleClearClick}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Clear search"
              >
                {clearIcon || defaultClearIcon}
              </Button>
            ) : undefined
          }
          onChange={handleInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyPress}
        />
      ) : (
        <>
          {label && (
            <Label htmlFor={id}>
              {label}
            </Label>
          )}
          
          <div className={inputGroupClasses}>
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {searchIcon || defaultSearchIcon}
              </div>
              
              <Input
                id={`${id}-search-input`}
                name={name}
                type="text"
                placeholder={placeholder}
                value={internalValue}
                disabled={disabled}
                readonly={readonly}
                size={size}
                status={status}
                leftIcon={searchIcon || defaultSearchIcon}
                className="w-full border-0 focus:outline-none bg-transparent"
                onChange={handleInputChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={handleKeyPress}
                aria-invalid={status === 'error'}
                aria-describedby={
                  helperText || errorMessage ? `${id}-description` : undefined
                }
              />
              
              {showClearButton && internalValue && !disabled && !readonly && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleClearClick}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Clear search"
                >
                  {clearIcon || defaultClearIcon}
                </Button>
              )}
            </div>
            
            <Button
              variant="primary"
              size={size}
              disabled={disabled}
              onClick={handleSearchClick}
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
    </div>
  );
};

SearchBox.displayName = 'SearchBox';

export default SearchBox;