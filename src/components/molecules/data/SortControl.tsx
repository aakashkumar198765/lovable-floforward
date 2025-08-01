import React, { useState, useCallback, useEffect } from 'react';
import { SortControlProps, SortOption, SortCriteria } from '../../../types';
import { cn } from '../../../utils/cn';
import Button from '../../atoms/form/Button';
import Select from '../../atoms/form/Select';

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
  onAdd = () => {},
  onRemove = () => {},
  onClear = () => {},
}) => {
  const [internalSorts, setInternalSorts] = useState<SortCriteria[]>(
    value || defaultValue || []
  );

  // Handle commerce state based behavior
  const isReadonly = commerceState === 'completion';
  const isDisabled = commerceState === 'settlement' && !allowedActions.includes('sort');

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
    
    // Audit trail logging
    if (auditTrail.enabled && auditTrail.trackChanges) {
      console.log('Sort changed:', {
        action: 'sort_change',
        index,
        key,
        direction: direction || newSorts[index]?.direction,
        sorts: newSorts,
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }

    // Call callbacks
    onChange(newSorts);
    if (onUpdate) {
      onUpdate(newSorts);
    }
  }, [internalSorts, options, onChange, onUpdate, auditTrail, commerceState, workflowContext, userRole]);

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
      
      // Audit trail logging
      if (auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Sort added:', {
          action: 'sort_add',
          sort: newSort,
          sorts: newSorts,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      // Call callbacks
      onAdd();
      onChange(newSorts);
      if (onUpdate) {
        onUpdate(newSorts);
      }
    }
  }, [internalSorts, maxSorts, options, onAdd, onChange, onUpdate, auditTrail, commerceState, workflowContext, userRole]);

  // Handle remove sort
  const handleRemoveSort = useCallback((index: number) => {
    const newSorts = internalSorts.filter((_, i) => i !== index);
    setInternalSorts(newSorts);
    
    // Audit trail logging
    if (auditTrail.enabled && auditTrail.logUserActions) {
      console.log('Sort removed:', {
        action: 'sort_remove',
        index,
        removedSort: internalSorts[index],
        sorts: newSorts,
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }

    // Call callbacks
    onRemove(index);
    onChange(newSorts);
    if (onUpdate) {
      onUpdate(newSorts);
    }
  }, [internalSorts, onRemove, onChange, onUpdate, auditTrail, commerceState, workflowContext, userRole]);

  // Handle clear all sorts
  const handleClearAll = useCallback(() => {
    setInternalSorts([]);
    
    // Audit trail logging
    if (auditTrail.enabled && auditTrail.logUserActions) {
      console.log('Sorts cleared:', {
        action: 'sorts_clear',
        clearedSorts: internalSorts,
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }

    // Call callbacks
    onClear();
    onChange([]);
    if (onUpdate) {
      onUpdate([]);
    }
  }, [internalSorts, onClear, onChange, onUpdate, auditTrail, commerceState, workflowContext, userRole]);

  // Toggle sort direction
  const handleToggleDirection = useCallback((index: number) => {
    const newSorts = [...internalSorts];
    newSorts[index] = {
      ...newSorts[index],
      direction: newSorts[index].direction === 'asc' ? 'desc' : 'asc'
    };
    
    setInternalSorts(newSorts);
    onChange(newSorts);
    if (onUpdate) {
      onUpdate(newSorts);
    }
  }, [internalSorts, onChange, onUpdate]);

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
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {direction === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14l5-5 5 5" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 10l-5 5-5-5" />
      )}
    </svg>
  );

  // Remove icon
  const RemoveIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div className={containerClasses} style={style}>
      {/* Label */}
      {label && layout !== 'inline' && (
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {commerceState && (
              <span className="ml-2 text-xs text-gray-500 uppercase">
                {commerceState}
              </span>
            )}
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

      {/* AI Config Display (development only) */}
      {process.env.NODE_ENV === 'development' && aiConfig && (
        <div className="absolute -top-6 left-0 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
          AI: {JSON.stringify(aiConfig.layout)}
        </div>
      )}
    </div>
  );
};

SortControl.displayName = 'SortControl';

export default SortControl;