import React, { useState, useCallback, useMemo } from 'react';
import { ApprovalWorkflowProps, WorkflowStep } from '../../../types';
import { cn } from '../../../utils/cn';
import Button from '../../atoms/form/Button';
import Textarea from '../../atoms/form/Textarea';
import Badge from '../../atoms/display/Badge';
import Icon from '../../atoms/display/Icon';
import Avatar from '../../atoms/display/Avatar';
import Tooltip from '../../atoms/display/Tooltip';
import Modal from '../../atoms/feedback/Modal';
import Toast from '../../atoms/feedback/Toast';
import Alert from '../../atoms/feedback/Alert';
import ProgressTracker from '../../molecules/display/ProgressTracker';
import StatusCard from '../../molecules/display/StatusCard';

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  id = 'approval-workflow',
  title = 'Approval Workflow',
  steps = [],
  currentStep,
  requestData = {},
  approvers = [],
  parallel = false,
  autoAdvance = true,
  layout = 'vertical',
  size = 'md',
  showProgress = true,
  showHistory = true,
  showComments = true,
  allowDelegate = true,
  allowSkip = false,
  className = '',
  style = {},
  onStepAction,
  onWorkflowComplete,
  onDelegate,
}) => {
  const [actionModalStep, setActionModalStep] = useState<string | null>(null);
  const [actionType, setActionType] = useState<string>('');
  const [comments, setComments] = useState('');
  const [delegateTarget, setDelegateTarget] = useState('');
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [delegateStepId, setDelegateStepId] = useState<string>('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    show: false, message: '', type: 'info'
  });


  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  }, []);

  // Calculate workflow progress
  const workflowProgress = useMemo(() => {
    if (!steps.length) return 0;
    
    const completedSteps = steps.filter(step => 
      step.status === 'completed' || step.status === 'skipped'
    ).length;
    
    return (completedSteps / steps.length) * 100;
  }, [steps]);

  // Get current step index
  const currentStepIndex = useMemo(() => {
    return steps.findIndex(step => step.id === currentStep);
  }, [steps, currentStep]);

  // Check if user can act on a step
  const canActOnStep = useCallback((step: WorkflowStep) => {
    if (step.status !== 'pending' && step.status !== 'in_progress') return false;
    return true; // Simplified - parent component should control permissions
  }, []);

  // Get step assignee info
  const getAssigneeInfo = useCallback((assigneeId: string) => {
    return approvers.find(approver => approver.id === assigneeId);
  }, [approvers]);

  // Handle step action
  const handleStepAction = useCallback(async (stepId: string, action: string, data?: any) => {
    const step = steps.find(s => s.id === stepId);
    if (!step || !canActOnStep(step)) {
      showToast('You do not have permission to perform this action', 'error');
      return;
    }

    const actionData = {
      stepId,
      action,
      comments: data?.comments || comments,
      timestamp: new Date().toISOString(),
    };

    try {
      await onStepAction?.(stepId, action, actionData);
      
      // Show success message
      const actionLabel = action.charAt(0).toUpperCase() + action.slice(1);
      showToast(`Step ${actionLabel.toLowerCase()}ed successfully`, 'success');

      // Check if workflow is complete
      const isLastStep = currentStepIndex === steps.length - 1;
      const isApproveAction = action === 'approve';
      
      if (isLastStep && isApproveAction && autoAdvance) {
        onWorkflowComplete?.('approved');
        showToast('Workflow completed successfully!', 'success');
      } else if (action === 'reject') {
        onWorkflowComplete?.('rejected');
        showToast('Workflow has been rejected', 'warning');
      }

      // Reset modal state
      setActionModalStep(null);
      setActionType('');
      setComments('');

    } catch (error) {
      console.error('Step action failed:', error);
      showToast('Action failed. Please try again.', 'error');
    }
  }, [steps, canActOnStep, comments, onStepAction, currentStepIndex, autoAdvance, onWorkflowComplete, showToast]);

  // Handle delegation
  const handleDelegate = useCallback(async (stepId: string, newAssignee: string) => {
    if (!allowDelegate) {
      showToast('Delegation is not allowed', 'error');
      return;
    }

    const assigneeInfo = getAssigneeInfo(newAssignee);
    if (!assigneeInfo) {
      showToast('Invalid assignee selected', 'error');
      return;
    }


    try {
      await onDelegate?.(stepId, newAssignee);
      showToast(`Step delegated to ${assigneeInfo.name}`, 'success');
      
      setShowDelegateModal(false);
      setDelegateStepId('');
      setDelegateTarget('');
      
    } catch (error) {
      console.error('Delegation failed:', error);
      showToast('Delegation failed. Please try again.', 'error');
    }
  }, [allowDelegate, getAssigneeInfo, onDelegate, showToast]);

  // Render step status icon
  const renderStepStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'completed':
        return <Icon name="check-circle" className="text-green-500" />;
      case 'in_progress':
        return <Icon name="clock" className="text-blue-500" />;
      case 'failed':
        return <Icon name="x-circle" className="text-red-500" />;
      case 'skipped':
        return <Icon name="skip-forward" className="text-gray-400" />;
      case 'cancelled':
        return <Icon name="ban" className="text-gray-400" />;
      default:
        return <Icon name="circle" className="text-gray-300" />;
    }
  }, []);

  // Render step actions
  const renderStepActions = useCallback((step: WorkflowStep) => {
    if (!canActOnStep(step)) return null;

    const actions = step.actions || [
      { id: 'approve', label: 'Approve', type: 'approve', variant: 'primary' },
      { id: 'reject', label: 'Reject', type: 'reject', variant: 'danger' },
    ];

    return (
      <div className="flex flex-wrap gap-2">
        {actions.map(action => (
          <Button
            key={action.id}
            variant={action.variant as any || 'secondary'}
            size="sm"
            onClick={() => {
              setActionModalStep(step.id!);
              setActionType(action.type || action.id!);
            }}
            disabled={step.status !== 'pending' && step.status !== 'in_progress'}
            className={cn(
              action.variant === 'primary' && 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
              action.variant === 'danger' && 'bg-red-600 hover:bg-red-700 text-white border-red-600',
              (!action.variant || action.variant === 'secondary') && 'text-gray-700 border-gray-300 hover:bg-gray-50'
            )}
          >
            {action.label}
          </Button>
        ))}
        
        {allowDelegate && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setDelegateStepId(step.id!);
              setShowDelegateModal(true);
            }}
            iconLeft={<Icon name="user-plus" size="xs" />}
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Delegate
          </Button>
        )}
        
        {allowSkip && step?.optional && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleStepAction(step.id!, 'skip')}
            iconLeft={<Icon name="skip-forward" size="xs" />}
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Skip
          </Button>
        )}
      </div>
    );
  }, [canActOnStep, allowDelegate, allowSkip, handleStepAction]);

  // Get step duration display
  const getStepDuration = useCallback((step: WorkflowStep) => {
    if (!step.completedAt || !step.duration) return null;
    
    const hours = Math.floor(step.duration / 3600);
    const minutes = Math.floor((step.duration % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  // Format timestamp for better display
  const formatTimestamp = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }, []);


  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base',
  };

  const spacingClasses = {
    sm: 'p-3 gap-3',
    md: 'p-4 gap-4',
    lg: 'p-6 gap-6',
  };

  // Convert steps to ProgressTracker format
  const progressSteps = useMemo(() => {
    return steps.map((step, index) => ({
      key: step.id!,
      title: step.name!,
      description: step.description,
      status: step.status as any,
      timestamp: step.completedAt,
      assignee: step.assignees?.[0] ? getAssigneeInfo(step.assignees[0])?.name : undefined,
      duration: step.duration,
      actions: canActOnStep(step) ? [
        { key: 'approve', label: 'Approve', variant: 'primary' as const },
        { key: 'reject', label: 'Reject', variant: 'danger' as const },
      ] : undefined,
    }));
  }, [steps, getAssigneeInfo, canActOnStep]);

  if (layout === 'timeline') {
    return (
      <div 
        className={cn(
          'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm',
          sizeClasses[size],
          className
        )}
        style={style}
      >
        {/* Improved Header */}
        <div className={cn('border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800', spacingClasses[size])}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                <Badge
                  variant={
                    workflowProgress === 100 ? 'success' :
                    workflowProgress > 0 ? 'warning' : 'secondary'
                  }
                  className="font-medium"
                >
                  {workflowProgress === 100 ? 'Complete' : 
                   workflowProgress > 0 ? 'In Progress' : 'Pending'}
                </Badge>
              </div>
              {showProgress && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(workflowProgress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-out"
                        style={{ width: `${workflowProgress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {steps.filter(s => s.status === 'completed').length} of {steps.length} steps
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Progress Tracker */}
        <div className={spacingClasses[size]}>
          <ProgressTracker
            steps={progressSteps}
            currentStep={currentStep}
            layout="timeline"
            showProgress={showProgress}
            showTimestamps={showHistory}
            showAssignees={true}
            showDurations={showHistory}
            showActions={true}
            onStepAction={(stepKey, actionKey) => {
              const step = steps.find(s => s.id === stepKey);
              if (step) {
                setActionModalStep(stepKey);
                setActionType(actionKey);
              }
            }}
            size={size}
            className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4"
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm',
        sizeClasses[size],
        className
      )}
      style={style}
    >
      {/* Enhanced Header */}
      <div className={cn('border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800', spacingClasses[size])}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              <Badge
                variant={
                  workflowProgress === 100 ? 'success' :
                  workflowProgress > 0 ? 'warning' : 'secondary'
                }
                className="font-medium"
              >
                {steps.filter(s => s.status === 'completed').length} / {steps.length} Complete
              </Badge>
            </div>
            {requestData.requestTitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{requestData.requestTitle}</p>
            )}
            {showProgress && (
              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(workflowProgress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-out"
                      style={{ width: `${workflowProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Request Summary */}
      {Object.keys(requestData).length > 1 && (
        <div className={cn('border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30', spacingClasses[size])}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Request Details</h4>
            {requestData.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {requestData.description}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {requestData.requestTitle && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Title:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{requestData.requestTitle}</span>
                </div>
              )}
              {requestData.amount && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Amount:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-semibold">
                    {requestData.currency || '$'}{typeof requestData.amount === 'number' ? requestData.amount.toLocaleString() : requestData.amount}
                  </span>
                </div>
              )}
              {requestData.department && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Department:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{requestData.department}</span>
                </div>
              )}
              {requestData.priority && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Priority:</span>
                  <span className="ml-2">
                    <Badge 
                      variant={
                        requestData.priority === 'urgent' ? 'error' :
                        requestData.priority === 'high' ? 'warning' :
                        requestData.priority === 'medium' ? 'primary' : 'secondary'
                      } 
                      size="xs"
                    >
                      {requestData.priority.charAt(0).toUpperCase() + requestData.priority.slice(1)}
                    </Badge>
                  </span>
                </div>
              )}
              {requestData.requestedBy && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Requested By:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{requestData.requestedBy}</span>
                </div>
              )}
              {requestData.requestedDate && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Requested Date:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {new Date(requestData.requestedDate).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Workflow Steps */}
      <div className={cn(
        spacingClasses[size],
        'space-y-4',
        layout === 'horizontal' && 'flex gap-4 overflow-x-auto pb-2'
      )}>
        {steps.map((step, index) => {
          const isCurrentStep = step.id === currentStep;
          const assigneeInfo = step.assignees?.[0] ? getAssigneeInfo(step.assignees[0]) : null;
          const isCompleted = step.status === 'completed';
          const isFailed = step.status === 'failed';
          const isPending = step.status === 'pending';
          const isInProgress = step.status === 'in_progress';
          
          return (
            <div
              key={step.id}
              className={cn(
                'group relative rounded-xl border transition-all duration-300 hover:shadow-md',
                spacingClasses[size],
                // Base styles
                'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                // Current step highlighting
                isCurrentStep && 'ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-600',
                // Status-based styling
                isCompleted && 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700',
                isFailed && 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-700',
                isInProgress && 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-700',
                // Layout
                layout === 'horizontal' && 'min-w-80 flex-shrink-0'
              )}
            >
              {/* Step Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                    isCompleted && 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
                    isFailed && 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
                    isInProgress && 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
                    isPending && 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  )}>
                    {renderStepStatusIcon(step.status!)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{step.name}</h4>
                    {step.type && (
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {step.type}
                      </p>
                    )}
                  </div>
                </div>
                <Badge
                  variant={
                    isCompleted ? 'success' :
                    isInProgress ? 'warning' :
                    isFailed ? 'error' : 'secondary'
                  }
                  size="sm"
                  className="font-medium"
                >
                  {step.status?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              {/* Step Description */}
              {step.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{step.description}</p>
              )}

              {/* Assignees Section */}
              {step.assignees && step.assignees.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned to</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {step.assignees.slice(0, 3).map(assigneeId => {
                      const assignee = getAssigneeInfo(assigneeId);
                      return assignee ? (
                        <Tooltip key={assigneeId} content={`${assignee.name} - ${assignee.role || 'Approver'}`}>
                          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                            <Avatar
                              name={assignee.name}
                              size="xs"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {assignee.name?.split(' ')[0]}
                            </span>
                          </div>
                        </Tooltip>
                      ) : (
                        <div key={assigneeId} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                          <Avatar name={assigneeId} size="xs" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{assigneeId}</span>
                        </div>
                      );
                    })}
                    {step.assignees.length > 3 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                        +{step.assignees.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Step Metadata */}
              <div className="space-y-2 mb-4 text-sm">
                {step.dueDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(step.dueDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {step.completedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatTimestamp(step.completedAt)}
                    </span>
                  </div>
                )}
                {step.completedBy && assigneeInfo && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Completed By:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{assigneeInfo.name}</span>
                  </div>
                )}
                {step.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{getStepDuration(step)}</span>
                  </div>
                )}
              </div>

              {/* Step Actions */}
              {renderStepActions(step)}
            </div>
          );
        })}
      </div>

      {/* Enhanced Workflow History */}
      {showHistory && steps.some(s => s.status === 'completed' || s.status === 'failed') && (
        <div className={cn('border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30', spacingClasses[size])}>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Workflow History</h4>
          <div className="space-y-3">
            {steps
              .filter(step => step.status === 'completed' || step.status === 'failed')
              .sort((a, b) => {
                if (!a.completedAt || !b.completedAt) return 0;
                return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
              })
              .map(step => {
                const assignee = step.completedBy ? getAssigneeInfo(step.completedBy) : null;
                return (
                  <div key={`history-${step.id}`} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className={cn(
                      'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5',
                      step.status === 'completed' && 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
                      step.status === 'failed' && 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                    )}>
                      {renderStepStatusIcon(step.status!)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{step.name}</span>
                        <Badge size="xs" variant={step.status === 'completed' ? 'success' : 'error'}>
                          {step.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        {step.completedAt && (
                          <div>Completed: {formatTimestamp(step.completedAt)}</div>
                        )}
                        {assignee && (
                          <div>By: {assignee.name}</div>
                        )}
                        {step.duration && (
                          <div>Duration: {getStepDuration(step)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Action Modal */}
      <Modal
        isOpen={!!actionModalStep}
        onClose={() => {
          setActionModalStep(null);
          setActionType('');
          setComments('');
        }}
        title={`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Step`}
        size="md"
      >
        <div className="space-y-4">
          {actionType === 'reject' && (
            <Alert
              variant="warning"
              title="Confirm Rejection"
              description="This action will reject the entire workflow and cannot be undone."
            />
          )}
          
          {showComments && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Comments {actionType === 'reject' ? '(Required)' : '(Optional)'}
              </label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter your comments..."
                rows={3}
                required={actionType === 'reject'}
              />
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setActionModalStep(null);
                setActionType('');
                setComments('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'reject' ? 'danger' : 'primary'}
              onClick={() => {
                if (actionType === 'reject' && !comments.trim()) {
                  showToast('Comments are required for rejection', 'error');
                  return;
                }
                handleStepAction(actionModalStep!, actionType, { comments });
              }}
            >
              {actionType === 'reject' ? 'Reject' : 'Approve'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delegate Modal */}
      <Modal
        isOpen={showDelegateModal}
        onClose={() => {
          setShowDelegateModal(false);
          setDelegateStepId('');
          setDelegateTarget('');
        }}
        title="Delegate Step"
        size="md"
      >
        <div className="space-y-4">
          <p>Select a user to delegate this step to:</p>
          
          <div className="space-y-2">
            {approvers.map(approver => (
              <div
                key={approver.id}
                className={cn(
                  'flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50',
                  delegateTarget === approver.id && 'border-blue-500 bg-blue-50'
                )}
                onClick={() => setDelegateTarget(approver.id!)}
              >
                <input
                  type="radio"
                  name="delegate-target"
                  checked={delegateTarget === approver.id}
                  onChange={() => setDelegateTarget(approver.id!)}
                  className="sr-only"
                />
                <Avatar name={approver.name} size="sm" />
                <div>
                  <div className="font-medium">{approver.name}</div>
                  <div className="text-sm text-gray-600">{approver.role}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDelegateModal(false);
                setDelegateStepId('');
                setDelegateTarget('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleDelegate(delegateStepId, delegateTarget)}
              disabled={!delegateTarget}
            >
              Delegate
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

export default ApprovalWorkflow;