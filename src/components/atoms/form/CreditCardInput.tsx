import React, { forwardRef, useState, useCallback } from 'react';
import { InputProps } from '../../../types';
import { cn } from '../../../utils/cn';

interface CreditCardInputProps extends Omit<InputProps, 'type' | 'pattern'> {
  showCardType?: boolean;
  maskInput?: boolean;
  onCardTypeChange?: (cardType: string) => void;
}

const CreditCardInput = forwardRef<HTMLInputElement, CreditCardInputProps>(
  (
    {
      id = '',
      name = '',
      placeholder = '1234 5678 9012 3456',
      value = '',
      defaultValue = '',
      disabled = false,
      readonly = false,
      required = false,
      showCardType = true,
      maskInput = false,
      size = 'md',
      variant = 'default',
      status = 'default',
      label = 'Card Number',
      helperText = '',
      errorMessage = '',
      leftIcon,
      rightIcon,
      className = '',
      style = {},
      onChange,
      onBlur,
      onFocus,
      onCardTypeChange,
      commerceState = 'none',
      workflowContext,
      aiConfig,
      schema,
      allowedActions = [],
      userRole,
      data,
      onUpdate,
      auditTrail = { enabled: false, level: 'basic', trackChanges: false, logUserActions: false },
      encryptionLevel = 'field', // Credit cards should default to field-level encryption
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value || defaultValue || '');
    const [cardType, setCardType] = useState('');

    // Card type detection
    const detectCardType = useCallback((cardNumber: string) => {
      const cleanNumber = cardNumber.replace(/\s+/g, '');
      
      if (/^4/.test(cleanNumber)) {
        return 'visa';
      } else if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
        return 'mastercard';
      } else if (/^3[47]/.test(cleanNumber)) {
        return 'amex';
      } else if (/^6/.test(cleanNumber)) {
        return 'discover';
      } else if (/^(5018|5020|5038|6304|6759|676[1-3])/.test(cleanNumber)) {
        return 'maestro';
      }
      return 'unknown';
    }, []);

    // Format card number with spaces
    const formatCardNumber = useCallback((cardNumber: string) => {
      const cleanNumber = cardNumber.replace(/\s+/g, '');
      const cardType = detectCardType(cleanNumber);
      
      // American Express uses 4-6-5 format
      if (cardType === 'amex') {
        return cleanNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
      }
      // Others use 4-4-4-4 format
      return cleanNumber.replace(/(\d{4})/g, '$1 ').trim();
    }, [detectCardType]);

    // Mask card number (show only last 4 digits)
    const maskCardNumber = useCallback((cardNumber: string) => {
      const cleanNumber = cardNumber.replace(/\s+/g, '');
      if (cleanNumber.length <= 4) return cardNumber;
      
      const lastFour = cleanNumber.slice(-4);
      const maskedPart = '*'.repeat(cleanNumber.length - 4);
      return formatCardNumber(maskedPart + lastFour);
    }, [formatCardNumber]);

    // Handle input change
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value.replace(/[^\d\s]/g, ''); // Allow only digits and spaces
      const cleanValue = inputValue.replace(/\s+/g, ''); // Remove spaces for processing
      
      // Limit to maximum card number length
      if (cleanValue.length > 19) return;
      
      const formattedValue = formatCardNumber(cleanValue);
      const newCardType = detectCardType(cleanValue);
      
      setInternalValue(formattedValue);
      setCardType(newCardType);
      
      // Call card type change handler
      if (onCardTypeChange && newCardType !== cardType) {
        onCardTypeChange(newCardType);
      }
      
      // Audit trail logging
      if (auditTrail.enabled && auditTrail.trackChanges) {
        console.log('Credit card input change tracked:', {
          field: name || id || 'credit-card',
          cardType: newCardType,
          length: cleanValue.length,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          encryptionLevel
        });
      }
      
      // Call external onChange with clean value (no spaces)
      if (onChange) {
        const modifiedEvent = { ...event, target: { ...event.target, value: cleanValue } };
        onChange(modifiedEvent);
      }
      
      // Call update callback for enterprise integration
      if (onUpdate) {
        onUpdate(cleanValue);
      }
    }, [
      formatCardNumber, detectCardType, cardType, onCardTypeChange, auditTrail, 
      name, id, commerceState, workflowContext, encryptionLevel, onChange, onUpdate
    ]);

    // Card type icons
    const getCardIcon = (type: string) => {
      switch (type) {
        case 'visa':
          return '💳'; // In real implementation, use proper SVG icons
        case 'mastercard':
          return '💳';
        case 'amex':
          return '💳';
        case 'discover':
          return '💳';
        case 'maestro':
          return '💳';
        default:
          return '💳';
      }
    };

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg'
    };

    // Variant classes
    const variantClasses = {
      default: 'border border-gray-300 bg-white',
      outlined: 'border-2 border-gray-300 bg-transparent',
      filled: 'border-0 bg-gray-100'
    };

    // Status classes
    const statusClasses = {
      default: 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
      error: 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500',
      warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500',
      success: 'border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500'
    };

    // Commerce state classes
    const commerceStateClasses = {
      initiation: 'border-blue-300',
      agreement: 'border-yellow-300',
      execution: 'border-green-300',
      settlement: 'border-purple-300',
      completion: 'border-gray-400',
      none: 'ring-0'
    };

    const inputClasses = cn(
      'w-full rounded-md transition-all duration-200 outline-none font-mono',
      sizeClasses[size],
      variantClasses[variant],
      statusClasses[status],
      commerceState && commerceStateClasses[commerceState],
      disabled && 'opacity-50 cursor-not-allowed',
      readonly && 'bg-gray-50',
      encryptionLevel !== 'none' && 'border-l-4 border-l-green-500',
      className
    );

    const displayValue = maskInput ? maskCardNumber(String(internalValue)) : String(internalValue);

    return (
      <div className="space-y-1">
        {/* Label */}
        {label && (
          <label 
            htmlFor={id} 
            className={cn(
              'block text-sm font-medium',
              status === 'error' ? 'text-red-700' : 'text-gray-700',
              required && "after:content-['*'] after:text-red-500 after:ml-1"
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon or Card Type */}
          {(leftIcon || (showCardType && cardType && cardType !== 'unknown')) && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              {leftIcon || (showCardType && (
                <span className="text-lg" title={cardType}>
                  {getCardIcon(cardType)}
                </span>
              ))}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={id}
            name={name}
            type="text"
            placeholder={placeholder}
            value={displayValue}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            autoComplete="cc-number"
            inputMode="numeric"
            pattern="[0-9\s]{13,19}"
            maxLength={19}
            className={cn(
              inputClasses,
              (leftIcon || (showCardType && cardType && cardType !== 'unknown')) && 'pl-10',
              rightIcon && 'pr-10'
            )}
            style={style}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            aria-invalid={status === 'error'}
            aria-describedby={
              (helperText || errorMessage) 
                ? `${id}-description` 
                : undefined
            }
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}

          {/* Encryption Indicator */}
          {encryptionLevel !== 'none' && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <div className="flex items-center space-x-1 text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Encrypted</span>
              </div>
            </div>
          )}
        </div>

        {/* Helper Text or Error Message */}
        {(helperText || errorMessage) && (
          <div 
            id={`${id}-description`}
            className={cn(
              'text-sm',
              status === 'error' ? 'text-red-600' : 'text-gray-600'
            )}
          >
            {errorMessage || helperText}
          </div>
        )}

        {/* Card Type Information */}
        {showCardType && cardType && cardType !== 'unknown' && (
          <div className="text-xs text-gray-500 capitalize">
            {cardType} detected
          </div>
        )}
      </div>
    );
  }
);

CreditCardInput.displayName = 'CreditCardInput';

export default CreditCardInput;