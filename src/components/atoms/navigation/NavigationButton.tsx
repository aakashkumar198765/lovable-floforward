import React, { forwardRef } from 'react';
import { NavigationButtonProps } from '../../../types';
import { cn } from '../../../utils/cn';

const NavigationButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, NavigationButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      active = false,
      href,
      target,
      rel,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      onClick,
      onFocus,
      onBlur,
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
    // Handle click events
    const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (disabled || loading) {
        event.preventDefault();
        return;
      }

      // Audit trail logging
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Navigation button click tracked:', {
          action: 'navigation_button_click',
          variant,
          href,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      if (onClick && typeof onClick === 'function') {
        onClick(event);
      }

      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate('navigation_button_clicked');
      }
    };

    // Size classes
    const sizeClasses = {
      xs: 'h-6 px-2 text-xs',
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
      xl: 'h-14 px-8 text-xl'
    };

    // Variant classes
    const variantClasses = {
      primary: {
        base: 'bg-primary-600 text-white border-transparent hover:bg-primary-700 focus:ring-primary-500',
        active: 'bg-primary-700',
        disabled: 'bg-primary-300 cursor-not-allowed'
      },
      secondary: {
        base: 'bg-gray-600 text-white border-transparent hover:bg-gray-700 focus:ring-gray-500',
        active: 'bg-gray-700',
        disabled: 'bg-gray-300 cursor-not-allowed'
      },
      ghost: {
        base: 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100 focus:ring-gray-500',
        active: 'bg-gray-100',
        disabled: 'text-gray-400 cursor-not-allowed'
      },
      link: {
        base: 'bg-transparent text-primary-600 border-transparent hover:text-primary-700 hover:underline focus:ring-primary-500',
        active: 'text-primary-700 underline',
        disabled: 'text-primary-300 cursor-not-allowed'
      },
      text: {
        base: 'bg-transparent text-gray-700 border-transparent hover:text-gray-900 focus:ring-gray-500',
        active: 'text-gray-900',
        disabled: 'text-gray-400 cursor-not-allowed'
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

    // Build button classes
    const buttonClasses = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 font-work-sans',
      sizeClasses[size],
      disabled || loading
        ? variantClasses[variant].disabled
        : active
        ? variantClasses[variant].active
        : variantClasses[variant].base,
      variant !== 'link' && variant !== 'text' && 'border rounded-md',
      fullWidth && 'w-full',
      loading && 'cursor-wait',
      commerceState && commerceStateClasses[commerceState] ? `ring-2 ${commerceStateClasses[commerceState]}` : '',
      className
    );

    // Loading spinner
    const loadingSpinner = (
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );

    // Render icon
    const renderIcon = () => {
      if (loading) return loadingSpinner;
      if (!icon) return null;
      
      return (
        <span className={cn(
          'flex-shrink-0',
          children && iconPosition === 'left' && 'mr-2',
          children && iconPosition === 'right' && 'ml-2'
        )}>
          {icon}
        </span>
      );
    };

    // Common props
    const commonProps = {
      className: buttonClasses,
      style,
      onClick: handleClick,
      onFocus,
      onBlur,
      disabled: disabled || loading,
      'aria-pressed': active,
      'aria-disabled': disabled || loading,
      ...props
    };

    // Render as anchor if href is provided
    if (href && !disabled && !loading) {
      return (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          {...commonProps}
        >
          {iconPosition === 'left' && renderIcon()}
          {children}
          {iconPosition === 'right' && renderIcon()}
          
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
            <div className="absolute -top-8 left-0 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
              AI Config: {JSON.stringify(aiConfig.layout || 'default')}
            </div>
          )}
        </a>
      );
    }

    // Render as button
    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type="button"
        {...commonProps}
      >
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
        
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
          <div className="absolute -top-8 left-0 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
            AI Config: {JSON.stringify(aiConfig.layout || 'default')}
          </div>
        )}
      </button>
    );
  }
);

NavigationButton.displayName = 'NavigationButton';

export default NavigationButton;