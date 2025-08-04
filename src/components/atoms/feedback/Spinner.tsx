import React, { forwardRef } from 'react';
import { SpinnerProps } from '../../../types';
import { cn } from '../../../utils/cn';
import { Loader2 } from 'lucide-react';

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      color = 'primary',
      speed = 'normal',
      thickness = 4,
      label,
      overlay = false,
      centered = false,
      onUpdate,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };

    // Color classes
    const colorClasses = {
      primary: 'text-primary-600',
      secondary: 'text-gray-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      danger: 'text-error-600',
      muted: 'text-gray-400',
      white: 'text-white'
    };

    // Speed classes
    const speedClasses = {
      slow: 'animate-spin',
      normal: 'animate-spin',
      fast: 'animate-spin'
    };

    // Speed duration styles
    const speedDurations = {
      slow: '2s',
      normal: '1s',
      fast: '0.5s'
    };


    // Spinner classes
    const spinnerClasses = cn(
      'inline-block',
      sizeClasses[size],
      colorClasses[color],
      speedClasses[speed],
      centered && 'mx-auto',
      overlay && 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      className
    );

    // Container classes
    const containerClasses = cn(
      'relative',
      centered && 'flex justify-center items-center',
      overlay && 'absolute inset-0 bg-white bg-opacity-75 z-10',
    );

    // Spinner component using Lucide
    const spinnerComponent = (
      <Loader2
        className={spinnerClasses}
        style={{
          animationDuration: speedDurations[speed],
          strokeWidth: thickness,
          ...style
        }}
        {...props}
      />
    );

    return (
      <div
        ref={ref}
        className={containerClasses}
        role="status"
        aria-live="polite"
        aria-label={label || 'Loading...'}
      >
        {spinnerComponent}
        
        {/* Label */}
        {label && (
          <span className={cn(
            'ml-2 text-sm font-medium font-work-sans',
            colorClasses[color],
            overlay && 'block mt-2 ml-0'
          )}>
            {label}
          </span>
        )}

        {/* Screen reader text */}
        <span className="sr-only">
          {label || 'Loading...'}
        </span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;