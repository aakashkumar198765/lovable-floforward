import React, { forwardRef } from 'react';
import { ButtonProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children = 'Submit',
      type = 'button',
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      iconLeft,
      iconRight,
      href,
      target,
      rel,
      commerceState = 'none',
      workflowContext,
      aiConfig,
      schema,
      allowedActions = [],
      userRole,
      data,
      onUpdate = () => {},
      auditTrail = { enabled: false, level: 'basic', trackChanges: false, logUserActions: false },
      encryptionLevel = 'none',
      className = '',
      style = {},
      onClick = () => {},
      onFocus = () => {},
      onBlur = () => {},
      ...props
    },
    ref
  ) => {
    // Handle commerce state based behavior
    const isDisabled = disabled || loading || (commerceState === 'completion') || 
      (commerceState === 'settlement' && allowedActions && Array.isArray(allowedActions) && !allowedActions.includes('edit'));

    // Handle button clicks with audit trail
    const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      // Audit trail logging
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Button click tracked:', {
          action: 'button_click',
          variant,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      // Call external onClick
      if (onClick && typeof onClick === 'function') {
        onClick(event);
      }

      // Call update callback for enterprise integration
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate('button_clicked');
      }
    };

    // Handle focus events
    const handleFocus = (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (onFocus && typeof onFocus === 'function') {
        onFocus(event);
      }
    };

    // Handle blur events
    const handleBlur = (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (onBlur && typeof onBlur === 'function') {
        onBlur(event);
      }
    };

    // Size classes
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs min-h-[24px]',
      sm: 'px-3 py-1.5 text-sm min-h-[32px]',
      md: 'px-4 py-2 text-base min-h-[40px]',
      lg: 'px-6 py-3 text-lg min-h-[48px]',
      xl: 'px-8 py-4 text-xl min-h-[56px]'
    };

    // Variant classes with dark theme support
    const variantClasses = {
      primary: 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-gray-500',
      tertiary: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-gray-500',
      outline: 'bg-transparent text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 focus:ring-primary-500',
      'outline-danger': 'bg-transparent text-error-600 dark:text-error-400 border-error-600 dark:border-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 hover:text-error-700 dark:hover:text-error-300 focus:ring-error-500',
      'outline-success': 'bg-transparent text-success-600 dark:text-success-400 border-success-600 dark:border-success-400 hover:bg-success-50 dark:hover:bg-success-900/20 hover:text-success-700 dark:hover:text-success-300 focus:ring-success-500',
      'outline-warning': 'bg-transparent text-warning-600 dark:text-warning-400 border-warning-600 dark:border-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900/20 hover:text-warning-700 dark:hover:text-warning-300 focus:ring-warning-500',
      danger: 'bg-error-600 text-white border-error-600 hover:bg-error-700 hover:border-error-700 focus:ring-error-500',
      success: 'bg-success-600 text-white border-success-600 hover:bg-success-700 hover:border-success-700 focus:ring-success-500',
      warning: 'bg-warning-600 text-white border-warning-600 hover:bg-warning-700 hover:border-warning-700 focus:ring-warning-500',
      ghost: 'bg-transparent text-gray-700 dark:text-gray-200 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 focus:ring-gray-500',
      link: 'bg-transparent text-primary-600 dark:text-primary-400 border-transparent hover:text-primary-700 dark:hover:text-primary-300 hover:underline focus:ring-primary-500 p-0 min-h-auto'
    };

    // Commerce state classes with dark theme support
    const commerceStateClasses = {
      initiation: 'border-primary-300 dark:border-primary-600',
      agreement: 'border-warning-300 dark:border-warning-600',
      execution: 'border-primary-500 dark:border-primary-400',
      settlement: 'border-gray-400 dark:border-gray-500',
      completion: 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
      none: 'ring-0'
    };

    // Build button classes
    const buttonClasses = cn(
      'inline-flex items-center justify-center gap-2 font-medium rounded-md border transition-all duration-200',
      'font-work-sans',
      'focus:outline-none focus:ring-2 focus:ring-opacity-50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[size] || sizeClasses.md,
      variantClasses[variant] || variantClasses.primary,
      commerceState && commerceStateClasses[commerceState] ? commerceStateClasses[commerceState] : '',
      fullWidth && 'w-full',
      isDisabled && 'cursor-not-allowed opacity-50',
      className || ''
    );

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg 
        className="animate-spin h-4 w-4" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // If href is provided, render as link
    if (href && href !== '') {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={isDisabled ? undefined : href}
          target={target}
          rel={rel}
          className={buttonClasses}
          style={style}
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : 0}
          {...props}
        >
          {loading && <LoadingSpinner />}
          {!loading && iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
          
          {children && (
            <span className={cn('truncate', loading && 'opacity-70')}>
              {children}
            </span>
          )}
          
          {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        </a>
      );
    }

    // Render as button
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={isDisabled}
        className={buttonClasses}
        style={style}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
        
        {children && (
          <span className={cn('truncate', loading && 'opacity-70')}>
            {children}
          </span>
        )}
        
        {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        
        {/* Commerce state indicator */}
        {commerceState && commerceState !== 'initiation' && (
          <span className={cn(
            'ml-1 w-1.5 h-1.5 rounded-full flex-shrink-0',
            commerceState === 'agreement' && 'bg-warning-500',
            commerceState === 'execution' && 'bg-primary-600',
            commerceState === 'settlement' && 'bg-gray-500',
            commerceState === 'completion' && 'bg-success-500'
          )} />
        )}

        {/* AI Config Display (development only) */}
        {process.env.NODE_ENV === 'development' && aiConfig && (
          <div className="absolute -top-8 left-0 p-1 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-600 dark:text-blue-400 z-50 opacity-0 hover:opacity-100 transition-opacity">
            AI: {JSON.stringify(aiConfig.layout)}
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;