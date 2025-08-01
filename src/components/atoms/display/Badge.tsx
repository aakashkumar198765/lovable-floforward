import React from 'react';
import { BadgeProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  color = 'primary',
  removable = false,
  onRemove,
  className = '',
  style = {},
}) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove && typeof onRemove === 'function') {
      onRemove();
    }
  };

  // Variant classes with dark theme support
  const variantClasses = {
    default: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 border-primary-200 dark:border-primary-700',
    outlined: 'bg-transparent border-2 text-primary-600 dark:text-primary-400 border-primary-300 dark:border-primary-600',
    filled: 'bg-primary-500 text-white border-primary-500'
  };

  // Color classes with dark theme support
  const colorClasses = {
    primary: {
      default: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 border-primary-200 dark:border-primary-700',
      outlined: 'bg-transparent border-2 text-primary-600 dark:text-primary-400 border-primary-300 dark:border-primary-600',
      filled: 'bg-primary-500 text-white border-primary-500'
    },
    success: {
      default: 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-200 border-success-200 dark:border-success-700',
      outlined: 'bg-transparent border-2 text-success-600 dark:text-success-400 border-success-300 dark:border-success-600',
      filled: 'bg-success-500 text-white border-success-500'
    },
    warning: {
      default: 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-200 border-warning-200 dark:border-warning-700',
      outlined: 'bg-transparent border-2 text-warning-600 dark:text-warning-400 border-warning-300 dark:border-warning-600',
      filled: 'bg-warning-500 text-white border-warning-500'
    },
    error: {
      default: 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-200 border-error-200 dark:border-error-700',
      outlined: 'bg-transparent border-2 text-error-600 dark:text-error-400 border-error-300 dark:border-error-600',
      filled: 'bg-error-500 text-white border-error-500'
    },
    gray: {
      default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600',
      outlined: 'bg-transparent border-2 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600',
      filled: 'bg-gray-500 text-white border-gray-500'
    }
  };

  const badgeClasses = cn(
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200',
    'font-work-sans',
    colorClasses[color as keyof typeof colorClasses]?.[variant as keyof typeof variantClasses] || variantClasses[variant as keyof typeof variantClasses],
    removable && 'pr-1',
    className
  );

  return (
    <span className={badgeClasses} style={style}>
      {children}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
          aria-label="Remove"
        >
          <span className="text-xs">×</span>
        </button>
      )}
    </span>
  );
};

export default Badge;