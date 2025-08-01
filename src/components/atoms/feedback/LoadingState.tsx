import React, { forwardRef } from 'react';
import { LoadingStateProps } from '../../../types';
import { cn } from '../../../utils/cn';
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
    // Handle audit trail
    React.useEffect(() => {
      if (loading && auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.logUserActions) {
        console.log('LoadingState render tracked:', {
          action: 'loading_state_render',
          size,
          overlay,
          fullScreen,
          text,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }
    }, [loading, auditTrail, size, overlay, fullScreen, text, commerceState, workflowContext, userRole]);

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

    // Commerce state classes
    const commerceStateClasses = {
      initiation: 'ring-primary-300',
      agreement: 'ring-warning-300',
      execution: 'ring-primary-500',
      settlement: 'ring-gray-400',
      completion: 'ring-success-300',
      none: 'ring-0'
    };

    // Loading overlay classes
    const overlayClasses = cn(
      'flex items-center justify-center font-work-sans',
      fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10',
      transparent ? 'bg-transparent' : 'bg-white bg-opacity-90',
      blur && 'backdrop-blur-sm',
      commerceState && commerceStateClasses[commerceState] ? `ring-2 ${commerceStateClasses[commerceState]}` : '',
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
        commerceState={commerceState}
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

        {/* Commerce state indicator */}
        {/* {commerceState && commerceState !== 'initiation' && (
          <div className={cn(
            'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
            commerceState === 'agreement' && 'bg-warning-500',
            commerceState === 'execution' && 'bg-primary-600',
            commerceState === 'settlement' && 'bg-gray-500',
            commerceState === 'completion' && 'bg-success-500'
          )} />
        )} */}
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
          
          {/* AI Config Display (development only) */}
          {process.env.NODE_ENV === 'development' && aiConfig && (
            <div className="absolute top-4 left-4 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
              AI Config: {JSON.stringify(aiConfig.layout || 'default')}
            </div>
          )}
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
          commerceState && commerceStateClasses[commerceState] ? `ring-2 ${commerceStateClasses[commerceState]} rounded-lg` : '',
          className
        )}
        style={style}
        role="status"
        aria-live="polite"
        aria-label={text || 'Loading...'}
        {...props}
      >
        {loadingContent}
        
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

LoadingState.displayName = 'LoadingState';

export default LoadingState;