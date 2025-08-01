import React, { forwardRef, useState } from 'react';
import { AvatarProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = '',
      size = 'md',
      name = '',
      initials,
      fallback,
      shape = 'circle',
      status,
      statusPosition = 'bottom-right',
      border = false,
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
      onClick,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    // Generate initials from name if not provided
    const getInitials = () => {
      if (initials && initials !== '') return initials;
      if (name && name !== '') {
        return name
          .split(' ')
          .map(word => word.charAt(0))
          .join('')
          .substring(0, 2)
          .toUpperCase();
      }
      return '';
    };

    // Handle image error
    const handleImageError = () => {
      setImageError(true);
    };

    // Handle click events with audit trail
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      // Audit trail logging
      if (auditTrail && typeof auditTrail === 'object' && auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Avatar click tracked:', {
          action: 'avatar_click',
          name: name,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      // Call external onClick
      if (onClick && typeof onClick === 'function') {
        onClick(event);
      }

      // Call update callback for enterprise integration
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate('avatar_clicked');
      }
    };

    // Size classes
    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
      '2xl': 'h-20 w-20 text-2xl',
      '3xl': 'h-24 w-24 text-3xl'
    };

    // Shape classes
    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-lg'
    };

    // Status classes
    const statusClasses = {
      online: 'bg-success-500',
      offline: 'bg-gray-400',
      away: 'bg-warning-500',
      busy: 'bg-error-500'
    };

    // Status position classes
    const statusPositionClasses = {
      'top-right': 'top-0 right-0',
      'bottom-right': 'bottom-0 right-0',
      'top-left': 'top-0 left-0',
      'bottom-left': 'bottom-0 left-0'
    };

    // Commerce state classes
    const commerceStateClasses = {
      initiation: 'ring-primary-300',
      agreement: 'ring-warning-300',
      execution: 'ring-primary-500',
      settlement: 'ring-gray-400',
      completion: 'ring-gray-300',
      none: 'ring-0'
    };

    // Build avatar classes
    const avatarClasses = cn(
      'relative inline-flex items-center justify-center overflow-hidden bg-gray-100 font-work-sans font-medium text-gray-600',
      sizeClasses[size] || sizeClasses.md,
      shapeClasses[shape] || shapeClasses.circle,
      border && 'ring-2 ring-white',
      commerceState && commerceStateClasses[commerceState] ? `ring-2 ${commerceStateClasses[commerceState]}` : '',
      onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
      className || ''
    );

    // Status indicator classes
    const statusIndicatorClasses = cn(
      'absolute block rounded-full ring-2 ring-white',
      size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-3 w-3',
      status && statusClasses[status] ? statusClasses[status] : '',
      statusPositionClasses[statusPosition] || statusPositionClasses['bottom-right']
    );

    // Render avatar content
    const renderContent = () => {
      // If image is available and not errored, show image
      if (src && src !== '' && !imageError) {
        return (
          <img
            className="h-full w-full object-cover"
            src={src}
            alt={alt || name || 'Avatar'}
            onError={handleImageError}
          />
        );
      }

      // If fallback provided, use it
      if (fallback) {
        return fallback;
      }

      // Use initials if available
      const displayInitials = getInitials();
      if (displayInitials) {
        return displayInitials;
      }

      // Default user icon fallback
      return (
        <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    };

    return (
      <div
        ref={ref}
        className={avatarClasses}
        style={style}
        onClick={onClick ? handleClick : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={alt || name || 'Avatar'}
        {...props}
      >
        {renderContent()}
        
        {/* Status indicator */}
        {status && (
          <span
            className={statusIndicatorClasses}
            aria-label={`Status: ${status}`}
          />
        )}

        {/* Commerce state indicator */}
        {commerceState && commerceState !== 'initiation' && (
          <div className={cn(
            'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
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

Avatar.displayName = 'Avatar';

export default Avatar;