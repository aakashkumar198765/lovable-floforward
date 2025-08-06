import React, { forwardRef, useEffect, useRef } from 'react';
import { ModalProps } from '../../../types';
import { cn } from '../../../utils/utils';
import { X, Loader2 } from 'lucide-react';
import { modalSliderClasses } from '../../../utils/tailwindClassMaps';

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      size = 'md',
      variant = 'modal',
      position = 'center',
      centered = true,
      closable = true,
      maskClosable = true,
      keyboard = true,
      footer,
      header,
      loading = false,
      destroyOnClose = false,
      zIndex = 1000,
      focusTrap = true,
      initialFocus,
      slideDirection = 'right',
      maxWidth,
      maxHeight,
      onOpen,
      onAfterOpen,
      onAfterClose,
      className = '',
      style = {},
      children,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Handle open/close effects
    useEffect(() => {
      if (isOpen) {
        // Store previous focus
        previousFocusRef.current = document.activeElement as HTMLElement;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        if (focusTrap) {
          setTimeout(() => {
            if (initialFocus?.current) {
              initialFocus.current.focus();
            } else if (modalRef.current) {
              const firstFocusable = modalRef.current.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              ) as HTMLElement;
              if (firstFocusable) {
                firstFocusable.focus();
              }
            }
          }, 100);
        }


        if (onOpen && typeof onOpen === 'function') {
          onOpen();
        }

        if (onAfterOpen && typeof onAfterOpen === 'function') {
          setTimeout(onAfterOpen, 100);
        }
      } else {
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Restore focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }

        if (onAfterClose && typeof onAfterClose === 'function') {
          setTimeout(onAfterClose, 100);
        }
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen, onOpen, onAfterOpen, onAfterClose, focusTrap, initialFocus]);

    // Handle escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen && keyboard && closable) {
          handleClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [isOpen, keyboard, closable]);

    // Handle close
    const handleClose = () => {

      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    };

    // Handle mask click
    const handleMaskClick = (event: React.MouseEvent) => {
      if (maskClosable && event.target === event.currentTarget) {
        handleClose();
      }
    };

    // Position classes for modal variant
    const modalPositionClasses = {
      center: 'items-center justify-center',
      top: 'items-start justify-center pt-16',
      bottom: 'items-end justify-center pb-16',
      left: 'items-center justify-start pl-16',
      right: 'items-center justify-end pr-16',
      'top-left': 'items-start justify-start pt-16 pl-16',
      'top-right': 'items-start justify-end pt-16 pr-16',
      'bottom-left': 'items-end justify-start pb-16 pl-16',
      'bottom-right': 'items-end justify-end pb-16 pr-16'
    };

    // Slider position and animation classes
    const sliderPositionClasses = {
      left: {
        container: 'justify-start',
        transform: isOpen ? 'translate-x-0' : '-translate-x-full',
        height: 'h-full'
      },
      right: {
        container: 'justify-end',
        transform: isOpen ? 'translate-x-0' : 'translate-x-full',
        height: 'h-full'
      },
      top: {
        container: 'items-start justify-center',
        transform: isOpen ? 'translate-y-0' : '-translate-y-full',
        height: 'max-h-screen'
      },
      bottom: {
        container: 'items-end justify-center',
        transform: isOpen ? 'translate-y-0' : 'translate-y-full',
        height: 'max-h-screen'
      }
    };


    // Don't render if not open
    if (!isOpen) {
      return null;
    }

    // Render Modal variant
    if (variant === 'modal') {
      return (
        <>
          {/* Fixed Backdrop */}
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 transition-all duration-300 ease-in-out opacity-100"
            style={{ 
              zIndex,
              margin: 0,
              padding: 0,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
            onClick={handleMaskClick}
          />

          {/* Modal Container */}
          <div
            className="fixed top-0 left-0 w-full h-full overflow-y-auto transition-all duration-300 ease-in-out opacity-100"
            style={{ 
              zIndex: zIndex + 1,
              margin: 0,
              padding: 0,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
            onClick={handleMaskClick}
          >
            <div
              className={cn(
                'flex min-h-full p-4',
                centered ? modalPositionClasses[position] : modalPositionClasses[position]
              )}
            >
              <div
                ref={modalRef}
                className={cn(
                  'relative w-full transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl dark:shadow-2xl transition-all duration-300 ease-in-out font-work-sans',
                  modalSliderClasses.modalSizeClasses[size],
                  'scale-100',
                  className
                )}
                style={{
                  maxWidth: maxWidth || undefined,
                  maxHeight: maxHeight || undefined,
                  ...style
                }}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                {...props}
              >
                {/* Header */}
                {(header || title || closable) && (
                  <div className="border-b border-gray-200 dark:border-gray-600 px-6 py-4 transition-colors duration-200">
                    {header || (
                      <div className="flex items-center justify-between">
                        {title && (
                          <h3 id="modal-title" className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                            {title}
                          </h3>
                        )}
                        {closable && (
                          <button
                            type="button"
                            onClick={handleClose}
                            className="ml-3 flex-shrink-0 p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                            aria-label="Close modal"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="px-6 py-4 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="animate-spin h-8 w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                  ) : (
                    children
                  )}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="border-t border-gray-200 dark:border-gray-600 px-6 py-4 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                    {footer}
                  </div>
                )}

                {/* Commerce state indicator */}
                {/* {commerceState && commerceState !== 'initiation' && (
                  <div className={cn(
                    'absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
                    commerceState === 'agreement' && 'bg-warning-500',
                    commerceState === 'execution' && 'bg-primary-600',
                    commerceState === 'settlement' && 'bg-gray-500',
                    commerceState === 'completion' && 'bg-success-500'
                  )} />
                )} */}
              </div>
            </div>
          </div>
        </>
      );
    }

    // Render Slider variant
    if (variant === 'slider') {
      const sliderConfig = sliderPositionClasses[slideDirection];
      
      return (
        <>
          {/* Fixed Backdrop */}
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 transition-all duration-300 ease-in-out opacity-100"
            style={{ 
              zIndex,
              margin: 0,
              padding: 0,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
            onClick={handleMaskClick}
          />

          {/* Slider Container */}
          <div
            className={cn(
              'fixed top-0 left-0 w-full h-full flex transition-all duration-300 ease-in-out',
              sliderConfig.container
            )}
            style={{ 
              zIndex: zIndex + 1,
              margin: 0,
              padding: 0,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          >
            <div
              ref={modalRef}
              className={cn(
                'relative bg-white dark:bg-gray-800 shadow-xl dark:shadow-2xl transform transition-all duration-300 ease-in-out font-work-sans flex flex-col',
                sliderConfig.height,
                slideDirection === 'left' || slideDirection === 'right' ? modalSliderClasses.sliderSizeClasses[size] : 'w-full',
                'translate-x-0 translate-y-0',
                className
              )}
              style={{
                maxWidth: maxWidth || undefined,
                maxHeight: maxHeight || undefined,
                ...style
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'slider-title' : undefined}
              {...props}
            >
              {/* Header - Fixed at top */}
              {(header || title || closable) && (
                <div className="border-b border-gray-200 dark:border-gray-600 px-6 py-4 flex-shrink-0 bg-white dark:bg-gray-800 transition-colors duration-200">
                  {header || (
                    <div className="flex items-center justify-between">
                      {title && (
                        <h3 id="slider-title" className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                          {title}
                        </h3>
                      )}
                      {closable && (
                        <button
                          type="button"
                          onClick={handleClose}
                          className="ml-3 flex-shrink-0 p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                          aria-label="Close slider"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Content - Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                ) : (
                  children
                )}
              </div>

              {/* Footer - Fixed at bottom */}
              {footer && (
                <div className="border-t border-gray-200 dark:border-gray-600 px-6 py-4 bg-gray-50 dark:bg-gray-700 flex-shrink-0 transition-colors duration-200">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </>
      );
    }

    return null;
  }
);

Modal.displayName = 'Modal';

export default Modal;