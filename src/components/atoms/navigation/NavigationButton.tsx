import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
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

      if (onClick && typeof onClick === 'function') {
        onClick(event);
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
      className
    );

    // Loading spinner
    const loadingSpinner = (
      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
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
      </button>
    );
  }
);

NavigationButton.displayName = 'NavigationButton';

export default NavigationButton;