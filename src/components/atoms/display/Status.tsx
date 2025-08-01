import React, { forwardRef } from 'react';
import { StatusProps } from '../../../types';
import { cn } from '../../../utils/cn';

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
    // Status color mapping
    const statusColors = {
      active: 'bg-success-500',
      inactive: 'bg-gray-400',
      pending: 'bg-warning-500',
      success: 'bg-success-500',
      error: 'bg-error-500',
      warning: 'bg-warning-500',
      online: 'bg-success-500',
      offline: 'bg-gray-400',
      away: 'bg-warning-500',
      busy: 'bg-error-500'
    };

    // Text color mapping
    const textColors = {
      active: 'text-success-600',
      inactive: 'text-gray-500',
      pending: 'text-warning-600',
      success: 'text-success-600',
      error: 'text-error-600',
      warning: 'text-warning-600',
      online: 'text-success-600',
      offline: 'text-gray-500',
      away: 'text-warning-600',
      busy: 'text-error-600'
    };

    // Badge color mapping
    const badgeColors = {
      active: 'bg-success-100 text-success-800 border-success-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-warning-100 text-warning-800 border-warning-200',
      success: 'bg-success-100 text-success-800 border-success-200',
      error: 'bg-error-100 text-error-800 border-error-200',
      warning: 'bg-warning-100 text-warning-800 border-warning-200',
      online: 'bg-success-100 text-success-800 border-success-200',
      offline: 'bg-gray-100 text-gray-800 border-gray-200',
      away: 'bg-warning-100 text-warning-800 border-warning-200',
      busy: 'bg-error-100 text-error-800 border-error-200'
    };

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

    // Commerce state classes
    const commerceStateClasses = {
      initiation: 'ring-primary-300',
      agreement: 'ring-warning-300',
      execution: 'ring-primary-500',
      settlement: 'ring-gray-400',
      completion: 'ring-success-300',
      none: 'ring-0'
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
        active: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        inactive: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        pending: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        success: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
        error: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
        warning: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
        online: (
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="8" />
          </svg>
        ),
        offline: (
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="8" />
          </svg>
        ),
        away: (
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="8" />
          </svg>
        ),
        busy: (
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="8" />
          </svg>
        )
      };
      
      return defaultIcons[status] || defaultIcons.inactive;
    };

    // Handle audit trail
    const handleStatusUpdate = (newStatus: string) => {
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Status update tracked:', {
          action: 'status_update',
          oldStatus: status,
          newStatus,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate(newStatus);
      }
    };

    // Render dot variant
    const renderDot = () => {
      const dotClasses = cn(
        'rounded-full inline-block',
        sizeClasses[size].dot,
        customColor ? '' : statusColors[status],
        animated && 'animate-pulse',
        commerceState && commerceStateClasses[commerceState] ? `ring-2 ${commerceStateClasses[commerceState]}` : '',
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
            <span className={cn('font-work-sans', sizeClasses[size].text, textColors[status])}>
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
        customColor ? '' : badgeColors[status],
        animated && 'animate-pulse',
        commerceState && commerceStateClasses[commerceState] ? `ring-2 ${commerceStateClasses[commerceState]}` : '',
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
        customColor ? '' : textColors[status],
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
        customColor ? '' : textColors[status],
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
            <span className={cn('font-work-sans', sizeClasses[size].text, textColors[status])}>
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
        
        {/* Commerce state indicator */}
        {commerceState && commerceState !== 'initiation' && variant === 'dot' && (
          <div className={cn(
            'absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white',
            commerceState === 'agreement' && 'bg-warning-500',
            commerceState === 'execution' && 'bg-primary-600',
            commerceState === 'settlement' && 'bg-gray-500',
            commerceState === 'completion' && 'bg-success-500'
          )} />
        )}

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

Status.displayName = 'Status';

export default Status;