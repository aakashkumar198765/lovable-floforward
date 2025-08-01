import React, { forwardRef, useState } from 'react';
import { BreadcrumbProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  (
    {
      items,
      separator,
      maxItems = 5,
      showHome = false,
      homeIcon,
      homeHref = '/',
      collapsible = true,
      onClick,
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
    const [isExpanded, setIsExpanded] = useState(false);

    // Handle item click
    const handleItemClick = (item: any) => {
      if (item.disabled) return;

      // Audit trail logging
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Breadcrumb click tracked:', {
          action: 'breadcrumb_click',
          itemId: item.id,
          label: item.label,
          href: item.href,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      if (onClick && typeof onClick === 'function') {
        onClick(item);
      }

      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate(item);
      }
    };

    // Enhanced separator options
    const separatorOptions = {
      arrow: (
        <svg className="w-4 h-4 dark:text-white text-gray-400 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      ),
      slash: <span className="mx-2 dark:text-white text-gray-400 font-medium">/</span>,
      dot: <span className="mx-2 dark:text-white text-gray-400">•</span>,
      dash: <span className="mx-2 dark:text-white text-gray-400">-</span>,
      pipe: <span className="mx-2 dark:text-white text-gray-400">|</span>,
      chevron: (
        <svg className="w-3 h-3 dark:text-white text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      )
    };

    // Default separator
    const defaultSeparator = separatorOptions.arrow;

    // Enhanced home icons
    const homeIconOptions = {
      home: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      house: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      dashboard: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    };

    const defaultHomeIcon = homeIconOptions.home;

    // Collapse items if needed
    const processedItems = () => {
      if (!collapsible || !items || items.length <= maxItems) {
        return items;
      }

      if (isExpanded) {
        return items;
      }

      const firstItem = items[0];
      const lastItems = items.slice(-2);
      
      return [
        firstItem,
        // { id: 'ellipsis', label: '...', disabled: true, isEllipsis: true } as BreadcrumbItem,
        ...lastItems
      ];
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

    // Enhanced breadcrumb item classes
    const getItemClasses = (item: any, isLast: boolean) => {
      return cn(
        'inline-flex items-center transition-all duration-200 font-work-sans relative group',
        item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        isLast || item.current
          ? 'dark:text-white text-gray-900 font-semibold'
          : 'dark:text-white text-gray-500 hover:text-gray-700 cursor-pointer font-medium',
        item.href && !item.disabled && !isLast && 'hover:text-primary-600 hover:underline',
        'px-2 py-1 rounded-md hover:bg-gray-50 transition-colors duration-200'
      );
    };

    // Container classes with enhanced styling
    const containerClasses = cn(
      'flex items-center space-x-1 text-sm font-work-sans dark:bg-transparent bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm',
      commerceState && commerceStateClasses[commerceState] ? `ring-2 ${commerceStateClasses[commerceState]}` : '',
      className
    );

    const displayItems = processedItems();

    return (
      <nav
        ref={ref}
        className={containerClasses}
        style={style}
        aria-label="Breadcrumb"
        {...props}
      >
        {/* Home item */}
        {showHome && (
          <>
            <button
              onClick={() => handleItemClick({ id: 'home', label: 'Home', href: homeHref })}
              className={cn(
                'inline-flex items-center dark:text-white text-gray-500 hover:text-primary-600 cursor-pointer transition-all duration-200 px-2 py-1 rounded-md hover:bg-primary-50 group',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              )}
              aria-label="Home"
            >
              <span className="group-hover:scale-110 transition-transform duration-200">
                {homeIcon || defaultHomeIcon}
              </span>
            </button>
            
            {items && items.length > 0 && (
              <span className="flex items-center flex-shrink-0">
                {separator || defaultSeparator}
              </span>
            )}
          </>
        )}

        {/* Breadcrumb items */}
        {displayItems && displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.isEllipsis;

          return (
            <React.Fragment key={item.id}>
              {isEllipsis ? (
                <button
                  onClick={() => setIsExpanded(true)}
                  className={cn(
                    'inline-flex items-center dark:text-white text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-200 px-3 py-1 rounded-md hover:bg-gray-100',
                    'flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                  )}
                  aria-label="Show more breadcrumb items"
                >
                  <span className="text-lg font-bold hover:scale-125 transition-transform duration-200">
                    ...
                  </span>
                </button>
              ) : (
                <div className={getItemClasses(item, isLast)}>
                  {/* Icon */}
                  {item.icon && (
                    <span className="mr-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                  )}

                  {/* Label */}
                  {item.href && !item.disabled && !isLast ? (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleItemClick(item);
                      }}
                      className={cn(
                        'truncate hover:underline transition-all duration-200 min-w-0',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                      title={typeof item.label === 'string' ? item.label : undefined}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      className={cn(
                        'truncate min-w-0',
                        !item.disabled && !isLast && 'cursor-pointer hover:text-primary-600'
                      )}
                      onClick={() => !item.disabled && !isLast && handleItemClick(item)}
                      aria-current={item.current || isLast ? 'page' : undefined}
                      title={typeof item.label === 'string' ? item.label : undefined}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Badge */}
                  {item.badge && (
                    <span className="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Separator */}
              {!isLast && (
                <span className="flex items-center opacity-70 hover:opacity-100 transition-opacity duration-200">
                  {separator || defaultSeparator}
                </span>
              )}
            </React.Fragment>
          );
        })}

        {/* Collapse button */}
        {collapsible && isExpanded && items && items.length > maxItems && (
          <button
            onClick={() => setIsExpanded(false)}
            className={cn(
              'ml-3 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200',
              'dark:text-white text-gray-400 hover:text-gray-600'
            )}
            aria-label="Collapse breadcrumb"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

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
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;