import React, { useState, useCallback, useEffect } from 'react';
import { FilterPanelProps, FilterOption, FilterValue } from '../../../types';
import { cn } from '../../../utils/cn';
import Button from '../../atoms/form/Button';
import Select from '../../atoms/form/Select';
import Input from '../../atoms/form/Input';
import Checkbox from '../../atoms/form/Checkbox';
import DatePicker from '../../atoms/form/DatePicker';

const FilterPanel: React.FC<FilterPanelProps> = ({
  id = 'filter-panel',
  title = 'Filters',
  description = '',
  filters = [],
  values,
  defaultValues = {},
  layout = 'vertical',
  columns = 2,
  collapsible = true,
  collapsed: initialCollapsed = false,
  showApplyButton = true,
  showClearButton = true,
  showResetButton = false,
  applyButtonText = 'Apply Filters',
  clearButtonText = 'Clear All',
  resetButtonText = 'Reset',
  autoApply = false,
  debounceMs = 300,
  size = 'md',
  variant = 'default',
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
  onApply = () => {},
  onClear = () => {},
  onReset = () => {},
  onChange = () => {},
  onFilterChange = () => {},
  onToggleCollapse = () => {},
}) => {
  const [internalValues, setInternalValues] = useState<FilterValue>(
    values || defaultValues || {}
  );
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [hasChanges, setHasChanges] = useState(false);

  // Handle commerce state based behavior
  const isReadonly = commerceState === 'completion';
  const isDisabled = commerceState === 'settlement' && !allowedActions.includes('filter');

  // Update internal values when external values change
  useEffect(() => {
    if (values !== undefined) {
      setInternalValues(values);
    }
  }, [values]);

  // Auto-apply filters when values change
  useEffect(() => {
    if (autoApply && hasChanges) {
      const timer = setTimeout(() => {
        handleApply();
        setHasChanges(false);
      }, debounceMs);

      return () => clearTimeout(timer);
    }
  }, [internalValues, autoApply, hasChanges, debounceMs]);

  // Handle filter value change
  const handleFilterChange = useCallback((key: string, value: any) => {
    const newValues = { ...internalValues, [key]: value };
    setInternalValues(newValues);
    setHasChanges(true);

    // Audit trail logging
    if (auditTrail.enabled && auditTrail.trackChanges) {
      console.log('Filter changed:', {
        action: 'filter_change',
        filterKey: key,
        oldValue: internalValues[key],
        newValue: value,
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }

    // Call callbacks
    onFilterChange(key, value);
    onChange(newValues);
    
    if (onUpdate) {
      onUpdate(newValues);
    }
  }, [internalValues, onFilterChange, onChange, onUpdate, auditTrail, commerceState, workflowContext, userRole]);

  // Handle apply filters
  const handleApply = useCallback(() => {
    onApply(internalValues);
    setHasChanges(false);

    // Audit trail logging
    if (auditTrail.enabled && auditTrail.logUserActions) {
      console.log('Filters applied:', {
        action: 'filters_apply',
        filters: internalValues,
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }
  }, [internalValues, onApply, auditTrail, commerceState, workflowContext, userRole]);

  // Handle clear filters
  const handleClear = useCallback(() => {
    const clearedValues: FilterValue = {};
    filters.forEach(filter => {
      if (filter.type === 'checkbox') {
        filter.key && (clearedValues[filter.key] = false);
      } else {
        filter.key && (clearedValues[filter.key] = '');
      }
    });

    setInternalValues(clearedValues);
    setHasChanges(false);
    onClear();
    onChange(clearedValues);

    // Audit trail logging
    if (auditTrail.enabled && auditTrail.logUserActions) {
      console.log('Filters cleared:', {
        action: 'filters_clear',
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }
  }, [filters, onClear, onChange, auditTrail, commerceState, workflowContext, userRole]);

  // Handle reset filters
  const handleReset = useCallback(() => {
    setInternalValues(defaultValues);
    setHasChanges(false);
    onReset();
    onChange(defaultValues);

    // Audit trail logging
    if (auditTrail.enabled && auditTrail.logUserActions) {
      console.log('Filters reset:', {
        action: 'filters_reset',
        defaultValues,
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }
  }, [defaultValues, onReset, onChange, auditTrail, commerceState, workflowContext, userRole]);

  // Handle toggle collapse
  const handleToggleCollapse = useCallback(() => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onToggleCollapse(newCollapsed);
  }, [collapsed, onToggleCollapse]);

  // Render filter input based on type
  const renderFilterInput = (filter: FilterOption) => {
    const value = (filter.key ? internalValues[filter.key] : undefined) || filter.defaultValue || '';
    const inputProps = {
      id: `${id}-${filter.key}`,
      name: filter.key,
      disabled: isDisabled || filter.disabled,
      readonly: isReadonly,
      size,
      commerceState,
      allowedActions,
      userRole,
      auditTrail,
    };

    switch (filter.type) {
      case 'text':
        return (
          <Input
            {...inputProps}
            type="text"
            placeholder={filter.placeholder}
            value={value}
            required={filter.validation?.required}
            pattern={filter.validation?.pattern}
            onChange={(e) => filter.key && handleFilterChange(filter.key, e.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            {...inputProps}
            type="number"
            placeholder={filter.placeholder}
            value={value}
            required={filter.validation?.required}
            min={filter.validation?.min}
            max={filter.validation?.max}
            onChange={(e) => filter.key && handleFilterChange(filter.key, e.target.value)}
          />
        );

      case 'select':
        return (
          <Select
            {...inputProps}
            placeholder={filter.placeholder}
            value={value}
            required={filter.validation?.required}
            options={filter.options || []}
            onChange={(newValue) => filter.key && handleFilterChange(filter.key, newValue)}
          />
        );

      case 'multiselect':
        return (
          <Select
            {...inputProps}
            placeholder={filter.placeholder}
            value={value}
            multiple
            required={filter.validation?.required}
            options={filter.options || []}
            onChange={(newValue) => filter.key && handleFilterChange(filter.key, newValue)}
          />
        );

      case 'date':
        return (
          <DatePicker
            {...inputProps}
            placeholder={filter.placeholder}
            value={value}
            required={filter.validation?.required}
            onChange={(newValue) => filter.key && handleFilterChange(filter.key, newValue)}
          />
        );

      case 'daterange':
        return (
          <div className="flex gap-2">
            <DatePicker
              {...inputProps}
              id={`${inputProps.id}-start`}
              placeholder="Start date"
              value={value?.start || ''}
              onChange={(newValue) => filter.key && handleFilterChange(filter.key, { ...value, start: newValue })}
            />
            <DatePicker
              {...inputProps}
              id={`${inputProps.id}-end`}
              placeholder="End date"
              value={value?.end || ''}
              onChange={(newValue) => filter.key && handleFilterChange(filter.key, { ...value, end: newValue })}
            />
          </div>
        );

      case 'checkbox':
        return (
          <Checkbox
            {...inputProps}
            label={filter.label}
            checked={Boolean(value)}
            required={filter.validation?.required}
            onChange={(checked) => filter.key && handleFilterChange(filter.key, checked)}
          />
        );

      default:
        return null;
    }
  };

  // Build container classes
  const containerClasses = cn(
    'filter-panel bg-white border border-gray-200 rounded-lg overflow-hidden',
    variant === 'outlined' && 'border-2',
    variant === 'filled' && 'bg-gray-50',
    commerceState === 'completion' && 'opacity-75',
    className
  );

  // Build header classes
  const headerClasses = cn(
    'flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50',
    collapsible && 'cursor-pointer hover:bg-gray-100 transition-colors'
  );

  // Build content classes
  const contentClasses = cn(
    'p-4 transition-all duration-300',
    collapsed && 'hidden',
    layout === 'grid' && `grid gap-4 grid-cols-1 md:grid-cols-${columns}`,
    layout === 'horizontal' && 'flex flex-wrap gap-4',
    layout === 'vertical' && 'space-y-4'
  );

  // Build actions classes
  const actionsClasses = cn(
    'flex gap-2 pt-4 border-t border-gray-200',
    layout === 'horizontal' && 'justify-end'
  );

  // Collapse icon
  const CollapseIcon = () => (
    <svg
      className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className={containerClasses} style={style}>
      {/* Header */}
      <div
        className={headerClasses}
        onClick={collapsible ? handleToggleCollapse : undefined}
      >
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
          {commerceState && (
            <span className="inline-block mt-1 text-xs text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded">
              {commerceState}
            </span>
          )}
        </div>
        
        {collapsible && (
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={collapsed ? 'Expand filters' : 'Collapse filters'}
          >
            <CollapseIcon />
          </button>
        )}
      </div>

      {/* Content */}
      <div className={contentClasses}>
        {filters
          .filter(filter => filter.visible !== false)
          .map((filter) => (
            <div key={filter.key} className="filter-item">
              {filter.type !== 'checkbox' && (
                <label
                  htmlFor={`${id}-${filter.key}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {filter.label}
                  {filter.validation?.required && (
                    <span className="text-error-500 ml-1">*</span>
                  )}
                </label>
              )}
              {renderFilterInput(filter)}
            </div>
          ))}

        {/* Actions */}
        {!autoApply && (showApplyButton || showClearButton || showResetButton) && (
          <div className={actionsClasses}>
            {showClearButton && (
              <Button
                variant="tertiary"
                size={size}
                onClick={handleClear}
                disabled={isDisabled}
                commerceState={commerceState}
                allowedActions={allowedActions}
                userRole={userRole}
                auditTrail={auditTrail}
              >
                {clearButtonText}
              </Button>
            )}
            
            {showResetButton && (
              <Button
                variant="secondary"
                size={size}
                onClick={handleReset}
                disabled={isDisabled}
                commerceState={commerceState}
                allowedActions={allowedActions}
                userRole={userRole}
                auditTrail={auditTrail}
              >
                {resetButtonText}
              </Button>
            )}
            
            {showApplyButton && (
              <Button
                variant="primary"
                size={size}
                onClick={handleApply}
                disabled={isDisabled || !hasChanges}
                commerceState={commerceState}
                allowedActions={allowedActions}
                userRole={userRole}
                auditTrail={auditTrail}
              >
                {applyButtonText}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* AI Config Display (development only) */}
      {process.env.NODE_ENV === 'development' && aiConfig && (
        <div className="absolute -top-6 left-0 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
          AI: {JSON.stringify(aiConfig.layout)}
        </div>
      )}
    </div>
  );
};

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;