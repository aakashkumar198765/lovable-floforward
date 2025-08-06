import React, { useState, useCallback, useEffect } from 'react';
import { CommerceState, ProgressStep, ProgressTrackerProps } from '../../../types';
import { cn } from '../../../utils/cn';
import Badge from '../../atoms/display/Badge';
import Button from '../../atoms/form/Button';
import Tooltip from '../../atoms/display/Tooltip';
import { Check, X, RefreshCw, ArrowRight, ChevronDown } from 'lucide-react';

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  id = 'progress-tracker',
  title = '',
  subtitle = '',
  steps = [],
  currentStep = '',
  overallProgress,
  layout = 'vertical',
  orientation = 'left',
  showProgress = true,
  showTimestamps = true,
  showAssignees = true,
  showDurations = false,
  showActions = true,
  showNotes = false,
  showAttachments = false,
  showMetadata = false,
  allowStepNavigation = false,
  clickableSteps = false,
  collapsibleSteps = false,
  size = 'md',
  variant = 'default',
  colorScheme = 'primary',
  animateProgress = true,
  showEstimates = false,
  showOverallStats = false,
  isDisabled = false,
  isReadonly = false,
  className = '',
  style = {},
  onStepClick = () => {},
  onStepAction = () => {},
  onProgressUpdate = () => {},
}) => {
  const [collapsedSteps, setCollapsedSteps] = useState<{ [key: string]: boolean }>({});
  const [animatedProgress, setAnimatedProgress] = useState(0);


  // Calculate overall progress if not provided
  const calculatedProgress = overallProgress ?? (() => {
    const totalSteps = steps.filter(step => step.visible !== false && !step.optional).length;
    const completedSteps = steps.filter(step => 
      step.visible !== false && 
      !step.optional && 
      step.status === 'completed'
    ).length;
    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  })();

  // Animate progress updates
  useEffect(() => {
    if (animateProgress) {
      const timer = setTimeout(() => {
        setAnimatedProgress(calculatedProgress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(calculatedProgress);
    }
  }, [calculatedProgress, animateProgress]);

  // Filter and sort visible steps
  const visibleSteps = steps
    .filter(step => step.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Get step status color classes
  const getStatusColors = (status: ProgressStep['status']) => {
    const baseColors = {
      pending: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-600', icon: 'text-gray-400' },
      in_progress: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', icon: 'text-blue-500' },
      completed: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700', icon: 'text-green-500' },
      failed: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700', icon: 'text-red-500' },
      skipped: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700', icon: 'text-yellow-500' },
      cancelled: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-500', icon: 'text-gray-400' },
    };
    return baseColors[status || 'pending'];
  };

  // Handle step click
  const handleStepClick = useCallback((stepKey: string, step: ProgressStep) => {
    if ((clickableSteps || allowStepNavigation) && !isDisabled) {
      onStepClick(stepKey);
    }
  }, [clickableSteps, allowStepNavigation, isDisabled, onStepClick]);

  // Handle step action
  const handleStepAction = useCallback((stepKey: string, actionKey: string) => {
    onStepAction(stepKey, actionKey);
  }, [onStepAction]);

  // Handle step collapse toggle
  const handleStepToggle = useCallback((stepKey: string) => {
    setCollapsedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  }, []);

  // Format duration
  const formatDuration = (duration: number) => {
    if (duration < 60) return `${duration}m`;
    if (duration < 1440) return `${Math.floor(duration / 60)}h ${duration % 60}m`;
    return `${Math.floor(duration / 1440)}d ${Math.floor((duration % 1440) / 60)}h`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timestamp;
    }
  };

  // Calculate overall statistics
  const getOverallStats = () => {
    const total = visibleSteps.length;
    const completed = visibleSteps.filter(s => s.status === 'completed').length;
    const inProgress = visibleSteps.filter(s => s.status === 'in_progress').length;
    const failed = visibleSteps.filter(s => s.status === 'failed').length;
    const totalEstimate = visibleSteps.reduce((sum, s) => sum + (s.estimate || 0), 0);
    const totalActual = visibleSteps.reduce((sum, s) => sum + (s.actualDuration || 0), 0);
    
    return { total, completed, inProgress, failed, totalEstimate, totalActual };
  };

  const stats = showOverallStats ? getOverallStats() : null;

  // Build container classes
  const containerClasses = cn(
    'progress-tracker',
    size === 'sm' && 'text-sm',
    size === 'lg' && 'text-lg',
    variant === 'default' && 'bg-white border border-gray-200 rounded-lg shadow-sm',
    variant === 'outlined' && 'bg-transparent border-2 border-gray-300 rounded-lg',
    variant === 'filled' && 'bg-gray-50 border border-gray-200 rounded-lg',
    variant === 'minimal' && 'bg-transparent border-0',
    className
  );

  // Build steps container classes
  const stepsClasses = cn(
    layout === 'horizontal' && 'p-4 flex gap-4 overflow-x-auto',
    layout === 'vertical' && 'space-y-4',
    layout === 'compact' && 'space-y-2',
    layout === 'timeline' && 'relative space-y-6'
  );

  // Default step icons
  const getStepIcon = (step: ProgressStep) => {
    if (step.icon) return step.icon;
    
    switch (step.status) {
      case 'completed':
        return <Check className="w-5 h-5" />;
      case 'failed':
        return <X className="w-5 h-5" />;
      case 'in_progress':
        return <RefreshCw className="w-5 h-5 animate-spin" />;
      case 'skipped':
        return <ArrowRight className="w-5 h-5" />;
      default:
        return (
          <div className="w-3 h-3 rounded-full bg-current" />
        );
    }
  };

  // Progress bar component
  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={cn(
          'h-2 rounded-full transition-all duration-1000 ease-out',
          colorScheme === 'primary' && 'bg-primary-600',
          colorScheme === 'success' && 'bg-green-600',
          colorScheme === 'warning' && 'bg-yellow-600',
          colorScheme === 'error' && 'bg-red-600',
          colorScheme === 'info' && 'bg-blue-600'
        )}
        style={{ width: `${animatedProgress}%` }}
      />
    </div>
  );

  return (
    <div className={containerClasses} style={style}>
      {/* Header */}
      {(title || subtitle || showProgress || showOverallStats) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <h2 className={cn(
                  'font-semibold text-gray-900',
                  size === 'sm' && 'text-base',
                  size === 'md' && 'text-lg',
                  size === 'lg' && 'text-xl'
                )}>
                  {title}
                </h2>
              )}
              
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>

            {showOverallStats && stats && (
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completed}/{stats.total}
                </div>
                <div className="text-sm text-gray-600">
                  Steps completed
                </div>
                {showEstimates && stats.totalEstimate > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Est: {formatDuration(stats.totalEstimate)}
                    {stats.totalActual > 0 && (
                      <span> | Actual: {formatDuration(stats.totalActual)}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Overall Progress */}
          {showProgress && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span className="font-medium">{Math.round(animatedProgress)}%</span>
              </div>
              <ProgressBar />
            </div>
          )}
        </div>
      )}

      {/* Steps */}
      <div className="p-4">
        {layout === 'timeline' && (
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
        )}

        <div className={stepsClasses}>
          {visibleSteps.map((step, index) => {
            const statusColors = getStatusColors(step?.status);
            const isCollapsed = step.key ? collapsedSteps[step.key] : false;
            const isCurrent = step.key === currentStep;
            const isClickable = (clickableSteps || allowStepNavigation) && !isDisabled;

            return (
              <div
                key={step.key}
                className={cn(
                  'progress-step relative',
                  layout === 'horizontal' && 'flex-shrink-0 w-64',
                  layout === 'timeline' && 'relative pl-16'
                )}
              >
                {/* Timeline connector */}
                {layout === 'timeline' && index < visibleSteps.length - 1 && (
                  <div className="absolute left-8 top-8 w-0.5 h-full bg-gray-200" />
                )}

                {/* Step Icon */}
                <div className={cn(
                  'flex items-center gap-3',
                  layout === 'timeline' && 'absolute left-0 top-0'
                )}>
                  <div className={cn(
                    'flex items-center justify-center rounded-full border-2 transition-all duration-200',
                    size === 'xs' && 'w-4 h-4',
                    size === 'sm' && 'w-8 h-8',
                    size === 'md' && 'w-10 h-10',
                    size === 'lg' && 'w-12 h-12',
                    statusColors?.bg,
                    statusColors?.border,
                    statusColors?.icon,
                    isCurrent && 'ring-2 ring-primary-500 ring-offset-2',
                    isClickable && 'cursor-pointer hover:scale-110'
                  )}
                  onClick={() => step.key && handleStepClick(step.key, step)}
                >
                  {getStepIcon(step)}
                </div>
                </div>

                {/* Step Content */}
                <div className={cn(
                  'flex-1',
                  layout === 'timeline' && 'ml-0',
                  layout !== 'timeline' && layout === 'horizontal' && 'ml-0 mt-2',
                  layout !== 'timeline' && layout !== 'horizontal' && 'ml-3'
                )}>
                  <div
                    className={cn(
                      'cursor-pointer',
                      isClickable && 'hover:bg-gray-50 rounded p-2 -m-2'
                    )}
                    onClick={() => step.key && handleStepClick(step.key, step)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        'font-medium',
                        statusColors.text,
                        isCurrent && 'text-primary-700'
                      )}>
                        {step.title}
                        {step.optional && (
                          <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                        )}
                      </h3>

                      <div className="flex items-center gap-2">
                        <Badge variant={step.status === 'completed' ? 'success' : 
                                     step.status === 'failed' ? 'error' :
                                     step.status === 'in_progress' ? 'warning' : 'secondary'}>
                          {step.status?.replace('_', ' ')}
                        </Badge>

                        {collapsibleSteps && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              step.key && handleStepToggle(step.key);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <ChevronDown className={cn('w-4 h-4 transition-transform', isCollapsed && 'rotate-180')} />
                          </button>
                        )}
                      </div>
                    </div>

                    {step.description && !isCollapsed && (
                      <p className={cn('text-sm mt-1', statusColors.text)}>{step.description}</p>
                    )}
                  </div>

                  {/* Step Details */}
                  {!isCollapsed && (
                    <div className="mt-2 space-y-2">
                      {/* Metadata row */}
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        {showTimestamps && step.timestamp && (
                          <span>{formatTimestamp(step.timestamp)}</span>
                        )}
                        
                        {showAssignees && step.assignee && (
                          <span>Assigned to: {step.assignee}</span>
                        )}
                        
                        {showDurations && step.duration && (
                          <span>Duration: {formatDuration(step.duration)}</span>
                        )}
                        
                        {showEstimates && step.estimate && (
                          <span>
                            Est: {formatDuration(step.estimate)}
                            {step.actualDuration && (
                              <span className={cn(
                                'ml-1',
                                step.actualDuration > step.estimate ? 'text-red-600' : 'text-green-600'
                              )}>
                                (Actual: {formatDuration(step.actualDuration)})
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Notes */}
                      {showNotes && step.notes && (
                        <div className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                          {step.notes}
                        </div>
                      )}

                      {/* Metadata */}
                      {showMetadata && step.metadata && Object.keys(step.metadata).length > 0 && (
                        <div className="text-xs text-gray-600">
                          {Object.entries(step.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Attachments */}
                      {showAttachments && step.attachments && step.attachments.length > 0 && (
                        <div className="space-y-1">
                          {step.attachments.map((attachment, idx) => (
                            <a
                              key={idx}
                              href={attachment.url}
                              className="text-xs text-primary-600 hover:text-primary-700 block"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              📎 {attachment.name}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      {showActions && step.actions && step.actions.length > 0 && (
                        <div className="flex items-center gap-2 pt-2">
                          {step.actions.map((action) => (
                            <Button
                              key={action.key}
                              variant={action.variant || 'tertiary'}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                step.key && action.key && handleStepAction(step.key, action.key);
                              }}
                              disabled={action.disabled || isDisabled}
                              iconLeft={action.icon}
                              className="text-xs px-2 py-1"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {visibleSteps.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No steps to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

ProgressTracker.displayName = 'ProgressTracker';

export default ProgressTracker;