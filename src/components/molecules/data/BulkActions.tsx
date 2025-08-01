import React, { useState, useCallback, useEffect } from 'react';
import { BulkActionsProps, BulkAction } from '../../../types';
import { cn } from '../../../utils/cn';
import Button from '../../atoms/form/Button';
import Select from '../../atoms/form/Select';
import Checkbox from '../../atoms/form/Checkbox';
import Modal from '../../atoms/feedback/Modal';

const BulkActions: React.FC<BulkActionsProps> = ({
  id = 'bulk-actions',
  actions = [],
  selectedItems = [],
  totalItems = 0,
  showSelectAll = true,
  showSelectionCount = true,
  showItemsSelected = true,
  selectAllText = 'Select All',
  deselectAllText = 'Deselect All',
  itemsSelectedText = 'items selected',
  noActionsText = 'No actions available',
  layout = 'horizontal',
  size = 'md',
  variant = 'default',
  position = 'top',
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
  onAction = () => {},
  onSelectAll = () => {},
  onDeselectAll = () => {},
  onSelectionChange = () => {},
}) => {
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Handle commerce state based behavior
  const isReadonly = commerceState === 'completion';
  const isDisabled = commerceState === 'settlement' && !allowedActions.includes('bulk_actions');

  // Update all selected state
  useEffect(() => {
    setIsAllSelected(selectedItems.length === totalItems && totalItems > 0);
  }, [selectedItems.length, totalItems]);

  // Filter available actions based on permissions and state
  const availableActions = actions.filter(action => {
    if (action.disabled || isDisabled || isReadonly) return false;
    if (action.permissions && action.permissions.length > 0) {
      return action.permissions.some(permission => allowedActions.includes(permission));
    }
    return true;
  });

  // Check if action is enabled based on selection
  const isActionEnabled = useCallback((action: BulkAction) => {
    if (action.disabled || isDisabled || isReadonly) return false;
    
    if (action.requiresSelection !== false && selectedItems.length === 0) return false;
    
    if (action.minSelection && selectedItems.length < action.minSelection) return false;
    
    if (action.maxSelection && selectedItems.length > action.maxSelection) return false;
    
    return true;
  }, [selectedItems.length, isDisabled, isReadonly]);

  // Handle action execution
  const handleAction = useCallback((action: BulkAction) => {
    if (!isActionEnabled(action)) return;

    // Audit trail logging
    if (auditTrail.enabled && auditTrail.logUserActions) {
      console.log('Bulk action initiated:', {
        action: 'bulk_action_initiated',
        actionKey: action.key,
        selectedItems,
        selectedCount: selectedItems.length,
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }

    if (action.confirmRequired) {
      setConfirmAction(action);
    } else {
      executeAction(action);
    }
  }, [selectedItems, isActionEnabled, auditTrail, commerceState, workflowContext, userRole]);

  // Execute action after confirmation
  const executeAction = useCallback((action: BulkAction) => {
    action.key && onAction(action.key, selectedItems);
    
    // Audit trail logging
    if (auditTrail.enabled && auditTrail.logUserActions) {
      console.log('Bulk action executed:', {
        action: 'bulk_action_executed',
        actionKey: action.key,
        selectedItems,
        selectedCount: selectedItems.length,
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }

    if (onUpdate) {
      onUpdate({ action: action.key, selectedItems });
    }

    setConfirmAction(null);
  }, [selectedItems, onAction, onUpdate, auditTrail, commerceState, workflowContext, userRole]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onDeselectAll();
      onSelectionChange([]);
    } else {
      onSelectAll();
    }

    // Audit trail logging
    if (auditTrail.enabled && auditTrail.logUserActions) {
      console.log('Bulk selection changed:', {
        action: isAllSelected ? 'deselect_all' : 'select_all',
        previousSelection: selectedItems.length,
        newSelection: isAllSelected ? 0 : totalItems,
        timestamp: new Date(),
        commerceState,
        workflowContext,
        userRole
      });
    }
  }, [isAllSelected, selectedItems.length, totalItems, onSelectAll, onDeselectAll, onSelectionChange, auditTrail, commerceState, workflowContext, userRole]);

  // Handle dropdown action selection
  const handleDropdownAction = useCallback((actionKey: string) => {
    const action = actions.find(a => a.key === actionKey);
    if (action) {
      handleAction(action);
    }
  }, [actions, handleAction]);

  // Build container classes
  const containerClasses = cn(
    'bulk-actions flex items-center gap-3',
    layout === 'toolbar' && 'bg-white border border-gray-200 rounded-lg p-3 shadow-sm',
    layout === 'horizontal' && 'flex-wrap',
    variant === 'outlined' && 'border border-gray-200 rounded-lg p-2',
    variant === 'minimal' && 'border-0 p-0',
    position === 'sticky' && 'sticky top-0 z-10 bg-white border-b border-gray-200',
    size === 'sm' && 'text-sm gap-2',
    size === 'lg' && 'text-lg gap-4',
    selectedItems.length === 0 && 'opacity-75',
    className
  );

  // Build action button classes
  const actionButtonClasses = cn(
    'transition-all duration-200',
    size === 'sm' && 'text-xs',
    size === 'lg' && 'text-base'
  );

  // Render action buttons for horizontal layout
  const renderActionButtons = () => (
    <>
      {availableActions.map((action) => (
        <Button
          key={action.key}
          variant={action.variant || 'secondary'}
          size={size}
          disabled={!isActionEnabled(action)}
          onClick={() => handleAction(action)}
          iconLeft={action.icon}
          className={actionButtonClasses}
        >
          {action.label}
        </Button>
      ))}
    </>
  );

  // Render dropdown for dropdown layout
  const renderDropdown = () => {
    const dropdownOptions = availableActions.map(action => ({
      value: action.key,
      label: action.label,
      disabled: !isActionEnabled(action)
    }));

    return (
      <Select
        id={`${id}-dropdown`}
        placeholder="Select action..."
        options={dropdownOptions}
        size={size}
        disabled={isDisabled || selectedItems.length === 0}
        onChange={(value) => handleDropdownAction(value as string)}
        className="min-w-[160px]"
      />
    );
  };

  // Selection info component
  const SelectionInfo = () => (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {showSelectionCount && (
        <span className="font-medium">
          {selectedItems.length}
        </span>
      )}
      {showItemsSelected && (
        <span>
          {itemsSelectedText}
        </span>
      )}
      {totalItems > 0 && (
        <span className="text-gray-400">
          of {totalItems}
        </span>
      )}
    </div>
  );

  // If no actions available and no items selected, don't render
  if (availableActions.length === 0 && selectedItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className={containerClasses} style={style}>
        {/* Select All Checkbox */}
        {showSelectAll && totalItems > 0 && (
          <Checkbox
            id={`${id}-select-all`}
            checked={isAllSelected}
            indeterminate={selectedItems.length > 0 && selectedItems.length < totalItems}
            disabled={isDisabled}
            onChange={handleSelectAll}
            label={isAllSelected ? deselectAllText : selectAllText}
            size={size}
            commerceState={commerceState}
            allowedActions={allowedActions}
            userRole={userRole}
            auditTrail={auditTrail}
          />
        )}

        {/* Selection Info */}
        {selectedItems.length > 0 && <SelectionInfo />}

        {/* Commerce State Indicator */}
        {commerceState && commerceState !== 'initiation' && (
          <span className="inline-block text-xs text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded">
            {commerceState}
          </span>
        )}

        {/* Actions */}
        {selectedItems.length > 0 && (
          <>
            {availableActions.length === 0 ? (
              <span className="text-sm text-gray-500">{noActionsText}</span>
            ) : layout === 'dropdown' ? (
              renderDropdown()
            ) : (
              renderActionButtons()
            )}
          </>
        )}

        {/* AI Config Display (development only) */}
        {process.env.NODE_ENV === 'development' && aiConfig && (
          <div className="absolute -top-6 left-0 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
            AI: {JSON.stringify(aiConfig.layout)}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <Modal
          isOpen={true}
          onClose={() => setConfirmAction(null)}
          title={confirmAction.confirmTitle || `Confirm ${confirmAction.label}`}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              {confirmAction.confirmMessage || 
                `Are you sure you want to ${confirmAction.label?.toLowerCase()} ${selectedItems.length} selected item${selectedItems.length !== 1 ? 's' : ''}?`
              }
            </p>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="tertiary"
                onClick={() => setConfirmAction(null)}
              >
                {confirmAction.cancelButtonText || 'Cancel'}
              </Button>
              
              <Button
                variant={confirmAction.variant || 'primary'}
                onClick={() => executeAction(confirmAction)}
              >
                {confirmAction.confirmButtonText || confirmAction.label}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

BulkActions.displayName = 'BulkActions';

export default BulkActions;