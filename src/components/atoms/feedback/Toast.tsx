import React, { forwardRef, useEffect, useRef } from 'react';
import { ToastProps } from '../../../types';
import { cn } from '../../../utils/utils';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { toastVariantClasses, toastIconClasses } from '../../../utils/tailwindClassMaps';
import Button from '../form/Button';

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

      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    };

    // Handle open event
    useEffect(() => {
      if (onOpen && typeof onOpen === 'function') {
        onOpen();
      }
    }, [onOpen]);

    // Use centralized variant and icon classes
    const variantColors = toastVariantClasses;
    const iconColors = toastIconClasses;


    // Get default icon
    const getDefaultIcon = () => {
      const iconClass = 'w-5 h-5';
      
      switch (variant) {
        case 'success':
          return <CheckCircle className={iconClass} />;
        case 'error':
          return <AlertCircle className={iconClass} />;
        case 'warning':
          return <AlertTriangle className={iconClass} />;
        case 'info':
        default:
          return <Info className={iconClass} />;
      }
    };

    // Toast classes with dark theme support
    const toastClasses = cn(
      'relative max-w-sm w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg dark:shadow-gray-900/20 p-4 font-work-sans',
      'transform transition-all duration-300 ease-in-out transition-colors duration-200',
      variantColors[variant],
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
            <Button
              variant="ghost"
              size="xs"
              onClick={handleClose}
              className="ml-3 flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10"
              aria-label="Close"
            >
              <X className="w-4 h-4 transition-colors duration-200" />
            </Button>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="mt-3 flex space-x-3">
            {actions}
          </div>
        )}

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