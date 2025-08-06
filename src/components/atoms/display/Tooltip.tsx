import React, { forwardRef, useState, useRef, useCallback } from 'react';
import { cn } from '../../../utils/utils';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  trigger?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
  className?: string;
  arrow?: boolean;
  delay?: number;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
      placement = 'top',
      trigger = 'hover',
      disabled = false,
      className = '',
      arrow = false,
      delay = 0,
      ...props
    },
    ref
  ) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleShow = useCallback(() => {
      if (disabled) return;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          setShowTooltip(true);
        }, delay);
      } else {
        setShowTooltip(true);
      }
    }, [disabled, delay]);

    const handleHide = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowTooltip(false);
    }, []);

    const handleToggle = useCallback(() => {
      if (showTooltip) {
        handleHide();
      } else {
        handleShow();
      }
    }, [showTooltip, handleShow, handleHide]);

    // Event handlers based on trigger type
    const eventHandlers = {
      onMouseEnter: trigger === 'hover' ? handleShow : undefined,
      onMouseLeave: trigger === 'hover' ? handleHide : undefined,
      onClick: trigger === 'click' ? handleToggle : undefined,
      onFocus: trigger === 'focus' ? handleShow : undefined,
      onBlur: trigger === 'focus' ? handleHide : undefined,
    };

    // Get tooltip positioning classes
    const getTooltipPosition = () => {
      switch (placement) {
        case 'top':
          return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
        case 'bottom':
          return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
        case 'left':
          return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
        case 'right':
          return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
        default:
          return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      }
    };

    // Get arrow positioning classes
    const getArrowPosition = () => {
      const baseArrow = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';
      switch (placement) {
        case 'top':
          return cn(baseArrow, 'top-full left-1/2 -translate-x-1/2 -translate-y-1');
        case 'bottom':
          return cn(baseArrow, 'bottom-full left-1/2 -translate-x-1/2 translate-y-1');
        case 'left':
          return cn(baseArrow, 'left-full top-1/2 -translate-y-1/2 -translate-x-1');
        case 'right':
          return cn(baseArrow, 'right-full top-1/2 -translate-y-1/2 translate-x-1');
        default:
          return cn(baseArrow, 'top-full left-1/2 -translate-x-1/2 -translate-y-1');
      }
    };

    return (
      <div
        ref={ref}
        className="relative inline-block"
        {...props}
      >
        <div
          ref={containerRef}
          className="inline-block"
          {...eventHandlers}
        >
          {children}
        </div>

        {showTooltip && (
          <div
            className={cn(
              'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg',
              'pointer-events-none max-w-xs break-words',
              'transition-opacity duration-200 opacity-100',
              getTooltipPosition(),
              className
            )}
            role="tooltip"
          >
            {content}
            {arrow && <div className={getArrowPosition()} />}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;