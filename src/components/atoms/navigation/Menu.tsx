import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { MenuProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Menu = forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      items,
      variant = 'default',
      trigger = 'hover',
      placement = 'bottom',
      showIcons = true,
      showShortcuts = true,
      closeOnClick = true,
      maxHeight = 300,
      onSelect,
      onOpen,
      onClose,
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
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [submenuPositions, setSubmenuPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    // Handle outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
            triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setOpenSubmenus(new Set());
          setHoveredItem(null);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Handle menu open/close
    const handleMenuToggle = (open: boolean) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (trigger === 'hover') {
        timeoutRef.current = setTimeout(() => {
          setIsOpen(open);
          if (!open) {
            setOpenSubmenus(new Set());
            setHoveredItem(null);
          }
        }, open ? 100 : 300);
      } else {
        setIsOpen(open);
        if (!open) {
          setOpenSubmenus(new Set());
          setHoveredItem(null);
        }
      }
      
      if (open && onOpen && typeof onOpen === 'function') {
        onOpen();
      } else if (!open && onClose && typeof onClose === 'function') {
        onClose();
      }
    };

    // Handle item select
    const handleItemSelect = (item: any) => {
      if (item.disabled || item.divider) return;

      // Audit trail logging
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Menu item select tracked:', {
          action: 'menu_item_select',
          itemId: item.id,
          label: item.label,
          href: item.href,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      if (onSelect && typeof onSelect === 'function') {
        onSelect(item);
      }

      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate(item);
      }

      if (closeOnClick && !item.submenu) {
        setIsOpen(false);
        setOpenSubmenus(new Set());
        setHoveredItem(null);
      }
    };

    // Calculate submenu position
    const calculateSubmenuPosition = useCallback((itemId: string) => {
      const itemElement = itemRefs.current.get(itemId);
      if (!itemElement) return { x: 0, y: 0 };

      const rect = itemElement.getBoundingClientRect();
      const menuRect = menuRef.current?.getBoundingClientRect();
      
      if (!menuRect) return { x: 0, y: 0 };

      return {
        x: menuRect.right + 2,
        y: rect.top
      };
    }, []);

    // Handle submenu toggle
    const handleSubmenuToggle = (itemId: string, open: boolean) => {
      if (open) {
        const position = calculateSubmenuPosition(itemId);
        setSubmenuPositions(prev => new Map(prev).set(itemId, position));
      }

      if (trigger === 'hover') {
        setHoveredItem(open ? itemId : null);
        setOpenSubmenus(prev => {
          const newSet = new Set(prev);
          if (open) {
            newSet.add(itemId);
          } else {
            newSet.delete(itemId);
          }
          return newSet;
        });
      } else {
        setOpenSubmenus(prev => {
          const newSet = new Set(prev);
          if (newSet.has(itemId)) {
            newSet.delete(itemId);
          } else {
            newSet.add(itemId);
            const position = calculateSubmenuPosition(itemId);
            setSubmenuPositions(prevPos => new Map(prevPos).set(itemId, position));
          }
          return newSet;
        });
      }
    };

    // Set item ref
    const setItemRef = (itemId: string, element: HTMLButtonElement | null) => {
      if (element) {
        itemRefs.current.set(itemId, element);
      } else {
        itemRefs.current.delete(itemId);
      }
    };

    // Variant classes
    const variantClasses = {
      default: 'bg-white border border-gray-200 rounded-lg shadow-lg',
      compact: 'bg-white border border-gray-200 rounded-md shadow-sm',
      sidebar: 'bg-white border-r border-gray-200 rounded-none shadow-none'
    };

    // Placement classes
    const placementClasses = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2',
      right: 'left-full ml-2'
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

    // Render menu item
    const renderMenuItem = (item: any, level = 0) => {
      if (item.divider) {
        return (
          <div key={item.id} className="border-t border-gray-200 my-1" />
        );
      }

      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isSubmenuOpen = openSubmenus.has(item.id);
      const isHovered = hoveredItem === item.id;

      return (
        <div key={item.id} className="relative">
          <button
            ref={(element) => setItemRef(item.id, element)}
            className={cn(
              'w-full flex items-center px-4 py-3 text-sm text-left transition-all duration-200 font-work-sans relative',
              item.disabled
                ? 'text-gray-400 cursor-not-allowed opacity-50'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 focus:outline-none',
              level > 0 && 'pl-8 py-2',
              isSubmenuOpen && 'bg-gray-50',
              'group'
            )}
            onClick={() => {
              if (hasSubmenu && trigger === 'click') {
                handleSubmenuToggle(item.id, !isSubmenuOpen);
              } else {
                handleItemSelect(item);
              }
            }}
            onMouseEnter={() => {
              if (hasSubmenu && trigger === 'hover') {
                handleSubmenuToggle(item.id, true);
              }
            }}
            onMouseLeave={() => {
              if (hasSubmenu && trigger === 'hover') {
                setTimeout(() => {
                  if (hoveredItem === item.id) {
                    handleSubmenuToggle(item.id, false);
                  }
                }, 150);
              }
            }}
            disabled={item.disabled}
            aria-haspopup={hasSubmenu}
            aria-expanded={hasSubmenu ? isSubmenuOpen : undefined}
          >
            {/* Icon */}
            {showIcons && item.icon && (
              <span className="mr-3 flex-shrink-0 w-4 h-4 text-gray-500 group-hover:text-gray-700">
                {item.icon}
              </span>
            )}

            {/* Label */}
            {item.label && (
              <span className="flex-1 truncate font-medium">
                {item.label}
              </span>
            )}

            {/* Badge */}
            {item.badge && (
              <span className="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full font-medium">
                {item.badge}
              </span>
            )}

            {/* Shortcut */}
            {showShortcuts && item.shortcut && (
              <span className="ml-2 text-xs text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                {item.shortcut}
              </span>
            )}

            {/* Submenu indicator */}
            {hasSubmenu && (
              <svg
                className={cn(
                  'ml-2 w-4 h-4 transition-transform duration-200 text-gray-400',
                  trigger === 'click' && isSubmenuOpen && 'transform rotate-90',
                  trigger === 'hover' && 'transform rotate-0'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>

          {/* Description */}
          {item.description && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          )}
        </div>
      );
    };

    // Render submenu (separate component for positioning)
    const renderSubmenu = (item: any, level = 0) => {
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isSubmenuOpen = openSubmenus.has(item.id);
      const position = submenuPositions.get(item.id) || { x: 0, y: 0 };

      if (!hasSubmenu || !isSubmenuOpen) return null;

      return (
        <div
          key={`submenu-${item.id}`}
          className={cn(
            'fixed z-[60] min-w-48 py-1 font-work-sans',
            variantClasses[variant],
            'animate-in fade-in slide-in-from-left-2 duration-200'
          )}
          style={{
            maxHeight: maxHeight ? `${maxHeight}px` : undefined,
            overflowY: maxHeight ? 'auto' : undefined,
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
          onMouseEnter={() => {
            if (trigger === 'hover') {
              setHoveredItem(item.id);
            }
          }}
          onMouseLeave={() => {
            if (trigger === 'hover') {
              setTimeout(() => {
                handleSubmenuToggle(item.id, false);
              }, 150);
            }
          }}
        >
          {item.submenu.map((subItem: any) => renderMenuItem(subItem, level + 1))}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className="relative inline-block"
        style={style}
        {...props}
      >
        {/* Trigger */}
        <div
          ref={triggerRef}
          onMouseEnter={() => trigger === 'hover' && handleMenuToggle(true)}
          onMouseLeave={() => trigger === 'hover' && handleMenuToggle(false)}
          onClick={() => trigger === 'click' && handleMenuToggle(!isOpen)}
          className={cn(
            'inline-block cursor-pointer',
            trigger === 'click' && 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md'
          )}
          tabIndex={trigger === 'click' ? 0 : -1}
          role="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          {children}
        </div>

        {/* Main Menu */}
        {isOpen && (
          <div
            ref={menuRef}
            className={cn(
              'absolute z-50 min-w-48 py-1 font-work-sans',
              variantClasses[variant],
              placementClasses[placement],
              commerceState && commerceStateClasses[commerceState] ? `ring-2 ${commerceStateClasses[commerceState]}` : '',
              'animate-in fade-in slide-in-from-top-2 duration-200',
              className
            )}
            style={{
              maxHeight: maxHeight ? `${maxHeight}px` : undefined,
              overflowY: maxHeight ? 'auto' : undefined
            }}
            onMouseEnter={() => trigger === 'hover' && handleMenuToggle(true)}
            onMouseLeave={() => trigger === 'hover' && handleMenuToggle(false)}
            role="menu"
            aria-orientation="vertical"
          >
            {items && items.map((item) => renderMenuItem(item))}
          </div>
        )}

        {/* Submenus (rendered separately as fixed positioned elements) */}
        {isOpen && items && items.map((item) => renderSubmenu(item))}

        {/* Commerce state indicator */}
        {/* {commerceState && commerceState !== 'initiation' && (
          <div className={cn(
            'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white z-10',
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

Menu.displayName = 'Menu';

export default Menu;