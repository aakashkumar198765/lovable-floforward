import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { MoreHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/utils';
import { FlexLayout } from './index';
import Button from '../form/Button';
import Menu from '../navigation/Menu';
import { NavbarItem, NavbarProps } from '../../../types';

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  (
    {
      items = [],
      activeItem,
      variant = 'default',
      size = 'md',
      orientation = 'horizontal',
      responsive = true,
      showOverflow = true,
      overflowTrigger = 'hover',
      className = '',
      style = {},
      onChange,
      onItemClick,
      ...props
    },
    ref
  ) => {
    const [visibleItems, setVisibleItems] = useState<NavbarItem[]>(items);
    const [overflowItems, setOverflowItems] = useState<NavbarItem[]>([]);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<Map<string, HTMLElement>>(new Map());

    // Size classes for navbar items
    const sizeClasses = {
      sm: {
        item: 'px-3 py-2 text-sm',
        icon: 'h-4 w-4',
        badge: 'px-2 py-0.5 text-xs'
      },
      md: {
        item: 'px-4 py-3 text-sm',
        icon: 'h-4 w-4',
        badge: 'px-2 py-1 text-xs'
      },
      lg: {
        item: 'px-6 py-4 text-base',
        icon: 'h-5 w-5',
        badge: 'px-3 py-1 text-sm'
      }
    };

    // Variant classes for navbar items
    const variantClasses = {
      default: {
        container: 'border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700',
        item: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800',
        active: 'text-blue-600 bg-blue-50 border-b-2 border-blue-600 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-400'
      },
      minimal: {
        container: 'bg-transparent',
        item: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
        active: 'text-blue-600 font-semibold dark:text-blue-400'
      },
      pills: {
        container: 'bg-gray-100 p-1 rounded-lg dark:bg-gray-800',
        item: 'text-gray-700 hover:text-gray-900 hover:bg-white rounded-md transition-all duration-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700',
        active: 'text-blue-600 bg-white shadow-sm font-medium rounded-md dark:text-blue-400 dark:bg-gray-700'
      }
    };

    // Calculate which items fit in the container
    const calculateVisibleItems = useCallback(() => {
      if (!responsive || !showOverflow || orientation === 'vertical') {
        setVisibleItems(items);
        setOverflowItems([]);
        return;
      }

      const container = containerRef.current;
      if (!container || items.length === 0) return;

      const containerWidth = container.offsetWidth;
      const overflowButtonWidth = 120; // Approximate width of overflow button
      let totalWidth = 0;
      let visibleCount = 0;

      for (let i = 0; i < items.length; i++) {
        const itemElement = itemsRef.current.get(items[i].id);
        if (!itemElement) continue;

        const itemWidth = itemElement.offsetWidth;
        
        // If this is the last item or adding this item plus overflow button exceeds width
        if (i === items.length - 1) {
          if (totalWidth + itemWidth <= containerWidth) {
            visibleCount = i + 1;
          }
          break;
        } else if (totalWidth + itemWidth + overflowButtonWidth > containerWidth) {
          break;
        }
        
        totalWidth += itemWidth;
        visibleCount = i + 1;
      }

      if (visibleCount < items.length) {
        setVisibleItems(items.slice(0, visibleCount));
        setOverflowItems(items.slice(visibleCount));
      } else {
        setVisibleItems(items);
        setOverflowItems([]);
      }
    }, [items, responsive, showOverflow, orientation]);

    // Handle resize
    useEffect(() => {
      if (!responsive) return;

      const handleResize = () => {
        calculateVisibleItems();
      };

      const resizeObserver = new ResizeObserver(handleResize);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      // Initial calculation after items are rendered
      const timer = setTimeout(calculateVisibleItems, 100);

      return () => {
        resizeObserver.disconnect();
        clearTimeout(timer);
      };
    }, [calculateVisibleItems, responsive]);

    // Handle item click
    const handleItemClick = (item: NavbarItem) => {
      if (item.disabled) return;

      if (item.onClick) {
        item.onClick();
      }

      if (onChange) {
        onChange(item.id);
      }

      if (onItemClick) {
        onItemClick(item);
      }
    };

    // Set item ref
    const setItemRef = (itemId: string, element: HTMLElement | null) => {
      if (element) {
        itemsRef.current.set(itemId, element);
      } else {
        itemsRef.current.delete(itemId);
      }
    };

    // Render navbar item
    const renderNavbarItem = (item: NavbarItem) => {
      const isActive = activeItem === item.id;
      const hasSubmenu = item.submenu && item.submenu.length > 0;

      if (hasSubmenu) {
        return (
          <Menu
            key={item.id}
            items={item.submenu?.map(subItem => ({
              id: subItem.id,
              label: subItem.label,
              icon: subItem.icon,
              disabled: subItem.disabled,
              onClick: () => handleItemClick(subItem)
            })) || []}
            trigger={overflowTrigger}
            onSelect={(selectedItem) => {
              const originalItem = item.submenu?.find(sub => sub.id === selectedItem.id);
              if (originalItem) {
                handleItemClick(originalItem);
              }
            }}
            className="inline-block"
          >
            <Button
              ref={(el) => setItemRef(item.id, el)}
              applyDefaultClasses={false}
              variant="ghost"
              className={cn(
                'relative transition-all duration-200 border-0 rounded-none font-medium',
                sizeClasses[size].item,
                variantClasses[variant].item,
                isActive && variantClasses[variant].active,
                item.disabled && 'opacity-50 cursor-not-allowed',
                'hover:shadow-none focus:ring-0'
              )}
              disabled={item.disabled}
              href={item.href}
              onClick={() => !hasSubmenu && handleItemClick(item)}
            >
              <FlexLayout
                direction="row"
                align="center"
                gap="sm"
                className="w-full"
                padding="none"
              >
                {item.icon && (
                  <span className={cn('flex-shrink-0', sizeClasses[size].icon)}>
                    {item.icon}
                  </span>
                )}
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    'bg-blue-100 text-blue-800 rounded-full font-semibold',
                    'dark:bg-blue-900 dark:text-blue-300',
                    sizeClasses[size].badge
                  )}>
                    {item.badge}
                  </span>
                )}
                {hasSubmenu && (
                  <ChevronDown className={cn(
                    'flex-shrink-0 transition-transform duration-200',
                    sizeClasses[size].icon,
                    'text-gray-400'
                  )} />
                )}
              </FlexLayout>
            </Button>
          </Menu>
        );
      }

      return (
        <Button
          key={item.id}
          ref={(el) => setItemRef(item.id, el)}
          applyDefaultClasses={false}
          variant="ghost"
          className={cn(
            'relative transition-all duration-200 border-0 rounded-none font-medium',
            sizeClasses[size].item,
            variantClasses[variant].item,
            isActive && variantClasses[variant].active,
            item.disabled && 'opacity-50 cursor-not-allowed',
            'hover:shadow-none focus:ring-0'
          )}
          disabled={item.disabled}
          href={item.href}
          onClick={() => handleItemClick(item)}
        >
          <FlexLayout
            direction="row"
            align="center"
            gap="sm"
            className="w-full"
          >
            {item.icon && (
              <span className={cn('flex-shrink-0', sizeClasses[size].icon)}>
                {item.icon}
              </span>
            )}
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span className={cn(
                'bg-blue-100 text-blue-800 rounded-full font-semibold',
                'dark:bg-blue-900 dark:text-blue-300',
                sizeClasses[size].badge
              )}>
                {item.badge}
              </span>
            )}
          </FlexLayout>
        </Button>
      );
    };

    // Container classes
    const containerClasses = cn(
      'w-full',
      variantClasses[variant].container,
      orientation === 'vertical' ? 'flex flex-col' : 'flex flex-row',
      className
    );

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        {...props}
      >
        <FlexLayout
          ref={containerRef}
          direction={orientation === 'vertical' ? 'col' : 'row'}
          align={orientation === 'vertical' ? 'start' : 'center'}
          justify="start"
          className="flex-1 overflow-hidden"
        >
          {/* Visible items */}
          {visibleItems.map(renderNavbarItem)}

          {/* Overflow menu */}
          {showOverflow && overflowItems.length > 0 && (
            <Menu
              items={overflowItems.map(item => ({
                id: item.id,
                label: item.label,
                icon: item.icon,
                disabled: item.disabled,
                submenu: item.submenu?.map(subItem => ({
                  id: subItem.id,
                  label: subItem.label,
                  icon: subItem.icon,
                  disabled: subItem.disabled
                })),
                onClick: () => handleItemClick(item)
              }))}
              trigger={overflowTrigger}
              onSelect={(selectedItem) => {
                const originalItem = overflowItems.find(item => item.id === selectedItem.id);
                if (originalItem) {
                  handleItemClick(originalItem);
                }
              }}
              className="inline-block"
            >
              <Button
                applyDefaultClasses={false}
                variant="ghost"
                className={cn(
                  'transition-all duration-200 border-0 rounded-none',
                  sizeClasses[size].item,
                  variantClasses[variant].item,
                  'hover:shadow-none focus:ring-0'
                )}
                aria-label="More options"
              >
                <MoreHorizontal className={sizeClasses[size].icon} />
              </Button>
            </Menu>
          )}
        </FlexLayout>
      </div>
    );
  }
);

Navbar.displayName = 'Navbar';

export default Navbar;