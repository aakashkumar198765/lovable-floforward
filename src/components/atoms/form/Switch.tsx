import React, { forwardRef, useState, useEffect } from 'react';
import { SwitchProps } from '../../../types';
import { cn } from '../../../utils/utils';
import { Label } from '../display';
import Button from './Button';
import Checkbox from './Checkbox';

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      disabled = false,
      readonly = false,
      size = 'md',
      color = 'primary',
      label = '',
      description = '',
      labelPosition = 'right',
      className = '',
      style = {},
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState<boolean>(
      checked !== undefined ? checked : defaultChecked !== undefined ? defaultChecked : false
    );


    // Update internal checked state when external checked changes
    useEffect(() => {
      if (checked !== undefined) {
        setInternalChecked(checked);
      }
    }, [checked]);

    // Handle switch changes with audit trail
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || readonly) return;

      const newChecked = event.target.checked;
      setInternalChecked(newChecked);
      // Call external onChange
      if (onChange && typeof onChange === 'function') {
        onChange(newChecked, event);
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus && typeof onFocus === 'function') {
        onFocus(event);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur && typeof onBlur === 'function') {
        onBlur(event);
      }
    };

    // Size classes
    const sizeClasses = {
      sm: {
        track: 'h-4 w-7',
        thumb: 'h-3 w-3',
        translate: 'translate-x-3'
      },
      md: {
        track: 'h-5 w-9',
        thumb: 'h-4 w-4',
        translate: 'translate-x-4'
      },
      lg: {
        track: 'h-6 w-11',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5'
      }
    };

    // Color classes
    const colorClasses = {
      primary: 'bg-primary-600 focus:ring-primary-500',
      secondary: 'bg-gray-600 focus:ring-gray-500',
      success: 'bg-success-600 focus:ring-success-500',
      warning: 'bg-warning-600 focus:ring-warning-500',
      danger: 'bg-error-600 focus:ring-error-500'
    };


    const currentSize = sizeClasses[size] || sizeClasses.md;

    // Track classes
    const trackClasses = cn(
      'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2',
      'font-work-sans',
      currentSize.track,
      internalChecked ? (colorClasses[color] || colorClasses.primary) : 'bg-gray-200',
      (disabled || readonly) && 'cursor-not-allowed opacity-50',
      !internalChecked && 'focus:ring-gray-500'
    );

    // Thumb classes
    const thumbClasses = cn(
      'pointer-events-none inline-block rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out transform',
      currentSize.thumb,
      internalChecked ? currentSize.translate : 'translate-x-0'
    );

    // Label classes
    const labelClasses = cn(
      'text-sm font-medium text-gray-700 cursor-pointer select-none',
      (disabled || readonly) && 'cursor-not-allowed opacity-50'
    );

    // Description classes
    const descriptionClasses = cn(
      'text-xs text-gray-500 mt-1'
    );

    // Container classes
    const containerClasses = cn(
      'flex items-start gap-3',
      labelPosition === 'left' && 'flex-row-reverse',
      style && typeof style === 'object' && 'custom-style',
      className || ''
    );

    // Switch wrapper classes
    const switchWrapperClasses = cn(
      'flex flex-col',
      labelPosition === 'left' ? 'items-end' : 'items-start'
    );

    return (
      <div className={containerClasses} style={style}>
        <div className={switchWrapperClasses}>
          <Button
            type="button"
            role="switch"
            aria-checked={internalChecked}
            disabled={disabled}
            className={trackClasses}
            onClick={() => {
              if (!disabled && !readonly) {
                const event = {
                  target: { checked: !internalChecked },
                  currentTarget: { checked: !internalChecked }
                } as React.ChangeEvent<HTMLInputElement>;
                handleChange(event);
              }
            }}
          >
            <span className={thumbClasses} />
            
            {/* Hidden checkbox for form submission */}
            <Checkbox
              ref={ref}
              checked={internalChecked}
              disabled={disabled}
              readonly={readonly}
              onChange={(checked, e) => {
                if (e) {
                  handleChange(e);
                }
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="sr-only"
              aria-hidden="true"
              {...props}
            />
          </Button>
        </div>
        
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && label !== '' && (
              <Label
                className={labelClasses}
              >
                {label}
              </Label>
            )}
            
            {description && description !== '' && (
              <div className={descriptionClasses}>
                {description}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;