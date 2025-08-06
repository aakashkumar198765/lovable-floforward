import React, { forwardRef } from 'react';
import { StatusProps } from '../../../types';
import { cn } from '../../../utils/cn';
import { CheckCircle, XCircle, Clock, Check, X, AlertTriangle, Circle } from 'lucide-react';
import { statusClasses } from '../../../utils/tailwindClassMaps';

const Status = forwardRef<HTMLDivElement, StatusProps>(
  (
    {
      status = 'active',
      variant = 'dot',
      size = 'md',
      label,
      description,
      showLabel = true,
      animated = false,
      icon,
      color,
      customColor,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      xs: {
        dot: 'w-2 h-2',
        badge: 'text-xs px-2 py-0.5',
        text: 'text-xs',
        icon: 'w-3 h-3'
      },
      sm: {
        dot: 'w-3 h-3',
        badge: 'text-sm px-2.5 py-0.5',
        text: 'text-sm',
        icon: 'w-4 h-4'
      },
      md: {
        dot: 'w-4 h-4',
        badge: 'text-sm px-3 py-1',
        text: 'text-base',
        icon: 'w-5 h-5'
      },
      lg: {
        dot: 'w-5 h-5',
        badge: 'text-base px-4 py-1.5',
        text: 'text-lg',
        icon: 'w-6 h-6'
      }
    };


    // Get status label
    const getStatusLabel = () => {
      if (label) return label;
      
      const defaultLabels = {
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        online: 'Online',
        offline: 'Offline',
        away: 'Away',
        busy: 'Busy'
      };
      
      return defaultLabels[status] || status;
    };

    // Get status icon
    const getStatusIcon = () => {
      if (icon) return icon;
      
      const defaultIcons = {
        active: <CheckCircle className="w-full h-full" />,
        inactive: <XCircle className="w-full h-full" />,
        pending: <Clock className="w-full h-full" />,
        success: <Check className="w-full h-full" />,
        error: <X className="w-full h-full" />,
        warning: <AlertTriangle className="w-full h-full" />,
        online: <Circle className="w-full h-full" fill="currentColor" />,
        offline: <Circle className="w-full h-full" fill="currentColor" />,
        away: <Circle className="w-full h-full" fill="currentColor" />,
        busy: <Circle className="w-full h-full" fill="currentColor" />
      };
      
      return defaultIcons[status] || defaultIcons.inactive;
    };


    // Render dot variant
    const renderDot = () => {
      const dotClasses = cn(
        'rounded-full inline-block',
        sizeClasses[size].dot,
        customColor ? '' : statusClasses.colorBgClasses[status],
        animated && 'animate-pulse',
        className
      );

      const dotStyles = customColor ? { backgroundColor: customColor } : {};

      return (
        <div className="inline-flex items-center gap-2">
          <div 
            className={dotClasses} 
            style={{ ...dotStyles, ...style }}
            aria-label={getStatusLabel()}
          />
          {showLabel && (
            <span className={cn('font-work-sans', sizeClasses[size].text, statusClasses.textColors[status])}>
              {getStatusLabel()}
            </span>
          )}
        </div>
      );
    };

    // Render badge variant
    const renderBadge = () => {
      const badgeClasses = cn(
        'inline-flex items-center rounded-full border font-medium font-work-sans',
        sizeClasses[size].badge,
        customColor ? '' : statusClasses.badgeColors[status],
        animated && 'animate-pulse',
        className
      );

      const badgeStyles = customColor ? { backgroundColor: customColor, color: 'white' } : {};

      return (
        <span 
          className={badgeClasses} 
          style={{ ...badgeStyles, ...style }}
          aria-label={getStatusLabel()}
        >
          {getStatusLabel()}
        </span>
      );
    };

    // Render text variant
    const renderText = () => {
      const textClasses = cn(
        'inline-flex items-center gap-1 font-medium font-work-sans',
        sizeClasses[size].text,
        customColor ? '' : statusClasses.textColors[status],
        animated && 'animate-pulse',
        className
      );

      const textStyles = customColor ? { color: customColor } : {};

      return (
        <span 
          className={textClasses} 
          style={{ ...textStyles, ...style }}
          aria-label={getStatusLabel()}
        >
          {getStatusLabel()}
        </span>
      );
    };

    // Render icon variant
    const renderIcon = () => {
      const iconClasses = cn(
        'inline-flex items-center gap-2',
        sizeClasses[size].icon,
        customColor ? '' : statusClasses.textColors[status],
        animated && 'animate-pulse',
        className
      );

      const iconStyles = customColor ? { color: customColor } : {};

      return (
        <div className="inline-flex items-center gap-2">
          <div 
            className={iconClasses} 
            style={{ ...iconStyles, ...style }}
            aria-label={getStatusLabel()}
          >
            {getStatusIcon()}
          </div>
          {showLabel && (
            <span className={cn('font-work-sans', sizeClasses[size].text, statusClasses.textColors[status])}>
              {getStatusLabel()}
            </span>
          )}
        </div>
      );
    };

    // Render appropriate variant
    const renderVariant = () => {
      switch (variant) {
        case 'badge':
          return renderBadge();
        case 'text':
          return renderText();
        case 'icon':
          return renderIcon();
        case 'dot':
        default:
          return renderDot();
      }
    };

    return (
      <div
        ref={ref}
        {...props}
        role="status"
        aria-live="polite"
        title={description}
      >
        {renderVariant()}
      </div>
    );
  }
);

Status.displayName = 'Status';

export default Status;