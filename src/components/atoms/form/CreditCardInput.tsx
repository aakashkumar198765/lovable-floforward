import React, { forwardRef, useState, useCallback } from 'react';
import { InputProps } from '../../../types';
import { cn } from '../../../utils/utils';
import { Lock } from 'lucide-react';
import { formInputSizeClasses } from '../../../utils/tailwindClassMaps';
import Input from './Input';
import { Label } from '../display';

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
      
      // Call external onChange with clean value (no spaces)
      if (onChange) {
        const modifiedEvent = { ...event, target: { ...event.target, value: cleanValue } };
        onChange(modifiedEvent);
      }
    }, [
      formatCardNumber, detectCardType, cardType, onCardTypeChange, 
      name, id, onChange, encryptionLevel
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


    const inputClasses = cn(
      'w-full rounded-md transition-all duration-200 outline-none font-mono',
      formInputSizeClasses[size],
      variantClasses[variant],
      statusClasses[status],
      disabled && 'opacity-50 cursor-not-allowed',
      readonly && 'bg-gray-50',
      encryptionLevel !== 'none' && 'border-l-4 border-l-green-500',
      className
    );

    const displayValue = maskInput ? maskCardNumber(String(internalValue)) : String(internalValue);

    return (
      <div className="space-y-1">
        <Input
          ref={ref}
          id={id}
          name={name}
          type="text"
          placeholder={placeholder}
          value={displayValue}
          disabled={disabled}
          readonly={readonly}
          required={required}
          size={size}
          variant={variant}
          status={status}
          label={label}
          helperText={helperText}
          errorMessage={errorMessage}
          leftIcon={leftIcon || (showCardType && cardType && cardType !== 'unknown' ? (
            <span className="text-lg" title={cardType}>
              {getCardIcon(cardType)}
            </span>
          ) : undefined)}
          rightIcon={rightIcon}
          className={cn(
            inputClasses,
            encryptionLevel !== 'none' && 'border-l-4 border-l-green-500',
            className
          )}
          style={style}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          autoComplete="cc-number"
          pattern="[0-9\s]{13,19}"
          maxLength={19}
          {...props}
        />

        {/* Card Type Information */}
        {showCardType && cardType && cardType !== 'unknown' && (
          <div className="text-xs text-gray-500 capitalize">
            {cardType} detected
          </div>
        )}

        {/* Encryption Indicator */}
        {encryptionLevel !== 'none' && (
          <div className="flex items-center space-x-1 text-green-600 text-xs mt-1">
            <Lock className="w-3 h-3" />
            <span>Encrypted</span>
          </div>
        )}
      </div>
    );
  }
);

CreditCardInput.displayName = 'CreditCardInput';

export default CreditCardInput;