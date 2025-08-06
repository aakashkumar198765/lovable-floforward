import React, { useState, useCallback, useEffect } from 'react';
import { CommerceState, ContactData, ContactFormProps } from '../../../types';
import { cn } from '../../../utils/utils';
import Input from '../../atoms/form/Input';
import Select from '../../atoms/form/Select';
import Textarea from '../../atoms/form/Textarea';
import Checkbox from '../../atoms/form/Checkbox';

const ContactForm: React.FC<ContactFormProps> = ({
  id = 'contact-form',
  title = 'Contact Information',
  contactType = 'primary',
  value,
  defaultValue = {},
  required = true,
  showTitle = true,
  showType = false,
  showPrefix = false,
  showMiddleName = false,
  showSuffix = false,
  showJobInfo = false,
  showMultiplePhones = false,
  showSocialLinks = false,
  showPreferences = false,
  showNotes = false,
  showStatusFlags = false,
  layout = 'vertical',
  columns = 2,
  size = 'md',
  variant = 'default',
  isDisabled = false,
  isReadonly = false,
  prefixes = [
    { value: 'Mr', label: 'Mr.' },
    { value: 'Mrs', label: 'Mrs.' },
    { value: 'Ms', label: 'Ms.' },
    { value: 'Dr', label: 'Dr.' },
    { value: 'Prof', label: 'Prof.' },
  ],
  suffixes = [
    { value: 'Jr', label: 'Jr.' },
    { value: 'Sr', label: 'Sr.' },
    { value: 'II', label: 'II' },
    { value: 'III', label: 'III' },
    { value: 'PhD', label: 'PhD' },
    { value: 'MD', label: 'MD' },
  ],
  contactTypes = [
    { value: 'primary', label: 'Primary Contact' },
    { value: 'secondary', label: 'Secondary Contact' },
    { value: 'emergency', label: 'Emergency Contact' },
    { value: 'business', label: 'Business Contact' },
  ],
  contactMethods = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'work', label: 'Work Phone' },
  ],
  timezones = [
    { value: 'EST', label: 'Eastern Time (EST)' },
    { value: 'CST', label: 'Central Time (CST)' },
    { value: 'MST', label: 'Mountain Time (MST)' },
    { value: 'PST', label: 'Pacific Time (PST)' },
    { value: 'UTC', label: 'UTC' },
  ],
  validation = {},
  className = '',
  style = {},
  onChange = () => {},
  onValidation = () => {},
  onSubmit = () => {},
}) => {
  const [contactData, setContactData] = useState<Partial<ContactData>>({
    type: contactType,
    ...defaultValue,
    ...value,
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});


  // Update internal data when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setContactData(prev => ({ ...prev, ...value }));
    }
  }, [value]);

  // Validation rules
  const defaultValidation = {
    required: ['firstName', 'lastName', 'email'],
    patterns: {
      email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      phone: '^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$',
      website: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
      linkedIn: '^https:\\/\\/(www\\.)?linkedin\\.com\\/in\\/[a-zA-Z0-9-]+\\/?$',
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
    
    Object.keys(contactData).forEach(fieldName => {
      const error = validateField(fieldName, contactData[fieldName as keyof ContactData] as string);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidation(isValid, newErrors);
    
    return isValid;
  }, [contactData, validateField, onValidation]);

  // Handle field change
  const handleFieldChange = useCallback((fieldName: keyof ContactData, fieldValue: any) => {
    const newData = { ...contactData, [fieldName]: fieldValue };
    setContactData(newData);
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    // Validate field
    const error = validateField(fieldName, fieldValue);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }));

    // Call callbacks
    onChange(newData);
  }, [contactData, validateField, onChange]);

  // Handle blur events
  const handleFieldBlur = useCallback((fieldName: keyof ContactData) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  // Build container classes
  const containerClasses = cn(
    'contact-form space-y-4',
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
  const getInputProps = (fieldName: keyof ContactData, isRequired = false) => ({
    size,
    disabled: isDisabled,
    readonly: isReadonly,
    required: isRequired || defaultValidation.required?.includes(fieldName),
    status: errors[fieldName] && touched[fieldName] ? 'error' as const : 'default' as const,
    errorMessage: errors[fieldName] && touched[fieldName] ? errors[fieldName] : '',
    onBlur: () => handleFieldBlur(fieldName),
  });

  return (
    <div className={containerClasses} style={style}>
      {/* Title */}
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}

      {/* Contact Type */}
      {showType && (
        <Select
          id={`${id}-type`}
          name="type"
          label="Contact Type"
          value={contactData.type || ''}
          options={contactTypes}
          {...getInputProps('type')}
          onChange={(value) => handleFieldChange('type', value)}
        />
      )}

      {/* Name Fields */}
      <div className={gridClasses}>
        {showPrefix && (
          <Select
            id={`${id}-prefix`}
            name="prefix"
            label="Prefix"
            value={contactData.prefix || ''}
            options={prefixes}
            {...getInputProps('prefix')}
            onChange={(value) => handleFieldChange('prefix', value)}
          />
        )}

        <Input
          id={`${id}-firstName`}
          name="firstName"
          label="First Name"
          placeholder="Enter first name"
          value={contactData.firstName || ''}
          {...getInputProps('firstName', true)}
          onChange={(e) => handleFieldChange('firstName', e.target.value)}
        />

        {showMiddleName && (
          <Input
            id={`${id}-middleName`}
            name="middleName"
            label="Middle Name"
            placeholder="Enter middle name"
            value={contactData.middleName || ''}
            {...getInputProps('middleName')}
            onChange={(e) => handleFieldChange('middleName', e.target.value)}
          />
        )}

        <Input
          id={`${id}-lastName`}
          name="lastName"
          label="Last Name"
          placeholder="Enter last name"
          value={contactData.lastName || ''}
          {...getInputProps('lastName', true)}
          onChange={(e) => handleFieldChange('lastName', e.target.value)}
        />

        {showSuffix && (
          <Select
            id={`${id}-suffix`}
            name="suffix"
            label="Suffix"
            value={contactData.suffix || ''}
            options={suffixes}
            {...getInputProps('suffix')}
            onChange={(value) => handleFieldChange('suffix', value)}
          />
        )}
      </div>

      {/* Job Information */}
      {showJobInfo && (
        <div className={gridClasses}>
          <Input
            id={`${id}-jobTitle`}
            name="jobTitle"
            label="Job Title"
            placeholder="Enter job title"
            value={contactData.jobTitle || ''}
            {...getInputProps('jobTitle')}
            onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
          />

          <Input
            id={`${id}-department`}
            name="department"
            label="Department"
            placeholder="Enter department"
            value={contactData.department || ''}
            {...getInputProps('department')}
            onChange={(e) => handleFieldChange('department', e.target.value)}
          />

          <Input
            id={`${id}-company`}
            name="company"
            label="Company"
            placeholder="Enter company name"
            value={contactData.company || ''}
            {...getInputProps('company')}
            onChange={(e) => handleFieldChange('company', e.target.value)}
          />
        </div>
      )}

      {/* Contact Information */}
      <div className={gridClasses}>
        <Input
          id={`${id}-email`}
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter email address"
          value={contactData.email || ''}
          {...getInputProps('email', true)}
          pattern={defaultValidation.patterns?.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
        />

        <Input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="Enter phone number"
          value={contactData.phone || ''}
          {...getInputProps('phone')}
          pattern={defaultValidation.patterns?.phone}
          onChange={(e) => handleFieldChange('phone', e.target.value)}
        />
      </div>

      {/* Multiple Phone Numbers */}
      {showMultiplePhones && (
        <div className={gridClasses}>
          <Input
            id={`${id}-mobilePhone`}
            name="mobilePhone"
            type="tel"
            label="Mobile Phone"
            placeholder="Enter mobile number"
            value={contactData.mobilePhone || ''}
            {...getInputProps('mobilePhone')}
            pattern={defaultValidation.patterns?.phone}
            onChange={(e) => handleFieldChange('mobilePhone', e.target.value)}
          />

          <Input
            id={`${id}-workPhone`}
            name="workPhone"
            type="tel"
            label="Work Phone"
            placeholder="Enter work number"
            value={contactData.workPhone || ''}
            {...getInputProps('workPhone')}
            pattern={defaultValidation.patterns?.phone}
            onChange={(e) => handleFieldChange('workPhone', e.target.value)}
          />

          <Input
            id={`${id}-fax`}
            name="fax"
            type="tel"
            label="Fax"
            placeholder="Enter fax number"
            value={contactData.fax || ''}
            {...getInputProps('fax')}
            pattern={defaultValidation.patterns?.phone}
            onChange={(e) => handleFieldChange('fax', e.target.value)}
          />
        </div>
      )}

      {/* Social Links */}
      {showSocialLinks && (
        <div className={gridClasses}>
          <Input
            id={`${id}-website`}
            name="website"
            type="url"
            label="Website"
            placeholder="https://example.com"
            value={contactData.website || ''}
            {...getInputProps('website')}
            pattern={defaultValidation.patterns?.website}
            onChange={(e) => handleFieldChange('website', e.target.value)}
          />

          <Input
            id={`${id}-linkedIn`}
            name="linkedIn"
            type="url"
            label="LinkedIn Profile"
            placeholder="https://linkedin.com/in/username"
            value={contactData.linkedIn || ''}
            {...getInputProps('linkedIn')}
            pattern={defaultValidation.patterns?.linkedIn}
            onChange={(e) => handleFieldChange('linkedIn', e.target.value)}
          />
        </div>
      )}

      {/* Preferences */}
      {showPreferences && (
        <div className={gridClasses}>
          <Select
            id={`${id}-preferredContact`}
            name="preferredContact"
            label="Preferred Contact Method"
            value={contactData.preferredContact || ''}
            options={contactMethods}
            {...getInputProps('preferredContact')}
            onChange={(value) => handleFieldChange('preferredContact', value)}
          />

          <Select
            id={`${id}-timezone`}
            name="timezone"
            label="Timezone"
            value={contactData.timezone || ''}
            options={timezones}
            {...getInputProps('timezone')}
            onChange={(value) => handleFieldChange('timezone', value)}
          />
        </div>
      )}

      {/* Notes */}
      {showNotes && (
        <Textarea
          id={`${id}-notes`}
          name="notes"
          label="Notes"
          placeholder="Additional notes about this contact..."
          value={contactData.notes || ''}
          rows={3}
          {...getInputProps('notes')}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
        />
      )}

      {/* Status Flags */}
      {showStatusFlags && (
        <div className="space-y-2">
          <Checkbox
            id={`${id}-isPrimary`}
            name="isPrimary"
            label="Primary contact"
            checked={contactData.isPrimary || false}
            disabled={isDisabled}
            size={size}
            onChange={(checked) => handleFieldChange('isPrimary', checked)}
          />

          <Checkbox
            id={`${id}-isActive`}
            name="isActive"
            label="Active contact"
            checked={contactData.isActive !== false}
            disabled={isDisabled}
            size={size}
            onChange={(checked) => handleFieldChange('isActive', checked)}
          />
        </div>
      )}
    </div>
  );
};

ContactForm.displayName = 'ContactForm';

export default ContactForm;