import React, { forwardRef, useEffect, useRef } from 'react';
import { ToastProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      id,
      title,
      description,
      variant = 'info',
      duration = 5000,
      persistent = false,
      closable = true,
      icon,
      actions,
      position = 'top-right',
      onClose,
      onOpen,
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
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle auto-close
    useEffect(() => {
      if (!persistent && duration > 0) {
        timeoutRef.current = setTimeout(() => {
          handleClose();
        }, duration);

        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }
    }, [duration, persistent]);

    // Handle close
    const handleClose = () => {
      // Audit trail logging
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Toast close tracked:', {
          action: 'toast_close',
          toastId: id,
          variant,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      if (onClose && typeof onClose === 'function') {
        onClose();
      }

      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate('toast_closed');
      }
    };

    // Handle open event
    useEffect(() => {
      if (onOpen && typeof onOpen === 'function') {
        onOpen();
      }
    }, [onOpen]);

    // Variant colors with dark theme support
    const variantColors = {
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100',
      success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-700 text-success-900 dark:text-success-100',
      warning: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-700 text-warning-900 dark:text-warning-100',
      error: 'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-700 text-error-900 dark:text-error-100'
    };

    // Icon colors with dark theme support
    const iconColors = {
      info: 'text-blue-500 dark:text-blue-400',
      success: 'text-success-500 dark:text-success-400',
      warning: 'text-warning-500 dark:text-warning-400',
      error: 'text-error-500 dark:text-error-400'
    };

    // Commerce state classes with dark theme support
    const commerceStateClasses = {
      initiation: 'ring-primary-300 dark:ring-primary-600',
      agreement: 'ring-warning-300 dark:ring-warning-600',
      execution: 'ring-primary-500 dark:ring-primary-400',
      settlement: 'ring-gray-400 dark:ring-gray-500',
      completion: 'ring-success-300 dark:ring-success-600',
      none: 'ring-0'
    };

    // Get default icon
    const getDefaultIcon = () => {
      const iconClass = 'w-5 h-5';
      
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

    // Toast classes with dark theme support
    const toastClasses = cn(
      'relative max-w-sm w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg dark:shadow-gray-900/20 p-4 font-work-sans',
      'transform transition-all duration-300 ease-in-out transition-colors duration-200',
      variantColors[variant],
      commerceState && commerceStateClasses[commerceState] ? `ring-2 ${commerceStateClasses[commerceState]}` : '',
      className
    );

    return (
      <div
        ref={ref}
        className={toastClasses}
        style={style}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        {...props}
      >
        <div className="flex items-start">
          {/* Icon */}
          <div className={cn('flex-shrink-0 mr-3', iconColors[variant])}>
            {icon || getDefaultIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <p className="text-sm font-medium mb-1 transition-colors duration-200">
                {title}
              </p>
            )}
            {description && (
              <p className="text-sm opacity-90 transition-colors duration-200">
                {description}
              </p>
            )}
            {children && (
              <div className="mt-2">
                {children}
              </div>
            )}
          </div>

          {/* Close button */}
          {closable && (
            <button
              type="button"
              onClick={handleClose}
              className="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-current transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="w-4 h-4 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="mt-3 flex space-x-3">
            {actions}
          </div>
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

        {/* Progress bar for duration */}
        {!persistent && duration > 0 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-10 rounded-b-lg overflow-hidden transition-colors duration-200">
            <div 
              className="h-full bg-current opacity-30 animate-pulse transition-colors duration-200"
              style={{
                animation: `toast-progress ${duration}ms linear forwards`
              }}
            />
          </div>
        )}

        {/* AI Config Display (development only) */}
        {process.env.NODE_ENV === 'development' && aiConfig && (
          <div className="absolute -top-8 left-0 p-1 bg-blue-50 dark:bg-blue-900/50 rounded text-xs text-blue-600 dark:text-blue-300 z-50 opacity-0 hover:opacity-100 transition-opacity transition-colors duration-200">
            AI Config: {JSON.stringify(aiConfig.layout || 'default')}
          </div>
        )}

        {/* CSS Animation */}
        <style>{`
          @keyframes toast-progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export default Toast;