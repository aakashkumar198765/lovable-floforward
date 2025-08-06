import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import { PaymentFormProps, PaymentData } from '../../../types';
import { cn } from '../../../utils/utils';
import { Input, Select, Checkbox, Button, Radio } from '../../atoms/form';
import { Lock } from 'lucide-react';
// import CreditCardInput from '../../atoms/form/CreditCardInput';

const PaymentForm = forwardRef<HTMLFormElement, PaymentFormProps>(
  (
    {
      id = '',
      title = 'Payment Information',
      value = {},
      defaultValue = {},
      required = false,
      showTitle = true,
      allowedMethods = ['credit_card', 'debit_card', 'bank_transfer', 'paypal'],
      showBillingAddress = true,
      showSaveOptions = true,
      showTermsAgreement = true,
      enableEncryption = true,
      layout = 'vertical',
      columns = 1,
      size = 'md',
      variant = 'default',
      paymentMethods = [
        { value: 'credit_card', label: 'Credit Card', icon: '💳' },
        { value: 'debit_card', label: 'Debit Card', icon: '💳' },
        { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
        { value: 'paypal', label: 'PayPal', icon: '🅿️' },
        { value: 'apple_pay', label: 'Apple Pay', icon: '🍎' },
        { value: 'google_pay', label: 'Google Pay', icon: '🔵' },
        { value: 'crypto', label: 'Cryptocurrency', icon: '₿' }
      ],
      countries = [
        { value: 'US', label: 'United States' },
        { value: 'CA', label: 'Canada' },
        { value: 'GB', label: 'United Kingdom' },
        { value: 'AU', label: 'Australia' }
      ],
      states = [
        { value: 'AL', label: 'Alabama' },
        { value: 'AK', label: 'Alaska' },
        { value: 'AZ', label: 'Arizona' },
        { value: 'CA', label: 'California' },
        { value: 'FL', label: 'Florida' },
        { value: 'NY', label: 'New York' },
        { value: 'TX', label: 'Texas' }
      ],
      cryptoTypes = [
        { value: 'bitcoin', label: 'Bitcoin (BTC)' },
        { value: 'ethereum', label: 'Ethereum (ETH)' },
        { value: 'litecoin', label: 'Litecoin (LTC)' }
      ],
      validation = {
        required: ['method', 'cardNumber', 'cardHolderName', 'expiryMonth', 'expiryYear', 'cvv'],
        patterns: {
          cardNumber: '^[0-9]{13,19}$',
          cvv: '^[0-9]{3,4}$',
          expiryMonth: '^(0[1-9]|1[0-2])$',
          expiryYear: '^[0-9]{2}$',
          paypalEmail: '^[^@]+@[^@]+\\.[^@]+$'
        }
      },
      className = '',
      style = {},
      onChange,
      onValidation,
      onSubmit,
      
      encryptionLevel = 'high',
      ...props
    },
    ref
  ) => {
    // Internal state management
    const [internalValue, setInternalValue] = useState<Partial<PaymentData>>({
      ...defaultValue,
      ...value
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isValid, setIsValid] = useState(false);
    const [currentStep, setCurrentStep] = useState('method');

    // Update internal value when prop changes
    useEffect(() => {
      if (value && Object.keys(value)?.length > 0) {
        setInternalValue(prev => ({ ...prev, ...value }));
      }
    }, [value]);

    // Validation functions
    const validateField = useCallback((key: string, fieldValue: any) => {
      const fieldErrors: string[] = [];

      // Required field validation
      if (validation.required?.includes(key) && (!fieldValue || fieldValue === '')) {
        fieldErrors.push(`${key} is required`);
      }

      // Pattern validation
      if (validation.patterns && validation.patterns[key] && fieldValue) {
        const pattern = new RegExp(validation.patterns[key]);
        if (!pattern.test(fieldValue)) {
          fieldErrors.push(`${key} format is invalid`);
        }
      }

      // Custom validation rules
      if (validation.customRules && validation.customRules[key] && fieldValue) {
        const customError = validation.customRules[key](fieldValue);
        if (customError) {
          fieldErrors.push(customError);
        }
      }

      // Method-specific validation
      if (key === 'expiryYear' && fieldValue) {
        const currentYear = new Date().getFullYear() % 100;
        const enteredYear = parseInt(fieldValue);
        if (enteredYear < currentYear) {
          fieldErrors.push('Card has expired');
        }
      }

      if (key === 'expiryMonth' && fieldValue && internalValue.expiryYear) {
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const enteredMonth = parseInt(fieldValue);
        const enteredYear = parseInt(internalValue.expiryYear as string);
        
        if (enteredYear === currentYear && enteredMonth < currentMonth) {
          fieldErrors.push('Card has expired');
        }
      }

      return fieldErrors;
    }, [validation, internalValue.expiryYear]);

    // Validate all fields
    const validateForm = useCallback(() => {
      const newErrors: Record<string, string> = {};
      let valid = true;

      // Get required fields based on payment method
      const getRequiredFields = () => {
        const baseRequired = ['method'];
        
        switch (internalValue.method) {
          case 'credit_card':
          case 'debit_card':
            return [...baseRequired, 'cardNumber', 'cardHolderName', 'expiryMonth', 'expiryYear', 'cvv'];
          case 'bank_transfer':
            return [...baseRequired, 'bankName', 'accountNumber', 'routingNumber'];
          case 'paypal':
            return [...baseRequired, 'paypalEmail'];
          case 'crypto':
            return [...baseRequired, 'cryptoWallet', 'cryptoType'];
          default:
            return baseRequired;
        }
      };

      const requiredFields = getRequiredFields();
      
      requiredFields.forEach(field => {
        const fieldErrors = validateField(field, internalValue[field as keyof PaymentData]);
        if (fieldErrors.length > 0) {
          newErrors[field] = fieldErrors[0];
          valid = false;
        }
      });

      // Terms agreement validation
      if (showTermsAgreement && !internalValue.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        valid = false;
      }

      setErrors(newErrors);
      setIsValid(valid);

      // Call validation callback
      if (onValidation) {
        onValidation(valid, newErrors);
      }

      return valid;
    }, [internalValue, validateField, showTermsAgreement, onValidation]);

    // Handle field changes
    const handleFieldChange = useCallback((key: string, fieldValue: any) => {
      const newValue = { ...internalValue, [key]: fieldValue };
      setInternalValue(newValue);
      setTouched(prev => ({ ...prev, [key]: true }));

      // Validate field
      const fieldErrors = validateField(key, fieldValue);
      setErrors(prev => ({
        ...prev,
        [key]: fieldErrors.length > 0 ? fieldErrors[0] : ''
      }));

      // Call external onChange
      if (onChange) {
        onChange(newValue);
      }
    }, [internalValue, validateField, onChange, encryptionLevel]);

    // Handle form submission
    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      const valid = validateForm();
      if (valid && onSubmit) {
        onSubmit(internalValue as PaymentData);
      }
    }, [validateForm, onSubmit, internalValue]);

    // Filtered payment methods based on allowed methods
    const filteredPaymentMethods = paymentMethods.filter(method => 
      allowedMethods.includes(method.value)
    );

    // Layout classes
    const layoutClasses = {
      vertical: 'space-y-6',
      horizontal: 'space-y-4',
      compact: 'space-y-3'
    };

    // Column classes
    const columnClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    };

    // Size classes
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    // Variant classes
    const variantClasses = {
      default: 'border border-gray-300 rounded-lg p-6 bg-white',
      outlined: 'border-2 border-gray-300 rounded-lg p-6 bg-white',
      filled: 'bg-gray-50 rounded-lg p-6'
    };

    const formClasses = cn(
      'payment-form',
      sizeClasses[size],
      variantClasses[variant],
      layoutClasses[layout],
      encryptionLevel !== 'none' && 'border-l-4 border-l-green-500',
      className
    );

    // Render payment method specific fields
    const renderPaymentMethodFields = () => {
      switch (internalValue.method) {
        case 'credit_card':
        case 'debit_card':
          return (
            <div className="space-y-4">
              <div className={cn('grid gap-4', columnClasses[columns])}>
                <Input
                  id={`${id}-card-number`}
                  name="cardNumber"
                  type="text"
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value={internalValue.cardNumber || ''}
                  required={validation.required?.includes('cardNumber')}
                  status={errors.cardNumber ? 'error' : 'default'}
                  errorMessage={touched.cardNumber ? errors.cardNumber : ''}
                  encryptionLevel={encryptionLevel}
                  size={size}
                  onChange={(e) => handleFieldChange('cardNumber', e.target.value)}
                />

                <Input
                  id={`${id}-cardholder-name`}
                  name="cardHolderName"
                  label="Cardholder Name"
                  placeholder="John Doe"
                  value={internalValue.cardHolderName || ''}
                  required={validation.required?.includes('cardHolderName')}
                  status={errors.cardHolderName ? 'error' : 'default'}
                  errorMessage={touched.cardHolderName ? errors.cardHolderName : ''}
                  autoComplete="cc-name"
                  size={size}
                  onChange={(e) => handleFieldChange('cardHolderName', e.target.value)}
                />
              </div>

              <div className={cn('grid gap-4', 'grid-cols-2 md:grid-cols-3')}>
                <Select
                  id={`${id}-expiry-month`}
                  name="expiryMonth"
                  label="Expiry Month"
                  value={internalValue.expiryMonth || ''}
                  required={validation.required?.includes('expiryMonth')}
                  status={errors.expiryMonth ? 'error' : 'default'}
                  errorMessage={touched.expiryMonth ? errors.expiryMonth : ''}
                  options={Array.from({ length: 12 }, (_, i) => ({
                    value: String(i + 1).padStart(2, '0'),
                    label: String(i + 1).padStart(2, '0')
                  }))}
                  size={size}
                  onChange={(value) => handleFieldChange('expiryMonth', value)}
                />

                <Select
                  id={`${id}-expiry-year`}
                  name="expiryYear"
                  label="Expiry Year"
                  value={internalValue.expiryYear || ''}
                  required={validation.required?.includes('expiryYear')}
                  status={errors.expiryYear ? 'error' : 'default'}
                  errorMessage={touched.expiryYear ? errors.expiryYear : ''}
                  options={Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    const shortYear = String(year).slice(-2);
                    return { value: shortYear, label: shortYear };
                  })}
                  size={size}
                  onChange={(value) => handleFieldChange('expiryYear', value)}
                />

                <Input
                  id={`${id}-cvv`}
                  name="cvv"
                  type="password"
                  label="CVV"
                  placeholder="123"
                  value={internalValue.cvv || ''}
                  required={validation.required?.includes('cvv')}
                  status={errors.cvv ? 'error' : 'default'}
                  errorMessage={touched.cvv ? errors.cvv : ''}
                  maxLength={4}
                  autoComplete="cc-csc"
                  size={size}
                  onChange={(e) => handleFieldChange('cvv', e.target.value)}
                />
              </div>
            </div>
          );

        case 'bank_transfer':
          return (
            <div className={cn('grid gap-4', columnClasses[columns])}>
              <Input
                id={`${id}-bank-name`}
                name="bankName"
                label="Bank Name"
                placeholder="Bank of America"
                value={internalValue.bankName || ''}
                required={validation.required?.includes('bankName')}
                status={errors.bankName ? 'error' : 'default'}
                errorMessage={touched.bankName ? errors.bankName : ''}
                size={size}
                onChange={(e) => handleFieldChange('bankName', e.target.value)}
              />

              <Input
                id={`${id}-account-number`}
                name="accountNumber"
                label="Account Number"
                placeholder="1234567890"
                value={internalValue.accountNumber || ''}
                required={validation.required?.includes('accountNumber')}
                status={errors.accountNumber ? 'error' : 'default'}
                errorMessage={touched.accountNumber ? errors.accountNumber : ''}
                size={size}
                onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
              />

              <Input
                id={`${id}-routing-number`}
                name="routingNumber"
                label="Routing Number"
                placeholder="123456789"
                value={internalValue.routingNumber || ''}
                required={validation.required?.includes('routingNumber')}
                status={errors.routingNumber ? 'error' : 'default'}
                errorMessage={touched.routingNumber ? errors.routingNumber : ''}
                size={size}
                onChange={(e) => handleFieldChange('routingNumber', e.target.value)}
              />
            </div>
          );

        case 'paypal':
          return (
            <Input
              id={`${id}-paypal-email`}
              name="paypalEmail"
              type="email"
              label="PayPal Email"
              placeholder="user@example.com"
              value={internalValue.paypalEmail || ''}
              required={validation.required?.includes('paypalEmail')}
              status={errors.paypalEmail ? 'error' : 'default'}
              errorMessage={touched.paypalEmail ? errors.paypalEmail : ''}
              autoComplete="email"
              size={size}
              onChange={(e) => handleFieldChange('paypalEmail', e.target.value)}
            />
          );

        case 'crypto':
          return (
            <div className={cn('grid gap-4', columnClasses[columns])}>
              <Select
                id={`${id}-crypto-type`}
                name="cryptoType"
                label="Cryptocurrency Type"
                value={internalValue.cryptoType || ''}
                required={validation.required?.includes('cryptoType')}
                status={errors.cryptoType ? 'error' : 'default'}
                errorMessage={touched.cryptoType ? errors.cryptoType : ''}
                options={cryptoTypes}
                size={size}
                onChange={(value) => handleFieldChange('cryptoType', value)}
              />

              <Input
                id={`${id}-crypto-wallet`}
                name="cryptoWallet"
                label="Wallet Address"
                placeholder="1A2B3C4D5E6F..."
                value={internalValue.cryptoWallet || ''}
                required={validation.required?.includes('cryptoWallet')}
                status={errors.cryptoWallet ? 'error' : 'default'}
                errorMessage={touched.cryptoWallet ? errors.cryptoWallet : ''}
                encryptionLevel={encryptionLevel}
                size={size}
                onChange={(e) => handleFieldChange('cryptoWallet', e.target.value)}
              />
            </div>
          );

        default:
          return null;
      }
    };

    // Render billing address fields
    const renderBillingAddress = () => {
      if (!showBillingAddress) return null;

      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
          
          <div className={cn('grid gap-4', columnClasses[columns])}>
            <Input
              id={`${id}-address-line1`}
              name="addressLine1"
              label="Address Line 1"
              placeholder="123 Main Street"
              value={internalValue.billingAddress?.addressLine1 || ''}
              size={size}
              onChange={(e) => handleFieldChange('billingAddress', {
                ...internalValue.billingAddress,
                addressLine1: e.target.value
              })}
            />

            <Input
              id={`${id}-address-line2`}
              name="addressLine2"
              label="Address Line 2"
              placeholder="Apt, Suite, etc. (Optional)"
              value={internalValue.billingAddress?.addressLine2 || ''}
              size={size}
              onChange={(e) => handleFieldChange('billingAddress', {
                ...internalValue.billingAddress,
                addressLine2: e.target.value
              })}
            />

            <Input
              id={`${id}-city`}
              name="city"
              label="City"
              placeholder="New York"
              value={internalValue.billingAddress?.city || ''}
              size={size}
              onChange={(e) => handleFieldChange('billingAddress', {
                ...internalValue.billingAddress,
                city: e.target.value
              })}
            />

            <Select
              id={`${id}-state`}
              name="state"
              label="State"
              value={internalValue.billingAddress?.state || ''}
              options={states}
              size={size}
              onChange={(value) => handleFieldChange('billingAddress', {
                ...internalValue.billingAddress,
                state: value
              })}
            />

            <Input
              id={`${id}-postal-code`}
              name="postalCode"
              label="Postal Code"
              placeholder="10001"
              value={internalValue.billingAddress?.postalCode || ''}
              size={size}
              onChange={(e) => handleFieldChange('billingAddress', {
                ...internalValue.billingAddress,
                postalCode: e.target.value
              })}
            />

            <Select
              id={`${id}-country`}
              name="country"
              label="Country"
              value={internalValue.billingAddress?.country || ''}
              options={countries}
              size={size}
              onChange={(value) => handleFieldChange('billingAddress', {
                ...internalValue.billingAddress,
                country: value
              })}
            />
          </div>
        </div>
      );
    };

    return (
      <form
        ref={ref}
        className={formClasses}
        style={style}
        onSubmit={handleSubmit}
        noValidate
        {...props}
      >
        {/* Title */}
        {showTitle && title && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {encryptionLevel !== 'none' && (
              <div className="flex items-center mt-2 text-sm text-green-600">
                <Lock className="w-4 h-4 mr-1" />
                Secure encrypted payment processing
              </div>
            )}
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
          <Radio
            options={filteredPaymentMethods.map(method => ({
              value: method.value,
              label: `${method.icon} ${method.label}`
            }))}
            value={internalValue.method || ''}
            orientation="vertical"
            size={size}
            onChange={(value) => handleFieldChange('method', value)}
          />
        </div>

        {/* Payment Method Specific Fields */}
        {internalValue.method && (
          <div className="space-y-6">
            {renderPaymentMethodFields()}
          </div>
        )}

        {/* Billing Address */}
        {renderBillingAddress()}

        {/* Save Options */}
        {showSaveOptions && (
          <div className="space-y-3">
            <Checkbox
              id={`${id}-save-payment`}
              name="savePaymentMethod"
              label="Save payment method for future use"
              checked={internalValue.savePaymentMethod || false}
              size={size}
              onChange={(checked) => handleFieldChange('savePaymentMethod', checked)}
            />

            <Checkbox
              id={`${id}-set-default`}
              name="setAsDefault"
              label="Set as default payment method"
              checked={internalValue.setAsDefault || false}
              disabled={!internalValue.savePaymentMethod}
              size={size}
              onChange={(checked) => handleFieldChange('setAsDefault', checked)}
            />
          </div>
        )}

        {/* Terms Agreement */}
        {showTermsAgreement && (
          <div className="space-y-2">
            <Checkbox
              id={`${id}-terms`}
              name="agreeToTerms"
              label="I agree to the Terms and Conditions and Privacy Policy"
              checked={internalValue.agreeToTerms || false}
              required={true}
              errorMessage={touched.agreeToTerms ? errors.agreeToTerms : ''}
              size={size}
              onChange={(checked) => handleFieldChange('agreeToTerms', checked)}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size={size}
            fullWidth={layout === 'vertical'}
            disabled={!isValid}
          >
            Complete Payment
          </Button>
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                error && <li key={field}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    );
  }
);

PaymentForm.displayName = 'PaymentForm';

export default PaymentForm;