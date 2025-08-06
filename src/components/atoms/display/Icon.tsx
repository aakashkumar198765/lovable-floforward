import React, { forwardRef } from 'react';
import { IconProps } from '../../../types';
import { cn, iconMap } from '../../../utils/utils';
import * as LucideIcons from 'lucide-react';

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      name,
      size = 'md',
      color,
      children,
      title,
      decorative = false,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    // Handle size as number or string
    const getSizeClasses = () => {
      if (typeof size === 'number') {
        return '';
      }
      
      const sizeClasses = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8'
      };
      
      return sizeClasses[size] || sizeClasses.md;
    };

    // Handle custom size styles
    const getSizeStyles = () => {
      if (typeof size === 'number') {
        return {
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${size}px`
        };
      }
      return {};
    };

    // Build icon classes
    const iconClasses = cn(
      'inline-flex items-center justify-center flex-shrink-0',
      'font-work-sans',
      getSizeClasses(),
      className || ''
    );

    // Build styles
    const iconStyles = {
      ...getSizeStyles(),
      color: color || undefined,
      ...style
    };

    // Lucide icon mapping for backward compatibility
    const getLucideIcon = (iconName: string) => {
      const lucideIconName = iconMap[iconName];
      if (lucideIconName && LucideIcons[lucideIconName]) {
        const IconComponent = LucideIcons[lucideIconName] as React.ComponentType<any>;
        return <IconComponent />;
      }
      
      return null;
    };

    // Render icon content
    const renderIcon = () => {
      // If children provided, use them
      if (children) {
        return children;
      }

      // If name provided, try to get Lucide icon
      if (name && name !== '') {
        const lucideIcon = getLucideIcon(name);
        if (lucideIcon) {
          return lucideIcon;
        }
        
        // Fallback to text icon
        return <span>{name}</span>;
      }

      // Fallback to generic icon
      const AlertCircle = LucideIcons.AlertCircle as React.ComponentType<any>;
      return <AlertCircle />;
    };

    return (
      <span
        ref={ref}
        className={iconClasses}
        style={iconStyles}
        title={title}
        role={decorative ? 'presentation' : 'img'}
        aria-hidden={decorative}
        aria-label={!decorative && title ? title : undefined}
        {...props}
      >
        {renderIcon()}
      </span>
    );
  }
);

Icon.displayName = 'Icon';

export default Icon;