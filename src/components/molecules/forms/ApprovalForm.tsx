import React, { useState, useCallback, useEffect } from 'react';
import { ApprovalData, ApprovalFormProps, CommerceState } from '../../../types';
import { cn } from '../../../utils/utils';
import Textarea from '../../atoms/form/Textarea';
import Button from '../../atoms/form/Button';
import Checkbox from '../../atoms/form/Checkbox';
import Badge from '../../atoms/display/Badge';
import { Input, Select } from '../../atoms/form';

const ApprovalForm: React.FC<ApprovalFormProps> = ({
  id = 'approval-form',
  title = 'Approval Request',
  mode = 'create',
  value,
  defaultValue = {},
  currentUser = '',
  currentUserRole = '',
  showTitle = true,
  showAmount = true,
  showAttachments = true,
  showApprovalFlow = true,
  showSignatureOption = true,
  showUrgentOption = true,
  enableComments = true,
  layout = 'vertical',
  columns = 2,
  size = 'md',
  variant = 'default',
  requestTypes = [
    { value: 'purchase', label: 'Purchase Request' },
    { value: 'expense', label: 'Expense Approval' },
    { value: 'budget', label: 'Budget Approval' },
    { value: 'contract', label: 'Contract Approval' },
    { value: 'hiring', label: 'Hiring Request' },
    { value: 'custom', label: 'Custom Request' },
  ],
  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ],
  departments = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'operations', label: 'Operations' },
  ],
  approvers = [
    { value: 'manager1', label: 'John Smith (Manager)', level: 1 },
    { value: 'director1', label: 'Jane Doe (Director)', level: 2 },
    { value: 'vp1', label: 'Bob Johnson (VP)', level: 3 },
    { value: 'ceo', label: 'Alice Wilson (CEO)', level: 4 },
  ],
  currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD ($)' },
  ],
  approvalLevels = [
    { level: 1, name: 'Manager Approval', approvers: ['manager1'] },
    { level: 2, name: 'Director Approval', approvers: ['director1'] },
    { level: 3, name: 'VP Approval', approvers: ['vp1'] },
    { level: 4, name: 'Executive Approval', approvers: ['ceo'] },
  ],
  validation = {},
  className = '',
  style = {},
  onChange = () => {},
  onValidation = () => {},
  onSubmit = () => {},
  onApprove = () => {},
  onReject = () => {},
  onDelegate = () => {},
  onWithdraw = () => {},
}) => {
  const [approvalData, setApprovalData] = useState<Partial<ApprovalData>>({
    requestedBy: currentUser,
    requestedDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    approvalLevel: 1,
    maxApprovalLevel: 4,
    ...defaultValue,
    ...value,
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [actionComments, setActionComments] = useState('');

  // Handle form state
  const isReadonly = mode === 'view';
  const canApprove = mode === 'review';
  const canReject = mode === 'review';
  const canDelegate = mode === 'review';
  const canWithdraw = mode === 'create' && approvalData.status === 'pending' && approvalData.requestedBy === currentUser;

  // Update internal data when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setApprovalData(prev => ({ ...prev, ...value }));
    }
  }, [value]);

  // Validation rules
  const defaultValidation = {
    required: ['requestTitle', 'requestType', 'priority', 'description', 'justification', 'department'],
    patterns: {
      amount: '^[0-9]+(\\.[0-9]{1,2})?$',
      email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    },
    ...validation,
  };

  // Get required fields based on mode and request type
  const getRequiredFields = useCallback(() => {
    let required = [...defaultValidation.required];
    
    if (showAmount && approvalData.requestType !== 'hiring') {
      required.push('amount', 'currency');
    }
    
    if (mode === 'review' && enableComments) {
      required.push('comments');
    }
    
    return required;
  }, [defaultValidation.required, showAmount, approvalData.requestType, mode, enableComments]);

  // Validate field
  const validateField = useCallback((fieldName: string, fieldValue: any) => {
    const rules = defaultValidation;
    const requiredFields = getRequiredFields();
    let error = '';

    // Required validation
    if (requiredFields.includes(fieldName) && (!fieldValue || fieldValue === '')) {
      error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
    }

    // Pattern validation
    if (!error && fieldValue && rules.patterns?.[fieldName]) {
      const pattern = new RegExp(rules.patterns[fieldName]);
      if (!pattern.test(String(fieldValue))) {
        error = `Invalid ${fieldName} format`;
      }
    }

    // Amount validation
    if (!error && fieldName === 'amount' && fieldValue) {
      const amount = parseFloat(fieldValue);
      if (isNaN(amount) || amount <= 0) {
        error = 'Amount must be a positive number';
      }
    }

    // Custom validation
    if (!error && fieldValue && rules.customRules?.[fieldName]) {
      const customError = rules.customRules[fieldName](String(fieldValue));
      if (customError) {
        error = customError;
      }
    }

    return error;
  }, [defaultValidation, getRequiredFields]);

  // Handle field change
  const handleFieldChange = useCallback((fieldName: keyof ApprovalData, fieldValue: any) => {
    const newData = { ...approvalData, [fieldName]: fieldValue };
    setApprovalData(newData);
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    // Auto-calculate approval levels based on amount
    if (fieldName === 'amount' && showAmount) {
      const amount = parseFloat(fieldValue);
      let requiredLevel = 1;
      
      if (amount > 100000) requiredLevel = 4;
      else if (amount > 50000) requiredLevel = 3;
      else if (amount > 10000) requiredLevel = 2;
      
      newData.maxApprovalLevel = requiredLevel;
    }

    // Validate field
    const error = validateField(fieldName, fieldValue);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }));

    // Call callbacks
    onChange(newData);
  }, [approvalData, validateField, onChange, showAmount]);

  // Handle approval actions
  const handleApprovalAction = useCallback((action: 'approve' | 'reject' | 'delegate' | 'withdraw', delegateUser?: string) => {
    const actionData = { ...approvalData, comments: actionComments };

    switch (action) {
      case 'approve':
        onApprove(actionData as ApprovalData, actionComments);
        break;
      case 'reject':
        onReject(actionData as ApprovalData, actionComments);
        break;
      case 'delegate':
        if (delegateUser) {
          onDelegate(actionData as ApprovalData, delegateUser);
        }
        break;
      case 'withdraw':
        onWithdraw(actionData as ApprovalData);
        break;
    }
    
    setActionComments('');
  }, [approvalData, actionComments, onApprove, onReject, onDelegate, onWithdraw]);

  // Build container classes
  const containerClasses = cn(
    'approval-form space-y-6',
    layout === 'compact' && 'space-y-3',
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
  const getInputProps = (fieldName: string, isRequired = false) => ({
    size,
    disabled: isReadonly,
    readonly: isReadonly,
    required: isRequired || getRequiredFields().includes(fieldName),
    status: errors[fieldName] && touched[fieldName] ? 'error' as const : 'default' as const,
    errorMessage: errors[fieldName] && touched[fieldName] ? errors[fieldName] : '',
    onBlur: () => setTouched(prev => ({ ...prev, [fieldName]: true })),
  });

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  // Get priority badge variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className={containerClasses} style={style}>
      {/* Title and Status */}
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
            {approvalData.status && (
              <Badge variant={getStatusVariant(approvalData.status)}>
                {approvalData.status.charAt(0).toUpperCase() + approvalData.status.slice(1)}
              </Badge>
            )}
            {approvalData.priority && (
              <Badge variant={getPriorityVariant(approvalData.priority)}>
                {approvalData.priority.charAt(0).toUpperCase() + approvalData.priority.slice(1)} Priority
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Request Details</h4>
        
        <div className={gridClasses}>
          <Input
            id={`${id}-requestTitle`}
            name="requestTitle"
            label="Request Title"
            placeholder="Enter request title"
            value={approvalData.requestTitle || ''}
            {...getInputProps('requestTitle', true)}
            onChange={(e) => handleFieldChange('requestTitle', e.target.value)}
          />

          <Select
            id={`${id}-requestType`}
            name="requestType"
            label="Request Type"
            value={approvalData.requestType || ''}
            options={requestTypes}
            {...getInputProps('requestType', true)}
            onChange={(value) => handleFieldChange('requestType', value)}
          />

          <Select
            id={`${id}-priority`}
            name="priority"
            label="Priority"
            value={approvalData.priority || ''}
            options={priorities}
            {...getInputProps('priority', true)}
            onChange={(value) => handleFieldChange('priority', value)}
          />

          <Select
            id={`${id}-department`}
            name="department"
            label="Department"
            value={approvalData.department || ''}
            options={departments}
            {...getInputProps('department', true)}
            onChange={(value) => handleFieldChange('department', value)}
          />
        </div>

        {/* Amount and Currency */}
        {showAmount && (
          <div className={gridClasses}>
            <Input
              id={`${id}-amount`}
              name="amount"
              type="number"
              label="Amount"
              placeholder="0.00"
              value={approvalData.amount || ''}
              min="0"
              step="0.01"
              {...getInputProps('amount', true)}
              onChange={(e) => handleFieldChange('amount', e.target.value)}
            />

            <Select
              id={`${id}-currency`}
              name="currency"
              label="Currency"
              value={approvalData.currency || 'USD'}
              options={currencies}
              {...getInputProps('currency', true)}
              onChange={(value) => handleFieldChange('currency', value)}
            />
          </div>
        )}

        {/* Description and Justification */}
        <Textarea
          id={`${id}-description`}
          name="description"
          label="Description"
          placeholder="Provide a detailed description of the request..."
          value={approvalData.description || ''}
          rows={3}
          {...getInputProps('description', true)}
          onChange={(e) => handleFieldChange('description', e.target.value)}
        />

        <Textarea
          id={`${id}-justification`}
          name="justification"
          label="Business Justification"
          placeholder="Explain why this request is necessary and how it benefits the business..."
          value={approvalData.justification || ''}
          rows={3}
          {...getInputProps('justification', true)}
          onChange={(e) => handleFieldChange('justification', e.target.value)}
        />

        {/* Required Date */}
        <Input
          id={`${id}-requiredBy`}
          name="requiredBy"
          type="date"
          label="Required By Date (Optional)"
          value={approvalData.requiredBy || ''}
          {...getInputProps('requiredBy')}
          onChange={(e) => handleFieldChange('requiredBy', e.target.value)}
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-800">Request Options</h4>
        
        {showSignatureOption && (
          <Checkbox
            id={`${id}-requiresSignature`}
            name="requiresSignature"
            label="This request requires digital signature"
            checked={approvalData.requiresSignature || false}
            disabled={isReadonly}
            size={size}
            onChange={(checked) => handleFieldChange('requiresSignature', checked)}
          />
        )}

        {showUrgentOption && (
          <Checkbox
            id={`${id}-urgentApproval`}
            name="urgentApproval"
            label="Request urgent approval (may skip approval levels)"
            checked={approvalData.urgentApproval || false}
            disabled={isReadonly}
            size={size}
            onChange={(checked) => handleFieldChange('urgentApproval', checked)}
          />
        )}

        <Checkbox
          id={`${id}-notifyOnDecision`}
          name="notifyOnDecision"
          label="Notify me when a decision is made"
          checked={approvalData.notifyOnDecision !== false}
          disabled={isReadonly}
          size={size}
          onChange={(checked) => handleFieldChange('notifyOnDecision', checked)}
        />
      </div>

      {/* Approval Flow */}
      {showApprovalFlow && (
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-800">Approval Flow</h4>
          
          <div className="space-y-2">
            {approvalLevels.slice(0, approvalData.maxApprovalLevel).map((level) => (
              <div
                key={level.level}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border',
                  level.level === approvalData.approvalLevel ? 'border-primary-200 bg-primary-50' : 'border-gray-200',
                  (level.level !== undefined && level.level < (approvalData.approvalLevel || 1)) ? 'border-green-200 bg-green-50' : ''
                )}
              >
                <div>
                  <span className="font-medium">Level {level.level}: {level.name}</span>
                  <div className="text-sm text-gray-600">
                    Approvers: {(level.approvers || []).map(approverId => {
                      const approver = approvers.find(a => a.value === approverId);
                      return approver?.label || approverId;
                    }).join(', ')}
                  </div>
                </div>
                
                <div>
                  {(level.level !== undefined && level.level < (approvalData.approvalLevel || 1)) && (
                    <Badge variant="success">Approved</Badge>
                  )}
                  {level.level === approvalData.approvalLevel && approvalData.status === 'pending' && (
                    <Badge variant="warning">Pending</Badge>
                  )}
                  {(level.level !== undefined && level.level > (approvalData.approvalLevel || 1)) && (
                    <Badge variant="secondary">Waiting</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Actions */}
      {mode === 'review' && enableComments && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Review Comments</h4>
          
          <Textarea
            id={`${id}-actionComments`}
            name="actionComments"
            label="Comments"
            placeholder="Add your comments about this request..."
            value={actionComments}
            rows={3}
            size={size}
            disabled={isReadonly}
            required
            onChange={(e) => setActionComments(e.target.value)}
          />

          <div className="flex gap-3">
            {canApprove && (
              <Button
                variant="success"
                size={size}
                onClick={() => handleApprovalAction('approve')}
                disabled={!actionComments.trim()}
              >
                Approve
              </Button>
            )}
            
            {canReject && (
              <Button
                variant="danger"
                size={size}
                onClick={() => handleApprovalAction('reject')}
                disabled={!actionComments.trim()}
              >
                Reject
              </Button>
            )}
            
            {canDelegate && (
              <Button
                variant="secondary"
                size={size}
                onClick={() => handleApprovalAction('delegate', 'manager1')}
                disabled={!actionComments.trim()}
              >
                Delegate
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Submit/Withdraw Actions */}
      {mode === 'create' && (
        <div className="flex gap-3">
          <Button
            variant="primary"
            size={size}
            onClick={() => onSubmit(approvalData as ApprovalData)}
            disabled={Object.keys(errors).length > 0}
          >
            Submit Request
          </Button>
          
          {canWithdraw && (
            <Button
              variant="tertiary"
              size={size}
              onClick={() => handleApprovalAction('withdraw')}
            >
              Withdraw Request
            </Button>
          )}
        </div>
      )}

    </div>
  );
};

ApprovalForm.displayName = 'ApprovalForm';

export default ApprovalForm;