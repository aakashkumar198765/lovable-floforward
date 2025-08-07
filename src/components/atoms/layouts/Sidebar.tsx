import React, { forwardRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRightSubmenu, Menu as MenuIcon } from 'lucide-react';
import { cn } from '../../../utils/utils';
import { FlexLayout } from './index';
import Button from '../form/Button';
import Icon from '../display/Icon';
import Tooltip from '../display/Tooltip';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
  submenu?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  activeItem?: string;
  variant?: 'default' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right';
  fixed?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  showTooltips?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (itemId: string) => void;
  onItemClick?: (item: SidebarItem) => void;
  onToggle?: (collapsed: boolean) => void;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      items = [],
      activeItem,
      variant = 'default',
      size = 'md',
      position = 'left',
      fixed = true,
      collapsible = true,
      defaultCollapsed = false,
      width = 256,
      collapsedWidth = 64,
      showTooltips = true,
      className = '',
      style = {},
      onChange,
      onItemClick,
      onToggle,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

    // Size classes for sidebar items
    const sizeClasses = {
      sm: {
        item: 'px-3 py-2 text-xs h-9 leading-normal',
        icon: 'w-4 h-4',
        badge: 'px-1.5 py-0.5 text-xs min-w-[16px] h-4',
        toggle: 'p-1.5 w-8 h-8',
        submenu: 'pl-5'
      },
      md: {
        item: 'px-3 py-2.5 text-sm h-10 leading-normal',
        icon: 'w-5 h-5',
        badge: 'px-2 py-0.5 text-xs min-w-[18px] h-5',
        toggle: 'p-2 w-9 h-9',
        submenu: 'pl-6'
      },
      lg: {
        item: 'px-4 py-3 text-base h-12 leading-normal',
        icon: 'w-6 h-6',
        badge: 'px-2 py-1 text-sm min-w-[20px] h-6',
        toggle: 'p-2 w-10 h-10',
        submenu: 'pl-8'
      }
    };

    // Variant classes for sidebar
    const variantClasses = {
      default: {
        container: 'bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700',
        item: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700',
        active: 'text-blue-600 bg-blue-50 font-medium dark:text-blue-400 dark:bg-blue-950',
        toggle: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
      },
      dark: {
        container: 'bg-gray-900 border-r border-gray-800',
        item: 'text-gray-300 hover:text-white hover:bg-gray-800',
        active: 'text-blue-400 bg-blue-900 font-medium',
        toggle: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
      },
      light: {
        container: 'bg-gray-50 border-r border-gray-200',
        item: 'text-gray-600 hover:text-gray-900 hover:bg-white',
        active: 'text-blue-600 bg-white font-medium shadow-sm',
        toggle: 'text-gray-500 hover:text-gray-700 hover:bg-white'
      }
    };

    // Toggle collapsed state
    const handleToggle = useCallback(() => {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      if (onToggle) {
        onToggle(newCollapsed);
      }
    }, [isCollapsed, onToggle]);

    // Handle item click
    const handleItemClick = useCallback((item: SidebarItem) => {
      if (item.disabled) return;

      // Always call onChange to update active state
      if (onChange) {
        onChange(item.id);
      }

      if (item.onClick) {
        item.onClick();
      }

      if (onItemClick) {
        onItemClick(item);
      }
    }, [onChange, onItemClick]);

    // Toggle submenu
    const toggleSubmenu = useCallback((itemId: string) => {
      setOpenSubmenus(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    }, []);

    // Render sidebar item
    const renderSidebarItem = (item: SidebarItem, level = 0) => {
      const isActive = activeItem === item.id;
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isSubmenuOpen = openSubmenus.has(item.id);

      const itemButton = (
        <div className="w-full">
          <Button
            key={item.id}
            applyDefaultClasses={false}
            variant="ghost"
            className={cn(
              'w-full flex items-center justify-start transition-all duration-200 border-0 rounded-md font-medium mb-0.5',
              sizeClasses[size].item,
              variantClasses[variant].item,
              isActive && variantClasses[variant].active,
              item.disabled && 'opacity-50 cursor-not-allowed',
              level > 0 && sizeClasses[size].submenu,
              level > 0 && 'text-xs opacity-90',
              'hover:shadow-none focus:ring-1 focus:ring-blue-500'
            )}
            disabled={item.disabled}
            href={item.href}
            onClick={() => {
              if (hasSubmenu) {
                toggleSubmenu(item.id);
              } else {
                handleItemClick(item);
              }
            }}
          >
            <div className="flex items-center w-full">
              {/* Left side: Icon + Label */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Icon */}
                {item.icon && (
                  <div className={cn(
                    'flex items-center justify-center flex-shrink-0',
                    sizeClasses[size].icon
                  )}>
                    {item.icon}
                  </div>
                )}

                {/* Label - hidden when collapsed unless it's a submenu item */}
                {(!isCollapsed || level > 0) && (
                  <span className="truncate text-left font-medium">{item.label}</span>
                )}
              </div>

              {/* Right side: Badge + Submenu indicator - Always show for alignment */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                {/* Badge */}
                {(!isCollapsed || level > 0) && item.badge && (
                  <span className={cn(
                    'bg-blue-100 text-blue-800 rounded-full font-semibold flex items-center justify-center',
                    'dark:bg-blue-900 dark:text-blue-300',
                    sizeClasses[size].badge
                  )}>
                    {item.badge}
                  </span>
                )}

                {/* Submenu indicator */}
                {(!isCollapsed || level > 0) && hasSubmenu && (
                  <div className={cn(
                    'flex items-center justify-center flex-shrink-0 transition-transform duration-200',
                    sizeClasses[size].icon
                  )}>
                    <ChevronRightSubmenu 
                      className={cn(
                        'transition-transform duration-200',
                        sizeClasses[size].icon,
                        isSubmenuOpen && 'rotate-90'
                      )} 
                    />
                  </div>
                )}
              </div>
            </div>
          </Button>
        </div>
      );

      // Wrap with tooltip when collapsed and at root level
      const wrappedItem = (isCollapsed && level === 0 && showTooltips) ? (
        <Tooltip key={item.id} content={item.label} placement="right">
          {itemButton}
        </Tooltip>
      ) : itemButton;

      return (
        <div key={item.id} className="w-full">
          {wrappedItem}
          
          {/* Submenu items - accordion style */}
          {hasSubmenu && isSubmenuOpen && (!isCollapsed || level > 0) && (
            <div className={cn(
              'overflow-hidden transition-all duration-200 mt-1 mb-2',
              'border-l-2 border-gray-200 dark:border-gray-600',
              level === 0 ? 'ml-4' : 'ml-2'
            )}>
              <div className="space-y-0.5 py-1">
                {item.submenu?.map(subItem => renderSidebarItem(subItem, level + 1))}
              </div>
            </div>
          )}
        </div>
      );
    };

    // Calculate width
    const currentWidth = isCollapsed ? collapsedWidth : width;

    // Container styles
    const containerStyles = {
      width: `${currentWidth}px`,
      ...style
    };

    // Container classes
    const containerClasses = cn(
      'h-full transition-all duration-300 ease-in-out flex flex-col',
      fixed && 'fixed top-0 bottom-0 z-40',
      position === 'left' ? 'left-0' : 'right-0',
      variantClasses[variant].container,
      className
    );

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={containerStyles}
        {...props}
      >
        {/* Header with collapse/expand toggle */}
        {collapsible && (
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-3 py-3 flex-shrink-0">
            {!isCollapsed && (
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Menu
              </span>
            )}
            <Button
              applyDefaultClasses={false}
              variant="ghost"
              className={cn(
                'transition-all duration-200 border-0 rounded-lg flex items-center justify-center',
                sizeClasses[size].toggle,
                variantClasses[variant].toggle,
                'hover:shadow-none focus:ring-1 focus:ring-blue-500',
                isCollapsed ? 'mx-auto' : ''
              )}
              onClick={handleToggle}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <MenuIcon className={sizeClasses[size].icon} />
              ) : (
                position === 'left' ? <ChevronLeft className={sizeClasses[size].icon} /> : <ChevronRight className={sizeClasses[size].icon} />
              )}
            </Button>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-2 py-3 space-y-1">
            {items.map(item => renderSidebarItem(item))}
          </div>
        </div>
      </div>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;