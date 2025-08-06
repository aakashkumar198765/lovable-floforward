import React, { forwardRef } from 'react';
import { LabelProps } from '../../../types';
import { cn } from '../../../utils/utils';
import { colorClasses, sizeClasses } from '../../../utils/tailwindClassMaps';

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
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {

    // Build label classes
    const labelClasses = cn(
      'flex font-work-sans select-none transition-colors duration-200',
      sizeClasses.text[size] || sizeClasses.text.md,
      sizeClasses.fontWeight[weight] || sizeClasses.fontWeight.medium,
      colorClasses[color] || colorClasses.default,
      required && 'after:content-["*"] after:text-error-500 after:ml-1',
      optional && 'after:content-["(optional)"] after:text-gray-400 after:ml-1 after:font-normal after:text-xs',
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

      </label>
    );
  }
);

Label.displayName = 'Label';

export default Label;