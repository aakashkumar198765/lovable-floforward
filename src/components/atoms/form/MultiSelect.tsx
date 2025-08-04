import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { MultiSelectProps, SelectOption, SelectGroup } from "../../../types";
import { cn } from "../../../utils/cn";
import Badge from "../display/Badge";

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      id = "",
      name = "",
      placeholder = "Select options",
      value = [],
      defaultValue = [],
      disabled = false,
      readonly = false,
      required = false,
      multiple = true,
      searchable = false,
      clearable = false,
      size = "md",
      variant = "default",
      status = "default",
      label = "",
      helperText = "",
      errorMessage = "",
      options = [],
      groups = [],
      maxSelections,
      badgeColor = "primary",
      badgeVariant = "default",
      showBadges = true,
      noOptionsMessage = "No options available",
      loadingMessage = "Loading...",
      isLoading = false,
      className = "",
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
    const [internalValue, setInternalValue] = useState<string[]>(
      value !== undefined && Array.isArray(value)
        ? value
        : defaultValue !== undefined && Array.isArray(defaultValue)
        ? defaultValue
        : []
    );
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Update internal value when external value changes
    useEffect(() => {
      if (value !== undefined && Array.isArray(value) && value?.length > 0) {
        setInternalValue(value);
      }
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get all options (from both options and groups)
    const allOptions = [
      ...options,
      ...groups.flatMap((group) => group.options || []),
    ];

    // Get selected options
    const selectedOptions = allOptions.filter(
      (option) => option.value && internalValue.includes(String(option.value))
    );

    // Handle value changes with audit trail
    const handleChange = (newValue: string[]) => {
      const newSelectedOptions = allOptions.filter(
        (option) => option.value && newValue.includes(String(option.value))
      );
      setInternalValue(newValue);

      // Call external onChange
      if (onChange && typeof onChange === "function") {
        onChange(newValue, newSelectedOptions);
      }
    };

    const handleOptionToggle = useCallback(
      (
        optionValue: string,
        event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent
      ) => {
        if (event) {
          event.stopPropagation();
        }

        if (disabled || readonly) return;

        const isCurrentlySelected = internalValue.includes(String(optionValue));
        let newValue: string[];

        if (isCurrentlySelected) {
          // Remove the option
          newValue = internalValue.filter((val) => val !== String(optionValue));
        } else {
          // Add the option (check max selections)
          if (maxSelections && internalValue.length >= maxSelections) {
            return; // Don't add if max reached
          }
          newValue = [...internalValue, String(optionValue)];
        }

        handleChange(newValue);
      },
      [internalValue, disabled, readonly, maxSelections]
    );

    const handleBadgeRemove = (optionValue: string) => {
      if (disabled || readonly) return;
      const newValue = internalValue.filter((val) => val !== String(optionValue));
      handleChange(newValue);
    };

    const handleTriggerClick = useCallback(() => {
      if (!disabled && !readonly) {
        setIsOpen(!isOpen);
        // Focus search input when opening if searchable
        if (!isOpen && searchable) {
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 100);
        }
      }
    }, [disabled, readonly, isOpen, searchable]);

    const handleTriggerFocus = useCallback(() => {
      setIsFocused(true);
      if (onFocus && typeof onFocus === "function") {
        onFocus({} as React.FocusEvent<HTMLSelectElement>);
      }
    }, [onFocus]);

    const handleTriggerBlur = useCallback(() => {
      setIsFocused(false);
      if (onBlur && typeof onBlur === "function") {
        onBlur({} as React.FocusEvent<HTMLSelectElement>);
      }
    }, [onBlur]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      const term = event.target.value;
      setSearchTerm(term);
      if (onSearch && typeof onSearch === "function") {
        onSearch(term);
      }
    };

    const handleClear = useCallback(
      (event?: React.MouseEvent) => {
        if (event) {
          event.stopPropagation();
        }
        setInternalValue([]);
        setSearchTerm("");
        if (onClear && typeof onClear === "function") {
          onClear();
        }
        if (onChange && typeof onChange === "function") {
          onChange([], []);
        }
      },
      [onClear, onChange]
    );

    // Filter options based on search term
    const filteredOptions = options.filter(
      (option) =>
        option.label &&
        option.value &&
        (option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Filter groups based on search term
    const filteredGroups = groups
      .map((group) => ({
        ...group,
        options: (group.options || []).filter(
          (option) =>
            option.label &&
            option.value &&
            (option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
              option.value.toLowerCase().includes(searchTerm.toLowerCase()))
        ),
      }))
      .filter((group) => (group.options || []).length > 0);

    // Size classes
    const sizeClasses = {
      sm: "px-3 py-2 text-sm min-h-[36px]",
      md: "px-4 py-3 text-base min-h-[44px]",
      lg: "px-5 py-4 text-lg min-h-[52px]",
    };

    // Variant classes
    const variantClasses = {
      default: "border border-gray-300 bg-white",
      outlined: "border-2 border-gray-300 bg-transparent",
      filled: "border-0 bg-gray-100",
    };

    // Status classes
    const statusClasses = {
      default:
        "border-gray-300 focus-within:border-primary-500 focus-within:ring-primary-500",
      error:
        "border-error-500 focus-within:border-error-500 focus-within:ring-error-500",
      warning:
        "border-warning-500 focus-within:border-warning-500 focus-within:ring-warning-500",
      success:
        "border-success-500 focus-within:border-success-500 focus-within:ring-success-500",
    };


    // Build container classes
    const containerClasses = cn(
      "w-full rounded-md transition-all duration-200 cursor-pointer",
      "font-work-sans",
      "focus-within:outline-none focus-within:ring-2 focus-within:ring-opacity-50",
      "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
      "readonly:bg-gray-50 readonly:cursor-default",
      "flex justify-between",
      sizeClasses[size] || sizeClasses.md,
      variantClasses[variant] || variantClasses.default,
      status && status !== "default" && statusClasses[status]
        ? statusClasses[status]
        : statusClasses.default,
      (disabled || readonly) && "cursor-not-allowed opacity-60",
      className || ""
    );

    // Label classes
    const labelClasses = cn(
      "block text-sm font-medium text-gray-700 mb-1",
      required && 'after:content-["*"] after:text-error-500 after:ml-1'
    );

    // Helper text classes
    const helperTextClasses = cn(
      "mt-1 text-sm text-gray-500",
      status === "error" && "text-error-500",
      status === "warning" && "text-warning-500",
      status === "success" && "text-success-500"
    );

    // Wrapper classes
    const wrapperClasses = cn(
      "relative",
      style && typeof style === "object" && "custom-style"
    );

    // Render option in dropdown with proper checkbox handling
    const renderOption = (option: SelectOption, isGrouped = false) => {
      if (!option.value) return null;

      const isSelected = internalValue.includes(option.value);
      const isOptionDisabled = option.disabled || disabled || readonly;

      const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (!isOptionDisabled && option.value) {
          handleOptionToggle(option.value, e);
        }
      };

      const handleLabelClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOptionDisabled && option.value) {
          handleOptionToggle(option.value, e);
        }
      };

      return (
        <div
          key={option.value}
          className={cn(
            "flex items-center px-3 py-2 text-sm hover:bg-gray-50 select-none transition-colors",
            isGrouped && "pl-6",
            isOptionDisabled && "cursor-not-allowed opacity-50 bg-gray-50",
            isSelected && "bg-primary-50 text-primary-600"
          )}
          onClick={handleLabelClick}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            disabled={isOptionDisabled}
            className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />

          {option.icon && <span className="mr-2 text-base">{option.icon}</span>}

          <div className="flex-1">
            <span className="block cursor-pointer">{option.label}</span>
            {option.description && (
              <span className="text-xs text-gray-500 block mt-0.5 cursor-pointer">
                {option.description}
              </span>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className={wrapperClasses} style={style} ref={ref}>
        {label && label !== "" && (
          <label className={labelClasses}>
            {label}
          </label>
        )}

        <div className="relative" ref={dropdownRef}>
          <div
            ref={triggerRef}
            className={containerClasses}
            onClick={handleTriggerClick}
            onFocus={handleTriggerFocus}
            onBlur={handleTriggerBlur}
            tabIndex={disabled || readonly ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={status === "error"}
            aria-describedby={
              (helperText && helperText !== "") ||
              (errorMessage && errorMessage !== "")
                ? `${id || "multiselect"}-description`
                : undefined
            }
          >
            {/* Selected badges */}
            {showBadges && selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions
                  .filter((option) => option.value)
                  .map((option) => (
                    <Badge
                      key={option.value}
                      variant={badgeVariant}
                      color={badgeColor}
                      removable={!disabled && !readonly}
                      onRemove={() =>
                        option.value && handleBadgeRemove(option.value)
                      }
                      className="text-xs"
                    >
                      {option.label}
                    </Badge>
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span
                  className={cn(
                    "block truncate",
                    selectedOptions.length === 0
                      ? "text-gray-500"
                      : "text-gray-900"
                  )}
                >
                  {selectedOptions.length === 0
                    ? placeholder
                    : `${selectedOptions.length} item${
                        selectedOptions.length === 1 ? "" : "s"
                      } selected`}
                </span>
                <span className="ml-2 text-gray-400 pointer-events-none">
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>
            )}

            {/* Show chevron when badges are displayed */}
            {showBadges && selectedOptions.length > 0 && (
              <span className="ml-2 text-gray-400 pointer-events-none flex-shrink-0">
                {isOpen ? "▲" : "▼"}
              </span>
            )}
          </div>

          {/* Hidden select for form submission */}
          <select
            name={name || ""}
            multiple
            value={internalValue}
            onChange={() => {}} // Controlled by our logic
            style={{ display: "none" }}
            tabIndex={-1}
            aria-hidden="true"
          >
            {internalValue.map((val) => (
              <option key={val} value={val} selected>
                {allOptions.find((opt) => opt && opt.value === val)?.label ||
                  val}
              </option>
            ))}
          </select>

          {/* Dropdown */}
          {isOpen && !disabled && !readonly && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
              {/* Search input */}
              {searchable && (
                <div className="p-3 border-b border-gray-200">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Options container */}
              <div className="max-h-48 overflow-y-auto">
                {isLoading ? (
                  <div className="px-3 py-4 text-sm text-gray-500 text-center">
                    {loadingMessage}
                  </div>
                ) : (
                  <>
                    {/* Regular options */}
                    {filteredOptions.map((option) => renderOption(option))}

                    {/* Grouped options */}
                    {filteredGroups.map((group) => (
                      <div key={group.label}>
                        <div className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 border-b border-gray-200 uppercase tracking-wide">
                          {group.label}
                        </div>
                        {group.options.map((option) =>
                          renderOption(option, true)
                        )}
                      </div>
                    ))}

                    {/* No options message */}
                    {filteredOptions.length === 0 &&
                      filteredGroups.length === 0 && (
                        <div className="px-3 py-4 text-sm text-gray-500 text-center">
                          {noOptionsMessage}
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Clear button */}
          {clearable &&
            internalValue.length > 0 &&
            !disabled &&
            !readonly && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
                aria-label="Clear selection"
              >
                <span className="text-lg">×</span>
              </button>
            )}
        </div>

        {/* Selection count */}
        {internalValue.length > 0 && (
          <div className="mt-1 text-xs text-gray-500">
            {internalValue.length}{" "}
            {internalValue.length === 1 ? "item" : "items"} selected
            {maxSelections && ` (max ${maxSelections})`}
          </div>
        )}

        {((helperText && helperText !== "") ||
          (errorMessage && errorMessage !== "")) && (
          <p
            id={`${id || "multiselect"}-description`}
            className={helperTextClasses}
          >
            {status === "error" && errorMessage && errorMessage !== ""
              ? errorMessage
              : helperText}
          </p>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
