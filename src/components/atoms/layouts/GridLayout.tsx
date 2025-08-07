import React, { forwardRef } from 'react';
import { cn } from '../../../utils/utils';
import { GridLayoutProps } from '../../../types';
import { flexGridLayoutClasses } from '../../../utils/tailwindClassMaps';

const GridLayout = forwardRef<HTMLDivElement, GridLayoutProps>(
  (
    {
      cols = 1,
      rows,
      gap = 'md',
      gapX,
      gapY,
      flow = 'row',
      autoCols,
      autoRows,
      justifyItems = 'stretch',
      alignItems = 'stretch',
      justifyContent,
      alignContent,
      padding = 'md',
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
      ...props
    },
    ref
  ) => {
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
    const getClassValue = (value: string | number, classMap: Record<string | number, string>): string => {
      return classMap[value] || String(value);
    };

    const componentClasses = cn(
      // Base grid class
      'grid',
      
      // Layout classes
      cols ? `grid-cols-${cols}` : '',
      rows ? `grid-rows-${rows}` : '',
      `grid-flow-${flow}`,
      
      // Gap classes - prioritize specific gap over general gap
      gapX ? `gap-x-${flexGridLayoutClasses.gapClasses[gapX as keyof typeof flexGridLayoutClasses.gapClasses]}` : '',
      gapY ? `gap-y-${flexGridLayoutClasses.gapClasses[gapY as keyof typeof flexGridLayoutClasses.gapClasses]}` : '',
      (!gapX && !gapY) ? `gap-${flexGridLayoutClasses.gapClasses[gap as keyof typeof flexGridLayoutClasses.gapClasses]}` : '',
      
      // Auto sizing classes
      autoCols ? `auto-cols-${autoCols}` : '',
      autoRows ? `auto-rows-${autoRows}` : '',
      
      // Alignment classes
      `justify-items-${justifyItems}`,
      `items-${alignItems}`,
      justifyContent ? `justify-${justifyContent}` : '',
      alignContent ? `content-${alignContent}` : '',
      
      // Spacing classes
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

    return (
      <div
        ref={ref}
        className={componentClasses}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridLayout.displayName = 'GridLayout';

export default GridLayout;