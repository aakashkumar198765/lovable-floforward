import React, { forwardRef } from 'react';
import { cn } from '../../../utils/utils';
import { FlexLayoutProps } from '../../../types';
import { flexGridLayoutClasses } from '../../../utils/tailwindClassMaps';

const FlexLayout = forwardRef<HTMLDivElement, FlexLayoutProps>(
  (
    {
      direction = 'row',
      wrap = 'nowrap',
      justify = 'start',
      align = 'start',
      alignContent,
      gap = 'md',
      inline = false,
      padding = 'xs',
      margin = 'none',
      fullWidth = false,
      fullHeight = false,
      background = 'none',
      border = 'none',
      rounded = 'md',
      shadow = 'none',
      className = '',
      style = {},
      children,
      childrenWidths,
      childrenHeights,
      ...props
    },
    ref
  ) => {
    // Direction classes
    const directionClasses = {
      'row': 'flex-row',
      'row-reverse': 'flex-row-reverse',
      'col': 'flex-col',
      'col-reverse': 'flex-col-reverse'
    };

    // Background classes
    const backgroundClasses = {
      'none': '',
      'white': 'bg-white',
      'gray': 'bg-gray-50',
      'primary': 'bg-primary-50',
      'secondary': 'bg-secondary-50'
    };

    // Border classes
    const borderClasses = {
      'none': '',
      'default': 'border border-gray-200',
      'dashed': 'border border-dashed border-gray-300',
      'dotted': 'border border-dotted border-gray-300'
    };

    // Helper function to handle custom values or predefined classes
    const getClassValue = (value: string, classMap: Record<string, string>): string => {
      return classMap[value] || value;
    };

    // Build component classes
    const componentClasses = cn(
      // Base flex classes
      inline ? 'inline-flex' : 'flex',
      
      // Layout classes
      directionClasses[direction],
      `flex-${wrap}`,
      `justify-${justify}`,
      `items-${align}`,
      alignContent ? `content-${alignContent}` : '',
      
      // Spacing classes
      `gap-${flexGridLayoutClasses.gapClasses[gap as keyof typeof flexGridLayoutClasses.gapClasses]}`,
      `p-${flexGridLayoutClasses.gapClasses[padding as keyof typeof flexGridLayoutClasses.gapClasses]}`,
      `m-${flexGridLayoutClasses.gapClasses[margin as keyof typeof flexGridLayoutClasses.gapClasses]}`,
      
      // Size classes
      fullWidth && 'w-full',
      fullHeight && 'h-full',
      
      // Visual classes
      getClassValue(background, backgroundClasses),
      getClassValue(border, borderClasses),
      `rounded-${rounded}`,
      shadow === 'none' ? '' : `shadow-${shadow}`,
      
      // Custom classes
      className
    );

    // Render children with width styles if childrenWidths is provided
    const renderChildren = () => {
      if ((childrenWidths && Array.isArray(childrenWidths)) || (childrenHeights && Array.isArray(childrenHeights))) {
        return React.Children.map(children, (child, index) => {
          const width = childrenWidths?.[index] || 'auto';
          const height = childrenHeights?.[index] || '100%';
          if (width) {
            return (
              <div style={{ width, height }}>
                {child}
              </div>
            );
          }
          return child;
        });
      }
      return children;
    };

    return (
      <div
        ref={ref}
        className={componentClasses}
        style={style}
        {...props}
      >
        {renderChildren()}
      </div>
    );
  }
);

FlexLayout.displayName = 'FlexLayout';

export default FlexLayout;