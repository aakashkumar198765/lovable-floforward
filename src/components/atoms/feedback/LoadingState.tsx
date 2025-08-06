import React, { forwardRef } from 'react';
import { LoadingStateProps } from '../../../types';
import { cn } from '../../../utils/utils';
import Spinner from './Spinner';

const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(
  (
    {
      loading,
      children,
      spinner,
      overlay = false,
      text,
      description,
      size = 'md',
      centered = true,
      fullScreen = false,
      transparent = false,
      blur = false,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {

    // Size classes
    const sizeClasses = {
      sm: {
        text: 'text-sm',
        description: 'text-xs',
        spacing: 'space-y-2'
      },
      md: {
        text: 'text-base',
        description: 'text-sm',
        spacing: 'space-y-3'
      },
      lg: {
        text: 'text-lg',
        description: 'text-base',
        spacing: 'space-y-4'
      }
    };


    // Loading overlay classes
    const overlayClasses = cn(
      'flex items-center justify-center font-work-sans',
      fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10',
      transparent ? 'bg-transparent' : 'bg-white bg-opacity-90',
      blur && 'backdrop-blur-sm',
      className
    );

    // Content classes
    const contentClasses = cn(
      'flex flex-col items-center justify-center text-center',
      sizeClasses[size].spacing,
      centered && 'mx-auto'
    );

    // Default spinner
    const defaultSpinner = (
      <Spinner
        size={size === 'sm' ? 'md' : size === 'md' ? 'lg' : 'xl'}
        color="primary"
      />
    );

    // Loading content
    const loadingContent = (
      <div className={contentClasses}>
        {spinner || defaultSpinner}
        
        {text && (
          <p className={cn(
            'font-medium text-gray-900',
            sizeClasses[size].text
          )}>
            {text}
          </p>
        )}
        
        {description && (
          <p className={cn(
            'text-gray-600',
            sizeClasses[size].description
          )}>
            {description}
          </p>
        )}
      </div>
    );

    // If not loading, render children
    if (!loading) {
      return <>{children}</>;
    }

    // If overlay mode, render overlay with children
    if (overlay) {
      return (
        <div
          ref={ref}
          className="relative"
          style={style}
          {...props}
        >
          {children}
          <div className={overlayClasses}>
            {loadingContent}
          </div>
        </div>
      );
    }

    // If fullScreen mode, render fullscreen loading
    if (fullScreen) {
      return (
        <div
          ref={ref}
          className={overlayClasses}
          style={style}
          role="status"
          aria-live="polite"
          aria-label={text || 'Loading...'}
          {...props}
        >
          {loadingContent}
        </div>
      );
    }

    // Default inline loading state
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center p-8 font-work-sans',
          centered && 'text-center',
          className
        )}
        style={style}
        role="status"
        aria-live="polite"
        aria-label={text || 'Loading...'}
        {...props}
      >
        {loadingContent}
      </div>
    );
  }
);

LoadingState.displayName = 'LoadingState';

export default LoadingState;