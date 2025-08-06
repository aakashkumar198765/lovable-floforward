import React, { forwardRef, useState } from 'react';
import { ChevronRight, Home, X } from 'lucide-react';
import { BreadcrumbProps } from '../../../types';
import { cn } from '../../../utils/utils';
import { Button } from '../form';

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


      if (onClick && typeof onClick === 'function') {
        onClick(item);
      }
    };

    // Enhanced separator options
    const separatorOptions = {
      arrow: (
        <ChevronRight className="w-4 h-4 dark:text-white text-gray-400 mx-2" />
      ),
      slash: <span className="mx-2 dark:text-white text-gray-400 font-medium">/</span>,
      dot: <span className="mx-2 dark:text-white text-gray-400">•</span>,
      dash: <span className="mx-2 dark:text-white text-gray-400">-</span>,
      pipe: <span className="mx-2 dark:text-white text-gray-400">|</span>,
      chevron: (
        <ChevronRight className="w-3 h-3 dark:text-white text-gray-400 mx-2" />
      )
    };

    // Default separator
    const defaultSeparator = separatorOptions.arrow;

    // Enhanced home icons
    const homeIconOptions = {
      home: (
        <Home className="w-4 h-4" />
      ),
      house: (
        <Home className="w-4 h-4" />
      ),
      dashboard: (
        <Home className="w-4 h-4" />
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
                <Button
                  applyDefaultClasses={false}
                  onClick={() => setIsExpanded(true)}
                  className={cn(
                    'inline-flex items-center dark:text-white text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-200 px-3 py-1 rounded-md hover:bg-gray-100',
                    'flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                  )}
                  style={{ display: 'flex' }}
                  aria-label="Show more breadcrumb items"
                >
                  <span className="text-lg font-bold hover:scale-125 transition-transform duration-200 flex items-center justify-center">
                    ...
                  </span>
                </Button>
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
          <Button
            applyDefaultClasses={false}
            onClick={() => setIsExpanded(false)}
            className={cn(
              'ml-3 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200',
              'dark:text-white text-gray-400 hover:text-gray-600'
            )}
            style={{ display: 'flex' }}
            aria-label="Collapse breadcrumb"
          >
            <span className="flex items-center justify-center">
              <X className="w-4 h-4" />
            </span>
          </Button>
        )}
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;