import React, { forwardRef, useState } from 'react';
import { AvatarProps } from '../../../types';
import { cn } from '../../../utils/cn';
import { sizeClasses, shapeClasses, statusClasses, positionClasses } from '../../../utils/tailwindClassMaps';
import { User } from 'lucide-react';

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src = '',
      alt = '',
      size = 'md',
      name = '',
      initials = '',
      fallback,
      shape = 'circle',
      status,
      statusPosition = 'bottom-right',
      border = false,
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

    // Handle click events
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (onClick && typeof onClick === 'function') {
        onClick(event);
      }
    };


    // Build avatar classes
    const avatarClasses = cn(
      'relative inline-flex items-center justify-center overflow-hidden bg-gray-100 font-work-sans font-medium text-gray-600',
      sizeClasses.avatar[size] || sizeClasses.avatar.md,
      shapeClasses.avatar[shape] || shapeClasses.avatar.circle,
      border && 'ring-2 ring-white',
      onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
      className || ''
    );

    // Status indicator classes
    const statusIndicatorClasses = cn(
      'absolute block rounded-full ring-2 ring-white',
      size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-3 w-3',
      status && statusClasses.avatar[status] ? statusClasses.avatar[status] : '',
      positionClasses.status[statusPosition] || positionClasses.status['bottom-right']
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
      return <User className="h-full w-full text-gray-400" />;
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
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;