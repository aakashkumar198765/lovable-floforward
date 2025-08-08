import React, { forwardRef, useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import { TabProps } from "../../../types";
import { cn } from "../../../utils/utils";
import {
  tabSizeClasses,
  tabVariantClasses,
} from "../../../utils/tailwindClassMaps";
import Button from "../form/Button";

const Tab = forwardRef<HTMLDivElement, TabProps>(
  (
    {
      items,
      activeTab,
      defaultActiveTab,
      variant = "default",
      size = "md",
      orientation = "horizontal",
      closable = false,
      addable = false,
      scrollable = false,
      centered = false,
      fullWidth = false,
      onChange,
      onClose,
      onAdd,
      className = "",
      style = {},
      ...props
    },
    ref
  ) => {
    const [currentTab, setCurrentTab] = useState(
      activeTab || defaultActiveTab || items?.[0]?.id
    );
    const tabsRef = useRef<HTMLDivElement>(null);

    // Update active tab when controlled
    useEffect(() => {
      if (activeTab !== undefined) {
        setCurrentTab(activeTab);
      }
    }, [activeTab]);

    // Handle tab change
    const handleTabChange = (tabId: string) => {
      if (!items?.find((item) => item.id === tabId)?.disabled) {
        setCurrentTab(tabId);

        if (onChange && typeof onChange === "function") {
          onChange(tabId);
        }
      }
    };

    // Handle tab close
    const handleTabClose = (tabId: string, event: React.MouseEvent) => {
      event.stopPropagation();

      if (onClose && typeof onClose === "function") {
        onClose(tabId);
      }
    };

    // Handle add tab
    const handleAddTab = () => {
      if (onAdd && typeof onAdd === "function") {
        onAdd();
      }
    };

    // Use centralized size and variant classes
    const sizeClasses = tabSizeClasses;
    const variantClasses = tabVariantClasses;

    // Container classes
    const containerClasses = cn("w-full font-work-sans", className);

    // Tab list classes
    const getTabListClasses = () => {
      return cn(
        "flex",
        orientation === "horizontal" ? "flex-row" : "flex-col space-y-1",
        orientation === "horizontal" &&
          scrollable &&
          "overflow-x-auto scrollbar-hide",
        orientation === "horizontal" && centered && "justify-center",
        orientation === "horizontal" && fullWidth && "w-full",
        variantClasses[variant].container
      );
    };

    // Tab classes
    const getTabClasses = (item: any, isActive: boolean) => {
      return cn(
        "relative flex items-center justify-center cursor-pointer transition-all duration-300 font-medium focus:outline-none focus:ring-primary-500 focus:ring-offset-2 rounded-md",
        sizeClasses[size].tab,
        variantClasses[variant].tab,
        isActive
          ? variantClasses[variant].active
          : variantClasses[variant].inactive,
        item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        fullWidth && orientation === "horizontal" && "flex-1",
        "group"
      );
    };

    // Get current tab content
    const getCurrentTabContent = () => {
      const currentTabData = items?.find((item) => item.id === currentTab);
      return currentTabData?.content || null;
    };

    return (
      <div ref={ref} className={containerClasses} style={style} {...props}>
        {/* Tab Headers */}
        <div
          ref={tabsRef}
          className={getTabListClasses()}
          role="tablist"
          aria-orientation={orientation}
        >
          {items &&
            items.map((item) => {
              const isActive = item.id === currentTab;

              return (
                <Button
                  key={item.id}
                  applyDefaultClasses={false}
                  className={cn(
                    getTabClasses(item, isActive),
                    "flex items-center justify-center",
                    (variant === "bordered" || variant === "simple") && "rounded-none"
                  )}
                  style={{ display: 'flex' }}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${item.id}`}
                  id={`tab-${item.id}`}
                  tabIndex={isActive ? 0 : -1}
                  disabled={item.disabled}
                  onClick={() => item.id && handleTabChange(item.id)}
                >
                  <span className={cn(
                    "flex items-center gap-2",
                    (!item.icon && !item.badge) && "justify-center"
                  )}>
                    {/* Icon */}
                    {item.icon && (
                      <span
                        className={cn(
                          "flex-shrink-0 transition-transform duration-200 flex items-center justify-center",
                          sizeClasses[size].icon,
                          isActive && "transform scale-110"
                        )}
                      >
                        {item.icon}
                      </span>
                    )}

                    {/* Label */}
                    <span className="truncate">{item.label}</span>

                    {/* Badge */}
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full font-semibold transition-colors duration-200 flex items-center justify-center",
                          sizeClasses[size].badge,
                          isActive
                            ? "bg-primary-100 text-primary-800"
                            : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                  {/* Close button */}
                  {(closable || item.closable) && (
                    <Button
                      applyDefaultClasses={false}
                      variant="ghost"
                      size="xs"
                      onClick={(e) => item.id && handleTabClose(item.id, e)}
                      className={cn(
                        "ml-2 rounded-full hover:bg-red-100 hover:text-red-600 p-1 flex items-center justify-center",
                        sizeClasses[size].close
                      )}
                      style={{ display: 'flex' }}
                      aria-label={`Close ${item.label}`}
                    >
                      <X className="w-full h-full" />
                    </Button>
                  )}

                  {/* Hover effect for underline variant */}
                  {variant === "underline" && !isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                  )}
                  </span>
                </Button>
              );
            })}

          {/* Add Tab button */}
          {addable && (
            <Button
              applyDefaultClasses={false}
              variant="secondary"
              size={size}
              onClick={handleAddTab}
              className={cn(
                "border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50",
                "dark:text-white text-gray-500 hover:text-primary-600 min-w-[120px]",
                "flex items-center justify-center"
              )}
              style={{ display: 'flex' }}
              aria-label="Add new tab"
            >
              <span className="flex items-center gap-2">
                <Plus className={cn("flex items-center justify-center", sizeClasses[size].icon)} />
                <span className="font-medium">Add Tab</span>
              </span>
            </Button>
          )}
        </div>

        {/* Tab Content */}
        {items?.some((item) => item?.content) && (
          <div
            className={cn(
              "h-full transition-all duration-300",
              variantClasses[variant].content,
              sizeClasses[size].content
            )}
          >
            {items &&
              items?.map((item) => (
                <div
                  key={item?.id}
                  id={`tabpanel-${item?.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${item?.id}`}
                  hidden={item?.id !== currentTab}
                  tabIndex={0}
                  className={cn(
                    "h-full focus:outline-none transition-opacity duration-300",
                    item?.id === currentTab ? "opacity-100" : "opacity-0"
                  )}
                >
                  {item?.id === currentTab && (
                    <div className="h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {item?.content}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }
);

Tab.displayName = 'Tab';

export default Tab;