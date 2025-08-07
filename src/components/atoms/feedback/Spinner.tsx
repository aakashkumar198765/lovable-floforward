import React, { forwardRef } from 'react';
import { SpinnerProps } from '../../../types';
import { cn } from '../../../utils/utils';
import { Loader2 } from 'lucide-react';
import { animationClasses, colorClasses, spinnerSizeClasses } from '../../../utils/tailwindClassMaps';
import { Label } from '../display';

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
    // Spinner classes
    const spinnerClasses = cn(
      'inline-block',
      spinnerSizeClasses[size],
      colorClasses[color],
      animationClasses.loading[speed],
      centered && 'mx-auto',
      overlay && 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      className
    );

    // Container classes
    const containerClasses = cn(
      'relative flex justify-center items-center',
      overlay && 'absolute inset-0 bg-white bg-opacity-75 z-10',
    );

    // Spinner component using Lucide
    const spinnerComponent = (
      <Loader2
        className={spinnerClasses}
        style={{
          animationDuration: animationClasses.speedDurations[speed],
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
          <Label
            className={cn(
              'flex ml-2 text-sm font-medium font-work-sans',
              colorClasses[color],
              overlay && 'block mt-2 ml-0'
            )}
          >
            {label}
          </Label>
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