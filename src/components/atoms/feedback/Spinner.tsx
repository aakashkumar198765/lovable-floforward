import React, { forwardRef } from 'react';
import { SpinnerProps } from '../../../types';
import { cn } from '../../../utils/cn';

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

    // Commerce state classes
    const commerceStateClasses = {
      initiation: 'ring-primary-300',
      agreement: 'ring-warning-300',
      execution: 'ring-primary-500',
      settlement: 'ring-gray-400',
      completion: 'ring-success-300',
      none: 'ring-0'
    };

    // Spinner classes
    const spinnerClasses = cn(
      'inline-block',
      sizeClasses[size],
      colorClasses[color],
      speedClasses[speed],
      centered && 'mx-auto',
      overlay && 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      commerceState && commerceStateClasses[commerceState] ? `ring-2 ${commerceStateClasses[commerceState]} rounded-full` : '',
      className
    );

    // Container classes
    const containerClasses = cn(
      'relative',
      centered && 'flex justify-center items-center',
      overlay && 'absolute inset-0 bg-white bg-opacity-75 z-10',
    );

    // Spinner SVG
    const spinnerSVG = (
      <svg
        className={spinnerClasses}
        style={{
          animationDuration: speedDurations[speed],
          strokeWidth: thickness,
          ...style
        }}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={thickness}
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // Handle audit trail
    React.useEffect(() => {
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Spinner render tracked:', {
          action: 'spinner_render',
          size,
          color,
          speed,
          label,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }
    }, [auditTrail, size, color, speed, label, commerceState, workflowContext, userRole]);

    return (
      <div
        ref={ref}
        className={containerClasses}
        role="status"
        aria-live="polite"
        aria-label={label || 'Loading...'}
      >
        {spinnerSVG}
        
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

        {/* Commerce state indicator */}
        {commerceState && commerceState !== 'initiation' && (
          <div className={cn(
            'absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white',
            commerceState === 'agreement' && 'bg-warning-500',
            commerceState === 'execution' && 'bg-primary-600',
            commerceState === 'settlement' && 'bg-gray-500',
            commerceState === 'completion' && 'bg-success-500'
          )} />
        )}

        {/* AI Config Display (development only) */}
        {process.env.NODE_ENV === 'development' && aiConfig && (
          <div className="absolute -top-8 left-0 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
            AI Config: {JSON.stringify(aiConfig.layout || 'default')}
          </div>
        )}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;