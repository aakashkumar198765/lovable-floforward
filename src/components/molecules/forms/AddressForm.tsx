import React, { useState, useCallback, useEffect } from 'react';
import { AddressData, AddressFormProps, CommerceState } from '../../../types';
import { cn } from '../../../utils/cn';
import Input from '../../atoms/form/Input';
import Select from '../../atoms/form/Select';
import Checkbox from '../../atoms/form/Checkbox';

const AddressForm: React.FC<AddressFormProps> = ({
  id = 'address-form',
  title = 'Address Information',
  addressType = 'shipping',
  value,
  defaultValue = {},
  required = true,
  showTitle = true,
  showType = false,
  showPersonName = true,
  showCompany = false,
  showDefaultCheckbox = false,
  showBusinessCheckbox = false,
  layout = 'vertical',
  columns = 2,
  size = 'md',
  variant = 'default',
  countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
  ],
  states = [
    { value: 'AL', label: 'Alabama' },
    { value: 'CA', label: 'California' },
    { value: 'FL', label: 'Florida' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
  ],
  addressTypes = [
    { value: 'billing', label: 'Billing Address' },
    { value: 'shipping', label: 'Shipping Address' },
    { value: 'mailing', label: 'Mailing Address' },
    { value: 'business', label: 'Business Address' },
  ],
  validation = {},
  commerceState = 'none',
  workflowContext,
  aiConfig,
  schema,
  allowedActions = [],
  userRole,
  data,
  onUpdate = () => {},
  auditTrail = { enabled: false, level: 'basic', trackChanges: false, logUserActions: false },
  encryptionLevel = 'none',
  className = '',
  style = {},
  onChange = () => {},
  onValidation = () => {},
  onSubmit = () => {},
}) => {
  const [addressData, setAddressData] = useState<Partial<AddressData>>({
    type: addressType,
    ...defaultValue,
    ...value,
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Handle commerce state based behavior
  const isReadonly = commerceState === 'completion';
  const isDisabled = commerceState === 'settlement' && !allowedActions.includes('edit_address');

  // Update internal data when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setAddressData(prev => ({ ...prev, ...value }));
    }
  }, [value]);

  // Validation rules
  const defaultValidation = {
    required: ['addressLine1', 'city', 'state', 'postalCode', 'country'],
    patterns: {
      postalCode: '^[0-9]{5}(-[0-9]{4})?$',
      email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    },
    ...validation,
  };

  // Validate field
  const validateField = useCallback((fieldName: string, fieldValue: string) => {
    const rules = defaultValidation;
    let error = '';

    // Required validation
    if (rules.required?.includes(fieldName) && !fieldValue?.trim()) {
      error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }

    // Pattern validation
    if (!error && fieldValue && rules.patterns?.[fieldName]) {
      const pattern = new RegExp(rules.patterns[fieldName]);
      if (!pattern.test(fieldValue)) {
        error = `Invalid ${fieldName} format`;
      }
    }

    // Custom validation
    if (!error && fieldValue && rules.customRules?.[fieldName]) {
      const customError = rules.customRules[fieldName](fieldValue);
      if (customError) {
        error = customError;
      }
    }

    return error;
  }, [defaultValidation]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    
    Object.keys(addressData).forEach(fieldName => {
      const error = validateField(fieldName, addressData[fieldName as keyof AddressData] as string);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidation(isValid, newErrors);
    
    return isValid;
  }, [addressData, validateField, onValidation]);

  // Handle field change
  const handleFieldChange = useCallback((fieldName: keyof AddressData, fieldValue: any) => {
    const newData = { ...addressData, [fieldName]: fieldValue };
    setAddressData(newData);
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    // Validate field
    const error = validateField(fieldName, fieldValue);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }));

    // Audit trail logging
    if (auditTrail.enabled && auditTrail.trackChanges) {
      console.log('Address field changed:', {
        action: 'address_field_change',
        field: fieldName,
        oldValue: addressData[fieldName],
        newValue: fieldValue,
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }

    // Call callbacks
    onChange(newData);
    if (onUpdate) {
      onUpdate(newData);
    }
  }, [addressData, validateField, onChange, onUpdate, auditTrail, commerceState, workflowContext, userRole]);

  // Handle blur events
  const handleFieldBlur = useCallback((fieldName: keyof AddressData) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  // Build container classes
  const containerClasses = cn(
    'address-form space-y-4',
    layout === 'compact' && 'space-y-2',
    variant === 'outlined' && 'border border-gray-200 rounded-lg p-4',
    variant === 'filled' && 'bg-gray-50 rounded-lg p-4',
    className
  );

  // Build grid classes
  const gridClasses = cn(
    'grid gap-4',
    layout === 'compact' && 'gap-2',
    columns === 1 && 'grid-cols-1',
    columns === 2 && 'grid-cols-1 md:grid-cols-2',
    columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  );

  // Common input props
  const getInputProps = (fieldName: keyof AddressData, isRequired = false) => ({
    size,
    disabled: isDisabled,
    readonly: isReadonly,
    required: isRequired || defaultValidation.required?.includes(fieldName),
    status: errors[fieldName] && touched[fieldName] ? 'error' as const : 'default' as const,
    errorMessage: errors[fieldName] && touched[fieldName] ? errors[fieldName] : '',
    commerceState,
    allowedActions,
    userRole,
    auditTrail,
    onBlur: () => handleFieldBlur(fieldName),
  });

  return (
    <div className={containerClasses} style={style}>
      {/* Title */}
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {commerceState && (
            <span className="text-xs text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded">
              {commerceState}
            </span>
          )}
        </div>
      )}

      {/* Address Type */}
      {showType && (
        <Select
          id={`${id}-type`}
          name="type"
          label="Address Type"
          value={addressData.type || ''}
          options={addressTypes}
          {...getInputProps('type')}
          onChange={(value) => handleFieldChange('type', value)}
        />
      )}

      {/* Person Name */}
      {showPersonName && (
        <div className={gridClasses}>
          <Input
            id={`${id}-firstName`}
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
            value={addressData.firstName || ''}
            {...getInputProps('firstName')}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
          />
          
          <Input
            id={`${id}-lastName`}
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
            value={addressData.lastName || ''}
            {...getInputProps('lastName')}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
          />
        </div>
      )}

      {/* Company */}
      {showCompany && (
        <Input
          id={`${id}-company`}
          name="company"
          label="Company"
          placeholder="Enter company name"
          value={addressData.company || ''}
          {...getInputProps('company')}
          onChange={(e) => handleFieldChange('company', e.target.value)}
        />
      )}

      {/* Address Lines */}
      <Input
        id={`${id}-addressLine1`}
        name="addressLine1"
        label="Address Line 1"
        placeholder="Enter street address"
        value={addressData.addressLine1 || ''}
        {...getInputProps('addressLine1', true)}
        onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
      />

      <Input
        id={`${id}-addressLine2`}
        name="addressLine2"
        label="Address Line 2 (Optional)"
        placeholder="Apartment, suite, unit, building, floor, etc."
        value={addressData.addressLine2 || ''}
        {...getInputProps('addressLine2')}
        onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
      />

      {/* City, State, Postal Code */}
      <div className={gridClasses}>
        <Input
          id={`${id}-city`}
          name="city"
          label="City"
          placeholder="Enter city"
          value={addressData.city || ''}
          {...getInputProps('city', true)}
          onChange={(e) => handleFieldChange('city', e.target.value)}
        />

        <Select
          id={`${id}-state`}
          name="state"
          label="State/Province"
          placeholder="Select state"
          value={addressData.state || ''}
          options={states}
          {...getInputProps('state', true)}
          onChange={(value) => handleFieldChange('state', value)}
        />

        <Input
          id={`${id}-postalCode`}
          name="postalCode"
          label="Postal Code"
          placeholder="Enter postal code"
          value={addressData.postalCode || ''}
          {...getInputProps('postalCode', true)}
          pattern={defaultValidation.patterns?.postalCode}
          onChange={(e) => handleFieldChange('postalCode', e.target.value)}
        />
      </div>

      {/* Country */}
      <Select
        id={`${id}-country`}
        name="country"
        label="Country"
        placeholder="Select country"
        value={addressData.country || ''}
        options={countries}
        {...getInputProps('country', true)}
        onChange={(value) => handleFieldChange('country', value)}
      />

      {/* Checkboxes */}
      <div className="space-y-2">
        {showDefaultCheckbox && (
          <Checkbox
            id={`${id}-isDefault`}
            name="isDefault"
            label="Set as default address"
            checked={addressData.isDefault || false}
            disabled={isDisabled}
            size={size}
            commerceState={commerceState}
            allowedActions={allowedActions}
            userRole={userRole}
            auditTrail={auditTrail}
            onChange={(checked) => handleFieldChange('isDefault', checked)}
          />
        )}

        {showBusinessCheckbox && (
          <Checkbox
            id={`${id}-isBusinessAddress`}
            name="isBusinessAddress"
            label="This is a business address"
            checked={addressData.isBusinessAddress || false}
            disabled={isDisabled}
            size={size}
            commerceState={commerceState}
            allowedActions={allowedActions}
            userRole={userRole}
            auditTrail={auditTrail}
            onChange={(checked) => handleFieldChange('isBusinessAddress', checked)}
          />
        )}
      </div>

      {/* AI Config Display (development only) */}
      {process.env.NODE_ENV === 'development' && aiConfig && (
        <div className="absolute -top-6 left-0 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
          AI: {JSON.stringify(aiConfig.layout)}
        </div>
      )}
    </div>
  );
};

AddressForm.displayName = 'AddressForm';

export default AddressForm;