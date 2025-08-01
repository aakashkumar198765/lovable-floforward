import React, { useState, useCallback } from 'react';
import { CommerceState, StatusAction, StatusCardProps } from '../../../types';
import { cn } from '../../../utils/cn';
import Badge from '../../atoms/display/Badge';
import Button from '../../atoms/form/Button';
import Tooltip from '../../atoms/display/Tooltip';

const StatusCard: React.FC<StatusCardProps> = ({
  id = 'status-card',
  title,
  subtitle = '',
  status,
  statusVariant = 'primary',
  description = '',
  timestamp = '',
  assignee = '',
  priority,
  category = '',
  progress,
  metadata = {},
  actions = [],
  showActions = true,
  showTimestamp = true,
  showAssignee = true,
  showPriority = true,
  showProgress = false,
  showCategory = true,
  clickable = false,
  collapsible = false,
  collapsed: initialCollapsed = false,
  size = 'md',
  variant = 'default',
  layout = 'vertical',
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
  onClick = () => {},
  onAction = () => {},
  onToggleCollapse = () => {},
}) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  // Handle commerce state based behavior
  const isReadonly = commerceState === 'completion';
  const isDisabled = commerceState === 'settlement' && !allowedActions.includes('status_actions');

  // Filter available actions based on permissions
  const availableActions = actions.filter(action => {
    if (action.hidden || action.disabled || isDisabled) return false;
    if (action.permissions && action.permissions.length > 0) {
      return action.permissions.some(permission => allowedActions.includes(permission));
    }
    return true;
  });

  // Handle card click
  const handleCardClick = useCallback(() => {
    if (clickable && !isDisabled) {
      onClick();
      
      // Audit trail logging
      if (auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Status card clicked:', {
          action: 'status_card_click',
          cardId: id,
          title,
          status,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }
    }
  }, [clickable, isDisabled, onClick, auditTrail, id, title, status, commerceState, workflowContext, userRole]);

  // Handle action click
  const handleActionClick = useCallback((actionKey: string, action: StatusAction) => {
    if (!isDisabled) {
      onAction(actionKey);
      
      // Audit trail logging
      if (auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Status card action:', {
          action: 'status_card_action',
          actionKey,
          cardId: id,
          title,
          status,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      if (onUpdate) {
        onUpdate({ action: actionKey, cardData: { id, title, status } });
      }
    }
  }, [isDisabled, onAction, onUpdate, auditTrail, id, title, status, commerceState, workflowContext, userRole]);

  // Handle toggle collapse
  const handleToggleCollapse = useCallback(() => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onToggleCollapse(newCollapsed);
  }, [collapsed, onToggleCollapse]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timestamp;
    }
  };

  // Get priority variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  // Build container classes
  const containerClasses = cn(
    'status-card relative overflow-hidden transition-all duration-200',
    size === 'sm' && 'p-3 text-sm',
    size === 'md' && 'p-4',
    size === 'lg' && 'p-6 text-lg',
    variant === 'default' && 'bg-white border border-gray-200 rounded-lg shadow-sm',
    variant === 'outlined' && 'bg-transparent border-2 border-gray-300 rounded-lg',
    variant === 'filled' && 'bg-gray-50 border border-gray-200 rounded-lg',
    variant === 'minimal' && 'bg-transparent border-0 rounded-none',
    clickable && !isDisabled && 'cursor-pointer hover:shadow-md hover:border-primary-300',
    isDisabled && 'opacity-60 cursor-not-allowed',
    commerceState === 'completion' && 'border-gray-300 bg-gray-50',
    className
  );

  // Build header classes
  const headerClasses = cn(
    'flex items-start justify-between',
    layout === 'horizontal' && 'items-center',
    collapsible && 'cursor-pointer'
  );

  // Build content classes
  const contentClasses = cn(
    'transition-all duration-300',
    collapsed && 'hidden',
    layout === 'horizontal' && 'flex items-center gap-4',
    layout === 'compact' && 'space-y-1'
  );

  // Collapse icon
  const CollapseIcon = () => (
    <svg
      className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  // Progress bar component
  const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );

  return (
    <div className={containerClasses} style={style} onClick={handleCardClick}>
      {/* Header */}
      <div
        className={headerClasses}
        onClick={collapsible ? handleToggleCollapse : undefined}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              'font-semibold text-gray-900 truncate',
              size === 'sm' && 'text-sm',
              size === 'lg' && 'text-lg'
            )}>
              {title}
            </h3>
            
            <Badge variant={statusVariant}>
              {status}
            </Badge>

            {showPriority && priority && (
              <Badge variant={getPriorityVariant(priority)} size="sm">
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Badge>
            )}

            {commerceState && commerceState !== 'initiation' && (
              <Badge variant="secondary" size="sm">
                {commerceState}
              </Badge>
            )}
          </div>
          
          {subtitle && (
            <p className="text-sm text-gray-600 truncate">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2">
          {showCategory && category && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase">
              {category}
            </span>
          )}
          
          {collapsible && (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={collapsed ? 'Expand card' : 'Collapse card'}
            >
              <CollapseIcon />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={contentClasses}>
        {/* Description */}
        {description && (
          <p className={cn(
            'text-gray-700 mt-2',
            size === 'sm' && 'text-xs',
            layout === 'compact' && 'mt-1'
          )}>
            {description}
          </p>
        )}

        {/* Progress */}
        {showProgress && progress !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        )}

        {/* Metadata */}
        {Object.keys(metadata).length > 0 && (
          <div className="mt-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{key}:</span>
                  <span className="text-gray-900 font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className={cn(
          'flex items-center justify-between mt-3 pt-3 border-t border-gray-100',
          layout === 'compact' && 'mt-2 pt-2'
        )}>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {showAssignee && assignee && (
              <span>
                Assigned to: <span className="font-medium">{assignee}</span>
              </span>
            )}
            
            {showTimestamp && timestamp && (
              <span>{formatTimestamp(timestamp)}</span>
            )}
          </div>

          {/* Actions */}
          {showActions && availableActions.length > 0 && (
            <div className="flex items-center gap-2">
              {availableActions.map((action) => {
                const button = (
                  <Button
                    key={action.key}
                    variant={action.variant || 'secondary'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.key && handleActionClick(action.key, action);
                    }}
                    disabled={action.disabled || isDisabled}
                    iconLeft={action.icon}
                    className="text-xs"
                  >
                    {action.label}
                  </Button>
                );

                return action.tooltip ? (
                  <Tooltip key={action.key} content={action.tooltip}>
                    {button}
                  </Tooltip>
                ) : button;
              })}
            </div>
          )}
        </div>
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

StatusCard.displayName = 'StatusCard';

export default StatusCard;