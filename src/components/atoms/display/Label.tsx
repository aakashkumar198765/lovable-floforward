import React, { forwardRef } from 'react';
import { LabelProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      children,
      htmlFor,
      required = false,
      optional = false,
      size = 'md',
      weight = 'medium',
      color = 'default',
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
    // Handle commerce state based behavior
    const isDisabled = commerceState === 'completion' || 
      (commerceState === 'settlement' && allowedActions && Array.isArray(allowedActions) && !allowedActions.includes('edit'));

    // Size classes
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };

    // Weight classes
    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    };

    // Color classes
    const colorClasses = {
      default: 'text-gray-700',
      muted: 'text-gray-500',
      error: 'text-error-600',
      warning: 'text-warning-600',
      success: 'text-success-600'
    };

    // Commerce state colors
    const commerceStateClasses = {
      initiation: 'text-gray-700',
      agreement: 'text-warning-700',
      execution: 'text-primary-700',
      settlement: 'text-gray-600',
      completion: 'text-gray-500',
      none: 'ring-0'
    };

    // Build label classes
    const labelClasses = cn(
      'block font-work-sans select-none transition-colors duration-200',
      sizeClasses[size] || sizeClasses.md,
      weightClasses[weight] || weightClasses.medium,
      commerceState && commerceStateClasses[commerceState] ? commerceStateClasses[commerceState] : (colorClasses[color] || colorClasses.default),
      required && 'after:content-["*"] after:text-error-500 after:ml-1',
      optional && 'after:content-["(optional)"] after:text-gray-400 after:ml-1 after:font-normal after:text-xs',
      isDisabled && 'opacity-60 cursor-not-allowed',
      className || ''
    );

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={labelClasses}
        style={style}
        {...props}
      >
        {children}
        
        {/* Commerce state indicator */}
        {commerceState && commerceState !== 'none' && commerceState !== 'initiation' && (
          <span className="ml-2 text-xs text-gray-500 uppercase font-normal">
            {commerceState}
          </span>
        )}

        {/* AI Config Display (development only) */}
        {process.env.NODE_ENV === 'development' && aiConfig && (
          <div className="mt-1 p-1 bg-blue-50 rounded text-xs text-blue-600">
            AI Config: {JSON.stringify(aiConfig.layout || 'default')}
          </div>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';

export default Label;