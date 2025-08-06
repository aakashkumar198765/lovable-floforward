import React, { forwardRef } from 'react';
import { ButtonProps } from '../../../types';
import { cn } from '../../../utils/cn';
import { sizeClasses, variantClasses, stateClasses, focusClasses } from '../../../utils/tailwindClassMaps';
import { Loader2 } from 'lucide-react';

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
      className = '',
      style = {},
      onClick = () => {},
      onFocus = () => {},
      onBlur = () => {},
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Handle button clicks
    const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      if (onClick && typeof onClick === 'function') {
        onClick(event);
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



    // Build button classes
    const buttonClasses = cn(
      'inline-flex items-center justify-center gap-2 font-medium rounded-md border transition-all duration-200',
      'font-work-sans',
      focusClasses.ring.default,
      stateClasses.disabled.button,
      sizeClasses.button[size] || sizeClasses.button.md,
      variantClasses.button[variant] || variantClasses.button.primary,
      fullWidth && 'w-full',
      isDisabled && stateClasses.disabled.general,
      className || ''
    );

    // Loading spinner component
    const LoadingSpinner = () => (
      <Loader2 className="animate-spin h-4 w-4" />
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
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;