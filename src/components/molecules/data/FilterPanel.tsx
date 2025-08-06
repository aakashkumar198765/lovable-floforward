import React, { useState, useCallback, useEffect } from 'react';
import { FilterPanelProps, FilterOption, FilterValue } from '../../../types';
import { cn } from '../../../utils/utils';
import Button from '../../atoms/form/Button';
import Select from '../../atoms/form/Select';
import Input from '../../atoms/form/Input';
import Checkbox from '../../atoms/form/Checkbox';
import DatePicker from '../../atoms/form/DatePicker';
import Label from '../../atoms/display/Label';
import { ChevronDown } from 'lucide-react';

const FilterPanel: React.FC<FilterPanelProps> = ({
  id = "filter-panel",
  title = "Filters",
  description = "",
  filters = [],
  values,
  defaultValues = {},
  layout = "vertical",
  columns = 2,
  collapsible = true,
  collapsed: initialCollapsed = false,
  showApplyButton = true,
  showClearButton = true,
  showResetButton = false,
  applyButtonText = "Apply Filters",
  clearButtonText = "Clear All",
  resetButtonText = "Reset",
  autoApply = false,
  debounceMs = 300,
  size = "md",
  variant = "default",
  className = "",
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
  const handleFilterChange = useCallback(
    (key: string, value: any) => {
      const newValues = { ...internalValues, [key]: value };
      setInternalValues(newValues);
      setHasChanges(true);

      // Call callbacks
      onFilterChange(key, value);
    },
    [internalValues, onFilterChange]
  );

  // Handle apply filters
  const handleApply = useCallback(() => {
    onApply(internalValues);
    setHasChanges(false);

    // Call callbacks
    onChange(internalValues);
  }, [internalValues, onApply, onChange]);

  // Handle clear filters
  const handleClear = useCallback(() => {
    const clearedValues: FilterValue = {};
    filters.forEach((filter) => {
      if (filter.type === "checkbox") {
        filter.key && (clearedValues[filter.key] = false);
      } else {
        filter.key && (clearedValues[filter.key] = "");
      }
    });

    setInternalValues(clearedValues);
    setHasChanges(false);
    onClear();
    onChange(clearedValues);
  }, [filters, onClear, onChange]);

  // Handle reset filters
  const handleReset = useCallback(() => {
    setInternalValues(defaultValues);
    setHasChanges(false);
    onReset();
    onChange(defaultValues);
  }, [defaultValues, onReset, onChange]);

  // Handle toggle collapse
  const handleToggleCollapse = useCallback(() => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onToggleCollapse(newCollapsed);
  }, [collapsed, onToggleCollapse]);

  // Render filter input based on type
  const renderFilterInput = (filter: FilterOption) => {
    const value =
      (filter.key ? internalValues[filter.key] : undefined) ||
      filter.defaultValue ||
      "";
    const inputProps = {
      id: `${id}-${filter.key}`,
      name: filter.key,
      disabled: filter.disabled,
      size,
    };

    switch (filter.type) {
      case "text":
        return (
          <Input
            {...inputProps}
            type="text"
            placeholder={filter.placeholder}
            value={value}
            required={filter.validation?.required}
            pattern={filter.validation?.pattern}
            onChange={(e) =>
              filter.key && handleFilterChange(filter.key, e.target.value)
            }
          />
        );

      case "number":
        return (
          <Input
            {...inputProps}
            type="number"
            placeholder={filter.placeholder}
            value={value}
            required={filter.validation?.required}
            min={filter.validation?.min}
            max={filter.validation?.max}
            onChange={(e) =>
              filter.key && handleFilterChange(filter.key, e.target.value)
            }
          />
        );

      case "select":
        return (
          <Select
            {...inputProps}
            placeholder={filter.placeholder}
            value={value}
            required={filter.validation?.required}
            options={filter.options || []}
            onChange={(newValue) =>
              filter.key && handleFilterChange(filter.key, newValue)
            }
          />
        );

      case "multiselect":
        return (
          <Select
            {...inputProps}
            placeholder={filter.placeholder}
            value={value}
            multiple
            required={filter.validation?.required}
            options={filter.options || []}
            onChange={(newValue) =>
              filter.key && handleFilterChange(filter.key, newValue)
            }
          />
        );

      case "date":
        return (
          <DatePicker
            {...inputProps}
            placeholder={filter.placeholder}
            value={value}
            required={filter.validation?.required}
            onChange={(newValue) =>
              filter.key && handleFilterChange(filter.key, newValue)
            }
          />
        );

      case "daterange":
        return (
          <div className="flex gap-2">
            <DatePicker
              {...inputProps}
              id={`${inputProps.id}-start`}
              placeholder="Start date"
              value={value?.start || ""}
              onChange={(newValue) =>
                filter.key &&
                handleFilterChange(filter.key, { ...value, start: newValue })
              }
            />
            <DatePicker
              {...inputProps}
              id={`${inputProps.id}-end`}
              placeholder="End date"
              value={value?.end || ""}
              onChange={(newValue) =>
                filter.key &&
                handleFilterChange(filter.key, { ...value, end: newValue })
              }
            />
          </div>
        );

      case "checkbox":
        return (
          <Checkbox
            {...inputProps}
            label={filter.label}
            checked={Boolean(value)}
            required={filter.validation?.required}
            onChange={(checked) =>
              filter.key && handleFilterChange(filter.key, checked)
            }
          />
        );

      default:
        return null;
    }
  };

  // Build container classes
  const containerClasses = cn(
    "filter-panel bg-white border border-gray-200 rounded-lg overflow-hidden",
    variant === "outlined" && "border-2",
    variant === "filled" && "bg-gray-50",
    className
  );

  // Build header classes
  const headerClasses = cn(
    "flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50",
    collapsible && "cursor-pointer hover:bg-gray-100 transition-colors"
  );

  // Build content classes
  const contentClasses = cn(
    "p-4 transition-all duration-300",
    collapsed && "hidden",
    layout === "grid" && `grid gap-4 grid-cols-1 md:grid-cols-${columns}`,
    layout === "horizontal" && "flex flex-wrap gap-4",
    layout === "vertical" && "space-y-4"
  );

  // Build actions classes
  const actionsClasses = cn(
    "flex gap-2 pt-4 border-t border-gray-200",
    layout === "horizontal" && "justify-end"
  );

  // Collapse icon
  const CollapseIcon = () => (
    <ChevronDown
      className={cn("w-5 h-5 transition-transform", collapsed && "rotate-180")}
    />
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
        </div>

        {collapsible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleCollapse();
            }}
            iconLeft={<CollapseIcon />}
            aria-label={collapsed ? "Expand filters" : "Collapse filters"}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          />
        )}
      </div>

      {/* Content */}
      <div
        className={`${contentClasses} grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-baseline`}
      >
        {filters
          .filter((filter) => filter.visible !== false)
          .map((filter) => (
            <div key={filter.key} className="filter-item">
              {filter.type !== "checkbox" && (
                <Label
                  htmlFor={`${id}-${filter.key}`}
                  required={filter.validation?.required}
                >
                  {filter.label}
                </Label>
              )}
              {renderFilterInput(filter)}
            </div>
          ))}

        {/* Actions */}
        {!autoApply &&
          (showApplyButton || showClearButton || showResetButton) && (
            <div
              className={`${actionsClasses} col-span-full flex flex-wrap gap-2`}
            >
              {showClearButton && (
                <Button variant="tertiary" size={size} onClick={handleClear}>
                  {clearButtonText}
                </Button>
              )}

              {showResetButton && (
                <Button variant="secondary" size={size} onClick={handleReset}>
                  {resetButtonText}
                </Button>
              )}

              {showApplyButton && (
                <Button
                  variant="primary"
                  size={size}
                  onClick={handleApply}
                  disabled={!hasChanges}
                >
                  {applyButtonText}
                </Button>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

FilterPanel.displayName = "FilterPanel";

export default FilterPanel;
