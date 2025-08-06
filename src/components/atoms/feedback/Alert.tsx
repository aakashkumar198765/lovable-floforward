import React, { forwardRef, useState } from 'react';
import { AlertProps } from '../../../types';
import { cn } from '../../../utils/utils';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { variantClasses } from '../../../utils/tailwindClassMaps';
import { Button } from '../form';

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
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(true);

    // Handle dismiss
    const handleDismiss = () => {

      setIsVisible(false);
      
      if (onDismiss && typeof onDismiss === 'function') {
        onDismiss();
      }
    };

    // Don't render if dismissed
    if (!isVisible) {
      return null;
    }

    // Severity classes
    const severityClasses = {
      low: 'opacity-80',
      medium: 'opacity-100',
      high: 'font-medium',
      critical: 'font-bold ring-2 ring-offset-2'
    };


    // Get default icon
    const getDefaultIcon = () => {
      const iconClass = 'w-5 h-5 flex-shrink-0';
      
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

    // Alert classes
    const alertClasses = cn(
      'relative p-4 font-work-sans transition-all duration-300 ease-in-out',
      banner ? 'rounded-none' : 'rounded-lg',
      bordered ? 'border' : 'border-0',
      variantClasses.alertVariantColors[variant].bg,
      variantClasses.alertVariantColors[variant].border,
      variantClasses.alertVariantColors[variant].text,
      severityClasses[severity],
      severity === 'critical' && `ring-${variant === 'error' ? 'red' : variant === 'warning' ? 'yellow' : variant === 'success' ? 'green' : 'blue'}-500`,
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
            <div className={cn('mr-3', variantClasses.alertVariantColors[variant].icon)}>
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
            <Button
              onClick={handleDismiss}
              className="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current transition-colors duration-200"
              aria-label="Dismiss"
              applyDefaultClasses={false}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Severity indicator */}
        {severity === 'critical' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-current opacity-50" />
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;