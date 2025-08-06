import React, { useState, useCallback, useEffect } from 'react';
import { SortControlProps, SortOption, SortCriteria } from '../../../types';
import { cn } from '../../../utils/utils';
import Button from '../../atoms/form/Button';
import Select from '../../atoms/form/Select';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

const SortControl: React.FC<SortControlProps> = ({
  id = 'sort-control',
  label = 'Sort by',
  options = [],
  value,
  defaultValue = [],
  multiple = true,
  maxSorts = 3,
  showDirection = true,
  showAddButton = true,
  showRemoveButton = true,
  showClearButton = true,
  addButtonText = 'Add Sort',
  clearButtonText = 'Clear All',
  noSortText = 'No sorting applied',
  size = 'md',
  variant = 'default',
  layout = 'vertical',
  isDisabled = false,
  isReadonly = false,
  className = '',
  style = {},
  onChange = () => {},
  onAdd = () => {},
  onRemove = () => {},
  onClear = () => {},
}) => {
  const [internalSorts, setInternalSorts] = useState<SortCriteria[]>(
    value || defaultValue || []
  );


  // Update internal sorts when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalSorts(value);
    }
  }, [value]);

  // Handle sort change
  const handleSortChange = useCallback((index: number, key: string, direction?: 'asc' | 'desc') => {
    const newSorts = [...internalSorts];
    const option = options.find(opt => opt.key === key);
    
    if (index < newSorts.length) {
      // Update existing sort
      newSorts[index] = {
        key,
        direction: direction || newSorts[index].direction || option?.defaultDirection || 'asc'
      };
    } else {
      // Add new sort
      newSorts.push({
        key,
        direction: direction || option?.defaultDirection || 'asc'
      });
    }

    setInternalSorts(newSorts);


    // Call callbacks
    onChange(newSorts);
  }, [internalSorts, options, onChange]);

  // Handle add sort
  const handleAddSort = useCallback(() => {
    if (internalSorts.length >= maxSorts) return;

    // Find first available option
    const usedKeys = internalSorts.map(sort => sort.key);
    const availableOption = options.find(option => !usedKeys.includes(option.key) && !option.disabled);
    
    if (availableOption) {
      const newSort: SortCriteria = {
        key: availableOption.key,
        direction: availableOption.defaultDirection || 'asc'
      };
      
      const newSorts = [...internalSorts, newSort];
      setInternalSorts(newSorts);

      // Call callbacks
      onAdd();
      onChange(newSorts);
    }
  }, [internalSorts, maxSorts, options, onAdd, onChange]);

  // Handle remove sort
  const handleRemoveSort = useCallback((index: number) => {
    const newSorts = internalSorts.filter((_, i) => i !== index);
    setInternalSorts(newSorts);

    // Call callbacks
    onRemove(index);
    onChange(newSorts);
  }, [internalSorts, onRemove, onChange]);

  // Handle clear all sorts
  const handleClearAll = useCallback(() => {
    setInternalSorts([]);

    // Call callbacks
    onClear();
    onChange([]);
  }, [internalSorts, onClear, onchange]);

  // Toggle sort direction
  const handleToggleDirection = useCallback((index: number) => {
    const newSorts = [...internalSorts];
    newSorts[index] = {
      ...newSorts[index],
      direction: newSorts[index].direction === 'asc' ? 'desc' : 'asc'
    };
    
    setInternalSorts(newSorts);
    onChange(newSorts);
  }, [internalSorts, onChange]);

  // Get available options for select
  const getAvailableOptions = (currentIndex: number) => {
    const usedKeys = internalSorts
      .map(sort => sort.key)
      .filter((_, index) => index !== currentIndex);
    
    return options
      .filter(option => !usedKeys.includes(option.key) && !option.disabled)
      .map(option => ({
        value: option.key,
        label: option.label
      }));
  };

  // Check if can add more sorts
  const canAddMore = multiple && internalSorts.length < maxSorts && 
    getAvailableOptions(-1).length > 0 && !isDisabled && !isReadonly;

  // Build container classes
  const containerClasses = cn(
    'sort-control',
    layout === 'horizontal' && 'flex flex-wrap items-center gap-2',
    layout === 'inline' && 'inline-flex items-center gap-2',
    layout === 'vertical' && 'space-y-2',
    variant === 'outlined' && 'border border-gray-200 rounded-lg p-3',
    variant === 'compact' && 'text-sm',
    className
  );

  // Build sort item classes
  const sortItemClasses = cn(
    'sort-item flex items-center gap-2',
    layout === 'vertical' && 'w-full',
    size === 'sm' && 'text-sm',
    size === 'lg' && 'text-lg'
  );

  // Direction icons
  const DirectionIcon = ({ direction }: { direction: 'asc' | 'desc' }) => (
    direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  );

  // Remove icon
  const RemoveIcon = () => (
    <X className="w-4 h-4" />
  );

  return (
    <div className={containerClasses} style={style}>
      {/* Label */}
      {label && layout !== 'inline' && (
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          
          {showClearButton && internalSorts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={isDisabled}
              className="text-xs"
            >
              {clearButtonText}
            </Button>
          )}
        </div>
      )}

      {/* Inline label */}
      {label && layout === 'inline' && (
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {label}:
        </span>
      )}

      {/* Sort items */}
      {internalSorts.length === 0 ? (
        <div className="text-sm text-gray-500 py-2">
          {noSortText}
        </div>
      ) : (
        <div className={cn(
          layout === 'vertical' && 'space-y-2',
          layout === 'horizontal' && 'flex flex-wrap gap-2',
          layout === 'inline' && 'flex flex-wrap gap-2'
        )}>
          {internalSorts.map((sort, index) => {
            const option = options.find(opt => opt.key === sort.key);
            const availableOptions = getAvailableOptions(index);
            
            return (
              <div key={index} className={sortItemClasses}>
                {/* Sort field selector */}
                <Select
                  id={`${id}-sort-${index}`}
                  value={sort.key}
                  size={size}
                  disabled={isDisabled}
                  readonly={isReadonly}
                  options={[
                    { value: sort.key, label: option?.label || sort.key },
                    ...availableOptions
                  ]}
                  onChange={(newKey) => handleSortChange(index, newKey as string)}
                  className="min-w-[120px]"
                />

                {/* Direction toggle */}
                {showDirection && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleDirection(index)}
                    disabled={isDisabled}
                    className="px-2"
                  >
                    <DirectionIcon direction={sort.direction || 'asc'} />
                  </Button>
                )}

                {/* Remove button */}
                {showRemoveButton && multiple && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSort(index)}
                    disabled={isDisabled}
                    className="px-2 text-gray-400 hover:text-red-500"
                  >
                    <RemoveIcon />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add sort button */}
      {showAddButton && canAddMore && (
        <Button
          variant="tertiary"
          size={size}
          onClick={handleAddSort}
          disabled={isDisabled}
          className={cn(
            layout === 'vertical' && 'mt-2',
            layout !== 'vertical' && 'ml-2'
          )}
        >
          {addButtonText}
        </Button>
      )}

      {/* Clear all button for non-vertical layouts */}
      {showClearButton && internalSorts.length > 0 && layout !== 'vertical' && (
        <Button
          variant="ghost"
          size={size}
          onClick={handleClearAll}
          disabled={isDisabled}
          className="ml-2 text-gray-500"
        >
          {clearButtonText}
        </Button>
      )}
    </div>
  );
};

SortControl.displayName = 'SortControl';

export default SortControl;