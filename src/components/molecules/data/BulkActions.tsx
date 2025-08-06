import React, { useState, useCallback, useEffect } from 'react';
import { BulkActionsProps, BulkAction } from '../../../types';
import { cn } from '../../../utils/cn';
import { sizeClasses, layoutClasses, animationClasses } from '../../../utils/tailwindClassMaps';
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
  isDisabled = false,
  className = '',
  style = {},
  onAction = () => {},
  onSelectAll = () => {},
  onDeselectAll = () => {},
  onSelectionChange = () => {},
}) => {
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);
  const [isAllSelected, setIsAllSelected] = useState(false);


  // Update all selected state
  useEffect(() => {
    setIsAllSelected(selectedItems.length === totalItems && totalItems > 0);
  }, [selectedItems.length, totalItems]);

  // Filter available actions based on state
  const availableActions = actions.filter(action => {
    return !action.disabled;
  });

  // Check if action is enabled based on selection
  const isActionEnabled = useCallback((action: BulkAction) => {
    if (action.disabled || isDisabled) return false;
    
    if (action.requiresSelection !== false && selectedItems.length === 0) return false;
    
    if (action.minSelection && selectedItems.length < action.minSelection) return false;
    
    if (action.maxSelection && selectedItems.length > action.maxSelection) return false;
    
    return true;
  }, [selectedItems.length, isDisabled]);

  // Handle action execution
  const handleAction = useCallback((action: BulkAction) => {
    if (!isActionEnabled(action)) return;

    if (action.confirmRequired) {
      setConfirmAction(action);
    } else {
      executeAction(action);
    }
  }, [selectedItems, isActionEnabled]);

  // Execute action after confirmation
  const executeAction = useCallback((action: BulkAction) => {
    action.key && onAction(action.key, selectedItems);
    setConfirmAction(null);
  }, [selectedItems, onAction]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onDeselectAll();
      onSelectionChange([]);
    } else {
      onSelectAll();
    }
  }, [isAllSelected, onSelectAll, onDeselectAll, onSelectionChange]);

  // Handle dropdown action selection
  const handleDropdownAction = useCallback((actionKey: string) => {
    const action = actions.find(a => a.key === actionKey);
    if (action) {
      handleAction(action);
    }
  }, [actions, handleAction]);

  // Build container classes
  const containerClasses = cn(
    'bulk-actions',
    layoutClasses.flex.between,
    'gap-3',
    layout === 'toolbar' && 'bg-white border border-gray-200 rounded-lg p-3 shadow-sm',
    layout === 'horizontal' && 'flex-wrap',
    variant === 'outlined' && 'border border-gray-200 rounded-lg p-2',
    variant === 'minimal' && 'border-0 p-0',
    position === 'sticky' && 'sticky top-0 z-10 bg-white border-b border-gray-200',
    size === 'sm' && `${sizeClasses.text.sm} gap-2`,
    size === 'lg' && `${sizeClasses.text.lg} gap-4`,
    selectedItems.length === 0 && 'opacity-75',
    className
  );

  // Build action button classes
  const actionButtonClasses = cn(
    animationClasses.transition.default,
    size === 'sm' && sizeClasses.text.xs,
    size === 'lg' && sizeClasses.text.lg
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
          />
        )}

        {/* Selection Info */}
        {selectedItems.length > 0 && <SelectionInfo />}

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