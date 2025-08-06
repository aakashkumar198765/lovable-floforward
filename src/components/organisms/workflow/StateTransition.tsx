import React, { useState, useCallback, useMemo } from 'react';
import { StateTransitionProps } from '../../../types';
import Button from '../../atoms/form/Button';
import Select from '../../atoms/form/Select';
import Badge from '../../atoms/display/Badge';
import Icon from '../../atoms/display/Icon';
import Tooltip from '../../atoms/display/Tooltip';
import Modal from '../../atoms/feedback/Modal';
import Alert from '../../atoms/feedback/Alert';
import Toast from '../../atoms/feedback/Toast';
import { cn } from '../../../utils/utils';

const StateTransition: React.FC<StateTransitionProps> = ({
  id = 'state-transition',
  currentState = '',
  availableStates = [],
  transitions = [],
  layout = 'buttons',
  size = 'md',
  showHistory = true,
  showValidation = true,
  confirmTransitions = true,
  userRole,
  className = '',
  style = {},
  onStateChange,
  onValidate,
  allowedActions = [],
  exportable = true,
  importable = true
}) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [stateHistory, setStateHistory] = useState<Array<{
    from: string;
    to: string;
    timestamp: string;
    user: string;
  }>>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    show: false, message: '', type: 'info'
  });

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  }, []);

  // Get current state info
  const currentStateInfo = useMemo(() => {
    return availableStates.find(state => state.key === currentState);
  }, [availableStates, currentState]);

  // Get available transitions from current state
  const availableTransitions = useMemo(() => {
    return transitions.filter(transition => transition.from === currentState);
  }, [transitions, currentState]);

  // Get states that can be transitioned to
  const transitionableStates = useMemo(() => {
    const transitionableKeys = availableTransitions.map(t => t.to!);
    return availableStates.filter(state => 
      transitionableKeys.includes(state.key!) && 
      !state.disabled &&
      (!state.requiredPermissions?.length || 
       state.requiredPermissions.some(perm => allowedActions.includes(perm)
       ))
    );
  }, [availableTransitions, availableStates, allowedActions]);

  // Check if a transition is valid
  const isTransitionValid = useCallback(async (fromState: string, toState: string) => {
    const transition = transitions.find(t => t.from === fromState && t.to === toState);
    if (!transition) return false;

    // Check conditions
    // if (transition.conditions && transition.conditions.length > 0) {
    //   const contextData = { ...workflowContext?.data, commerceState };
      
    //   for (const condition of transition.conditions) {
    //     const fieldValue = contextData[condition.field!];
        
    //     switch (condition.operator) {
    //       case 'eq':
    //         if (fieldValue !== condition.value) return false;
    //         break;
    //       case 'ne':
    //         if (fieldValue === condition.value) return false;
    //         break;
    //       case 'gt':
    //         if (Number(fieldValue) <= Number(condition.value)) return false;
    //         break;
    //       case 'lt':
    //         if (Number(fieldValue) >= Number(condition.value)) return false;
    //         break;
    //       case 'gte':
    //         if (Number(fieldValue) < Number(condition.value)) return false;
    //         break;
    //       case 'lte':
    //         if (Number(fieldValue) > Number(condition.value)) return false;
    //         break;
    //       case 'in':
    //         if (!Array.isArray(condition.value) || !condition.value.includes(fieldValue)) return false;
    //         break;
    //       case 'notin':
    //         if (Array.isArray(condition.value) && condition.value.includes(fieldValue)) return false;
    //         break;
    //     }
    //   }
    // }

    // Custom validation
    if (showValidation && onValidate) {
      try {
        return await onValidate(toState);
      } catch (error) {
        console.error('Validation failed:', error);
        return false;
      }
    }

    return true;
  }, [transitions, showValidation, onValidate]);

  // Handle state transition
  const handleStateTransition = useCallback(async (toState: string, skipConfirmation = false) => {
    if (!toState || toState === currentState) return;

    // Validate transition
    setIsValidating(true);
    setValidationErrors([]);
    
    try {
      const isValid = await isTransitionValid(currentState, toState);
      
      if (!isValid) {
        setValidationErrors(['This state transition is not allowed at this time']);
        setIsValidating(false);
        showToast('Invalid state transition', 'error');
        return;
      }
      
      setIsValidating(false);

      // Show confirmation if required
      if (confirmTransitions && !skipConfirmation) {
        setSelectedState(toState);
        setShowConfirmModal(true);
        return;
      }

      // Update history
      setStateHistory(prev => [...prev, {
        from: currentState,
        to: toState,
        timestamp: new Date().toISOString(),
        user: userRole?.name || userRole?.id || 'Unknown',
      }]);

      // Call transition handler
      onStateChange?.(currentState, toState);
      
      showToast(`State changed to ${availableStates.find(s => s.key === toState)?.label || toState}`, 'success');
      
      // Close confirmation modal
      setShowConfirmModal(false);
      setSelectedState('');

    } catch (error) {
      setIsValidating(false);
      console.error('State transition failed:', error);
      showToast('State transition failed', 'error');
    }
  }, [currentState, isTransitionValid, confirmTransitions, userRole, onStateChange, availableStates, showToast]);

  // Render state badge
  const renderStateBadge = useCallback((state: any, isActive = false) => {
    const variant = isActive ? 'primary' : 
      state.key === 'completed' ? 'success' :
      state.key === 'failed' || state.key === 'rejected' ? 'danger' :
      state.key === 'pending' || state.key === 'draft' ? 'warning' : 'secondary';

    return (
      <Badge
        variant={variant}
        size={size === 'sm' ? 'xs' : 'sm'}
        className={cn(
          'flex items-center gap-1',
          isActive && 'ring-2 ring-blue-500'
        )}
      >
        {state.icon}
        <span>{state.label}</span>
      </Badge>
    );
  }, [size]);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Render based on layout
  if (layout === 'diagram') {
    return (
      <div 
        className={cn(
          'rounded-lg border p-4',
          sizeClasses[size],
          className
        )}
        style={style}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">State Flow Diagram</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Current State:</span>
            {currentStateInfo && renderStateBadge(currentStateInfo, true)}
          </div>
        </div>

        {/* State Flow Diagram */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableStates.map((state, index) => {
              const isActive = state.key === currentState;
              const canTransitionTo = transitionableStates.some(s => s.key === state.key);
              
              return (
                <div
                  key={state.key}
                  className={cn(
                    'relative rounded-lg border-2 p-3 text-center cursor-pointer transition-all',
                    isActive && 'border-blue-500 bg-blue-50',
                    canTransitionTo && !isActive && 'border-green-300 bg-green-50 hover:border-green-500',
                    !isActive && !canTransitionTo && 'border-gray-200 bg-gray-50 opacity-60'
                  )}
                  onClick={() => canTransitionTo && handleStateTransition(state.key!)}
                >
                  <div className="flex flex-col items-center gap-2">
                    {state.icon && <div className="text-2xl">{state.icon}</div>}
                    <div className="font-medium">{state.label}</div>
                    {state.description && (
                      <div className="text-xs text-gray-600">{state.description}</div>
                    )}
                  </div>
                  
                  {isActive && (
                    <div className="absolute -top-1 -right-1">
                      <Badge variant="primary" size="xs">Current</Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Transition Arrows */}
          <div className="absolute inset-0 pointer-events-none">
            {availableTransitions.map((transition, index) => {
              const fromState = availableStates.find(s => s.key === transition.from);
              const toState = availableStates.find(s => s.key === transition.to);
              
              return (
                <Tooltip
                  key={`transition-${index}`}
                  content={`${fromState?.label} → ${toState?.label}`}
                >
                  <Icon
                    name="arrow-right"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400"
                  />
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'timeline') {
    return (
      <div 
        className={cn(
          'rounded-lg border',
          sizeClasses[size],
          className
        )}
        style={style}
      >
        {/* Header */}
        <div className="border-b bg-gray-50 p-4">
          <h3 className="text-lg font-semibold">State Timeline</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-600">Current:</span>
            {currentStateInfo && renderStateBadge(currentStateInfo, true)}
          </div>
        </div>

        {/* Timeline */}
        <div className="p-4">
          <div className="space-y-4">
            {stateHistory.map((entry, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="arrow-right" size="xs" className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {renderStateBadge(availableStates.find(s => s.key === entry.from) || { key: entry.from, label: entry.from })}
                    <Icon name="arrow-right" size="xs" className="text-gray-400" />
                    {renderStateBadge(availableStates.find(s => s.key === entry.to) || { key: entry.to, label: entry.to })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(entry.timestamp).toLocaleString()} by {entry.user}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Available Transitions */}
          {transitionableStates.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">Available Transitions</h4>
              <div className="flex flex-wrap gap-2">
                {transitionableStates.map(state => (
                  <Button
                    key={state.key}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleStateTransition(state.key!)}
                    iconLeft={state.icon}
                    disabled={isValidating}
                  >
                    Move to {state.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (layout === 'dropdown') {
    return (
      <div 
        className={cn(
          'rounded-lg border p-4',
          sizeClasses[size],
          className
        )}
        style={style}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Current State:</span>
            {currentStateInfo && renderStateBadge(currentStateInfo, true)}
          </div>
          
          {transitionableStates.length > 0 && (
            <Select
              placeholder="Change state to..."
              value=""
              options={transitionableStates.map(state => ({
                value: state.key!,
                label: state.label!,
                icon: state.icon,
              }))}
              onChange={(value) => handleStateTransition(value as string)}
              disabled={isValidating}
              size={size}
            />
          )}
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-4">
            {validationErrors.map((error, index) => (
              <Alert
                key={index}
                variant="error"
                description={error}
                size="sm"
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default: Buttons layout
  return (
    <div 
      className={cn(
        'rounded-lg border',
        sizeClasses[size],
        className
      )}
      style={style}
    >
      {/* Header */}
      <div className="border-b bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">State Management</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">Current:</span>
              {currentStateInfo && renderStateBadge(currentStateInfo, true)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {exportable && <Button
              variant="primary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            >
              Export
            </Button>}
            {importable && <Button
              variant="primary"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white border-green-600"
            >
              Import
            </Button>}
            {currentStateInfo?.description && (
              <Tooltip content={currentStateInfo.description}>
                <Icon name="info" className="text-gray-400" />
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* State Transition Buttons */}
      <div className="p-4">
        {transitionableStates.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Available Actions:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {transitionableStates.map(state => (
                <Button
                  key={state.key}
                  variant={
                    state.key === 'approved' || state.key === 'completed' ? 'primary' :
                    state.key === 'rejected' || state.key === 'cancelled' ? 'danger' :
                    'secondary'
                  }
                  size={size}
                  onClick={() => handleStateTransition(state.key!)}
                  iconLeft={state.icon}
                  disabled={isValidating || state.disabled}
                  fullWidth
                  className="justify-start"
                >
                  <div className="flex flex-col items-start">
                    <span>{state.label}</span>
                    {state.description && (
                      <span className="text-xs opacity-75">{state.description}</span>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Icon name="lock" size="lg" className="mx-auto mb-2 opacity-50" />
            <p>No state transitions available</p>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-4 space-y-2">
            {validationErrors.map((error, index) => (
              <Alert
                key={index}
                variant="error"
                description={error}
                size="sm"
              />
            ))}
          </div>
        )}
      </div>

      {/* State History */}
      {showHistory && stateHistory.length > 0 && (
        <div className="border-t bg-gray-50 p-4">
          <h4 className="font-medium mb-3">Recent Changes</h4>
          <div className="space-y-2">
            {stateHistory.slice(-5).map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Icon name="clock" size="xs" className="text-gray-400" />
                <span className="text-gray-600">{new Date(entry.timestamp).toLocaleString()}</span>
                <span>Changed from</span>
                <Badge size="xs" variant="secondary">{entry.from}</Badge>
                <span>to</span>
                <Badge size="xs" variant="secondary">{entry.to}</Badge>
                <span className="text-gray-500">by {entry.user}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedState('');
        }}
        title="Confirm State Transition"
        size="md"
      >
        <div className="space-y-4">
          <p>Are you sure you want to change the state?</p>
          
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            {currentStateInfo && renderStateBadge(currentStateInfo)}
            <Icon name="arrow-right" className="text-gray-400" />
            {renderStateBadge(availableStates.find(s => s.key === selectedState) || { key: selectedState, label: selectedState })}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowConfirmModal(false);
                setSelectedState('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleStateTransition(selectedState, true)}
              disabled={isValidating}
            >
              {isValidating ? 'Validating...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          title={toast.type === 'success' ? 'Success' : 
                toast.type === 'error' ? 'Error' : 
                toast.type === 'warning' ? 'Warning' : 'Info'}
          description={toast.message}
          variant={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          position="bottom-right"
        />
      )}
    </div>
  );
};

export default StateTransition;