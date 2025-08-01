import React, { forwardRef, useState } from 'react';
import { AlertProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      children,
      variant = 'info',
      severity = 'medium',
      title,
      description,
      dismissible = false,
      icon,
      actions,
      banner = false,
      bordered = true,
      showIcon = true,
      onDismiss,
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
    const [isVisible, setIsVisible] = useState(true);

    // Handle dismiss
    const handleDismiss = () => {
      // Audit trail logging
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Alert dismiss tracked:', {
          action: 'alert_dismiss',
          variant,
          severity,
          title,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      setIsVisible(false);
      
      if (onDismiss && typeof onDismiss === 'function') {
        onDismiss();
      }

      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate('alert_dismissed');
      }
    };

    // Don't render if dismissed
    if (!isVisible) {
      return null;
    }

    // Variant colors with dark theme support
    const variantColors = {
      info: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-700',
        text: 'text-blue-900 dark:text-blue-200',
        icon: 'text-blue-500 dark:text-blue-400'
      },
      success: {
        bg: 'bg-success-50 dark:bg-success-900/20',
        border: 'border-success-200 dark:border-success-700',
        text: 'text-success-900 dark:text-success-200',
        icon: 'text-success-500 dark:text-success-400'
      },
      warning: {
        bg: 'bg-warning-50 dark:bg-warning-900/20',
        border: 'border-warning-200 dark:border-warning-700',
        text: 'text-warning-900 dark:text-warning-200',
        icon: 'text-warning-500 dark:text-warning-400'
      },
      error: {
        bg: 'bg-error-50 dark:bg-error-900/20',
        border: 'border-error-200 dark:border-error-700',
        text: 'text-error-900 dark:text-error-200',
        icon: 'text-error-500 dark:text-error-400'
      }
    };

    // Severity classes
    const severityClasses = {
      low: 'opacity-80',
      medium: 'opacity-100',
      high: 'font-medium',
      critical: 'font-bold ring-2 ring-offset-2'
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

    // Get default icon
    const getDefaultIcon = () => {
      const iconClass = 'w-5 h-5 flex-shrink-0';
      
      switch (variant) {
        case 'success':
          return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'error':
          return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'warning':
          return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          );
        case 'info':
        default:
          return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
      }
    };

    // Alert classes
    const alertClasses = cn(
      'relative p-4 font-work-sans transition-all duration-300 ease-in-out',
      banner ? 'rounded-none' : 'rounded-lg',
      bordered ? 'border' : 'border-0',
      variantColors[variant].bg,
      variantColors[variant].border,
      variantColors[variant].text,
      severityClasses[severity],
      severity === 'critical' && `ring-${variant === 'error' ? 'red' : variant === 'warning' ? 'yellow' : variant === 'success' ? 'green' : 'blue'}-500`,
      commerceState && commerceStateClasses[commerceState] ? `ring-2 ${commerceStateClasses[commerceState]}` : '',
      className
    );

    return (
      <div
        ref={ref}
        className={alertClasses}
        style={style}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className="flex items-start">
          {/* Icon */}
          {showIcon && (
            <div className={cn('mr-3', variantColors[variant].icon)}>
              {icon || getDefaultIcon()}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-sm font-medium mb-1">
                {title}
              </h3>
            )}
            
            {description && (
              <p className="text-sm mb-2">
                {description}
              </p>
            )}

            {children && (
              <div className="text-sm">
                {children}
              </div>
            )}

            {/* Actions */}
            {actions && (
              <div className="mt-3 flex space-x-3">
                {actions}
              </div>
            )}
          </div>

          {/* Dismiss button */}
          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              className="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current transition-colors duration-200"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Severity indicator */}
        {severity === 'critical' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-current opacity-50" />
        )}

        {/* Commerce state indicator */}
        {/* {commerceState && commerceState !== 'initiation' && (
          <div className={cn(
            'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
            commerceState === 'agreement' && 'bg-warning-500',
            commerceState === 'execution' && 'bg-primary-600',
            commerceState === 'settlement' && 'bg-gray-500',
            commerceState === 'completion' && 'bg-success-500'
          )} />
        )} */}

        {/* AI Config Display (development only) */}
        {process.env.NODE_ENV === 'development' && aiConfig && (
          <div className="absolute -top-8 left-0 p-1 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-600 dark:text-blue-400 z-50 opacity-0 hover:opacity-100 transition-opacity">
            AI Config: {JSON.stringify(aiConfig.layout || 'default')}
          </div>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;