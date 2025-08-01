import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { TabProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Tab = forwardRef<HTMLDivElement, TabProps>(
  (
    {
      items,
      activeTab,
      defaultActiveTab,
      variant = 'default',
      size = 'md',
      orientation = 'horizontal',
      closable = false,
      addable = false,
      scrollable = false,
      centered = false,
      fullWidth = false,
      onChange,
      onClose,
      onAdd,
      commerceState = 'none',
      workflowContext,
      aiConfig,
      schema,
      allowedActions = [],
      userRole,
      data,
      onUpdate,
      auditTrail = { enabled: false, level: 'basic', trackChanges: false, logUserActions: false },
      encryptionLevel = 'none',
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const [currentTab, setCurrentTab] = useState(activeTab || defaultActiveTab || items?.[0]?.id);
    const tabsRef = useRef<HTMLDivElement>(null);

    // Update active tab when controlled
    useEffect(() => {
      if (activeTab !== undefined) {
        setCurrentTab(activeTab);
      }
    }, [activeTab]);

    // Handle tab change
    const handleTabChange = (tabId: string) => {
      if (!items?.find(item => item.id === tabId)?.disabled) {
        setCurrentTab(tabId);
        
        // Audit trail logging
        if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.logUserActions) {
          console.log('Tab change tracked:', {
            action: 'tab_change',
            tabId,
            previousTab: currentTab,
            timestamp: new Date(),
            commerceState,
            workflowContext,
            userRole
          });
        }

        if (onChange && typeof onChange === 'function') {
          onChange(tabId);
        }

        if (onUpdate && typeof onUpdate === 'function') {
          onUpdate(tabId);
        }
      }
    };

    // Handle tab close
    const handleTabClose = (tabId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      
      if (onClose && typeof onClose === 'function') {
        onClose(tabId);
      }
    };

    // Handle add tab
    const handleAddTab = () => {
      if (onAdd && typeof onAdd === 'function') {
        onAdd();
      }
    };

    // Size classes
    const sizeClasses = {
      sm: {
        tab: 'text-sm px-3 py-2',
        icon: 'w-4 h-4',
        badge: 'text-xs px-2 py-0.5',
        close: 'w-3 h-3 p-0.5',
        content: 'text-sm'
      },
      md: {
        tab: 'text-base px-4 py-3',
        icon: 'w-5 h-5',
        badge: 'text-xs px-2 py-1',
        close: 'w-4 h-4 p-1',
        content: 'text-base'
      },
      lg: {
        tab: 'text-lg px-6 py-4',
        icon: 'w-6 h-6',
        badge: 'text-sm px-3 py-1',
        close: 'w-5 h-5 p-1',
        content: 'text-lg'
      }
    };

    // Enhanced variant classes with better styling
    const variantClasses = {
      default: {
        container: 'border-b-2 border-gray-200 dark:bg-transparent bg-white',
        tab: 'border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700 transition-all duration-300 relative',
        active: 'border-primary-500 dark:text-white text-primary-600 bg-primary-50/30 font-semibold',
        inactive: 'text-gray-500 hover:bg-gray-50',
        content: 'mt-6 p-4 dark:bg-transparent bg-white rounded-lg shadow-sm border border-gray-100'
      },
      pills: {
        container: 'dark:bg-transparent bg-gray-100 rounded-xl p-1.5 shadow-inner',
        tab: 'rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium',
        active: 'dark:bg-transparent bg-white dark:text-white text-gray-900 shadow-md font-semibold ring-1 ring-gray-200',
        inactive: 'text-gray-600 hover:text-gray-800',
        content: 'mt-6 p-4 dark:bg-transparent bg-white rounded-lg shadow-sm border border-gray-100'
      },
      underline: {
        container: 'border-b border-gray-200 dark:bg-transparent bg-white relative',
        tab: 'border-b-2 border-transparent hover:border-gray-300 transition-all duration-300 relative group',
        active: 'border-primary-500 dark:text-white text-primary-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-primary-400 after:to-primary-600 after:rounded-full after:shadow-sm',
        inactive: 'text-gray-500 hover:text-gray-700',
        content: 'mt-6 p-4 dark:bg-transparent bg-white rounded-lg shadow-sm border border-gray-100'
      },
      card: {
        container: 'bg-gray-50 border-b border-gray-200 p-2 rounded-t-lg',
        tab: 'border border-gray-200 border-b-0 rounded-t-lg dark:bg-transparent bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm',
        active: 'dark:bg-transparent bg-white border-gray-300 dark:text-white text-gray-900 shadow-md font-semibold border-b-2 border-b-white -mb-px z-10 relative',
        inactive: 'text-gray-600 hover:text-gray-800 bg-gray-100',
        content: 'p-6 dark:bg-transparent bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0'
      }
    };

    // Commerce state classes
    const commerceStateClasses = {
      initiation: 'ring-primary-300',
      agreement: 'ring-warning-300',
      execution: 'ring-primary-500',
      settlement: 'ring-gray-400',
      completion: 'ring-success-300',
      none: 'ring-0'
    };

    // Container classes
    const containerClasses = cn(
      'w-full font-work-sans',
      commerceState && commerceStateClasses[commerceState] ? `${commerceStateClasses[commerceState]} rounded-lg p-2` : '',
      className
    );

    // Tab list classes
    const getTabListClasses = () => {
      return cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col space-y-1',
        orientation === 'horizontal' && scrollable && 'overflow-x-auto scrollbar-hide',
        orientation === 'horizontal' && centered && 'justify-center',
        orientation === 'horizontal' && fullWidth && 'w-full',
        variantClasses[variant].container
      );
    };

    // Tab classes
    const getTabClasses = (item: any, isActive: boolean) => {
      return cn(
        'relative flex items-center justify-center cursor-pointer transition-all duration-300 font-medium focus:outline-none focus:ring-primary-500 focus:ring-offset-2 rounded-md',
        sizeClasses[size].tab,
        variantClasses[variant].tab,
        isActive ? variantClasses[variant].active : variantClasses[variant].inactive,
        item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        fullWidth && orientation === 'horizontal' && 'flex-1',
        'group'
      );
    };

    // Get current tab content
    const getCurrentTabContent = () => {
      const currentTabData = items?.find(item => item.id === currentTab);
      return currentTabData?.content || null;
    };

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        {...props}
      >
        {/* Tab Headers */}
        <div
          ref={tabsRef}
          className={getTabListClasses()}
          role="tablist"
          aria-orientation={orientation}
        >
          {items && items.map((item) => {
            const isActive = item.id === currentTab;
            
            return (
              <button
                key={item.id}
                className={getTabClasses(item, isActive)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${item.id}`}
                id={`tab-${item.id}`}
                tabIndex={isActive ? 0 : -1}
                disabled={item.disabled}
                onClick={() => item.id && handleTabChange(item.id)}
              >
                {/* Icon */}
                {item.icon && (
                  <span className={cn(
                    'mr-2 flex-shrink-0 transition-transform duration-200',
                    sizeClasses[size].icon,
                    isActive && 'transform scale-110'
                  )}>
                    {item.icon}
                  </span>
                )}

                {/* Label */}
                <span className="truncate">{item.label}</span>

                {/* Badge */}
                {item.badge && (
                  <span className={cn(
                    'ml-2 rounded-full font-semibold transition-colors duration-200',
                    sizeClasses[size].badge,
                    isActive 
                      ? 'bg-primary-100 text-primary-800' 
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  )}>
                    {item.badge}
                  </span>
                )}

                {/* Close button */}
                {(closable || item.closable) && (
                  <span
                    onClick={(e) => item.id && handleTabClose(item.id, e)}
                    className={cn(
                      'ml-2 rounded-full hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-red-500 transition-all duration-200',
                      sizeClasses[size].close
                    )}
                    aria-label={`Close ${item.label}`}
                  >
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                )}

                {/* Hover effect for underline variant */}
                {variant === 'underline' && !isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                )}
              </button>
            );
          })}

          {/* Add Tab button */}
          {addable && (
            <button
              onClick={handleAddTab}
              className={cn(
                'flex items-center justify-center cursor-pointer transition-all duration-300 border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 rounded-lg',
                sizeClasses[size].tab,
                'dark:text-white text-gray-500 hover:text-primary-600 min-w-[120px]'
              )}
              aria-label="Add new tab"
            >
              <svg className={cn('mr-2', sizeClasses[size].icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-medium">Add Tab</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className={cn(
          'transition-all duration-300',
          variantClasses[variant].content,
          sizeClasses[size].content
        )}>
          {items && items.map((item) => (
            <div
              key={item.id}
              id={`tabpanel-${item.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${item.id}`}
              hidden={item.id !== currentTab}
              tabIndex={0}
              className={cn(
                'focus:outline-none transition-opacity duration-300',
                item.id === currentTab ? 'opacity-100' : 'opacity-0'
              )}
            >
              {item.id === currentTab && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Commerce state indicator */}
        {/* {commerceState && commerceState !== 'initiation' && (
          <div className={cn(
            'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm',
            commerceState === 'agreement' && 'bg-warning-500',
            commerceState === 'execution' && 'bg-primary-600',
            commerceState === 'settlement' && 'bg-gray-500',
            commerceState === 'completion' && 'bg-success-500'
          )} />
        )} */}

        {/* AI Config Display (development only) */}
        {process.env.NODE_ENV === 'development' && aiConfig && (
          <div className="absolute -top-8 left-0 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
            AI Config: {JSON.stringify(aiConfig.layout || 'default')}
          </div>
        )}
      </div>
    );
  }
);

Tab.displayName = 'Tab';

export default Tab;