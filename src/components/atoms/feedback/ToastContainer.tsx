import React from 'react';
import { cn } from '../../../utils/utils';
import { ToastContainerProps } from '../../../types';

const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  children,
  className = ''
}) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  // Don't render if no children
  if (!children) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed z-50 pointer-events-none',
        positionClasses[position],
        className
      )}
      role="region"
      aria-label="Notifications"
    >
      <div className="flex flex-col space-y-3 pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

export default ToastContainer;