import React, { useState, useCallback, useEffect } from 'react';
import { CommerceState, MetricCardProps } from '../../../types';
import { cn } from '../../../utils/cn';
import Badge from '../../atoms/display/Badge';
import Button from '../../atoms/form/Button';
import Tooltip from '../../atoms/display/Tooltip';

const MetricCard: React.FC<MetricCardProps> = ({
  id = 'metric-card',
  title,
  subtitle = '',
  metric,
  trend,
  comparison,
  description = '',
  target,
  threshold,
  status = 'normal',
  category = '',
  lastUpdated = '',
  actions = [],
  showTrend = true,
  showComparison = true,
  showTarget = true,
  showActions = true,
  showLastUpdated = true,
  clickable = false,
  refreshable = false,
  loading = false,
  size = 'md',
  variant = 'default',
  color = 'primary',
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
  onRefresh = () => {},
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle commerce state based behavior
  const isReadonly = commerceState === 'completion';
  const isDisabled = commerceState === 'settlement' && !allowedActions.includes('metric_actions');

  // Auto-detect status based on threshold and target
  useEffect(() => {
    if (threshold && typeof metric?.value === 'number') {
      const value = metric.value;
      if (threshold.critical !== undefined && value >= threshold.critical) {
        // Status determined by context - could be excellent or critical
      } else if (threshold.warning !== undefined && value >= threshold.warning) {
        // Warning status
      }
    }
  }, [metric?.value, threshold]);

  // Format metric value
  const formatValue = (value: number | string, format?: string, precision = 2) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: precision,
        }).format(value);
      case 'percentage':
        return `${(value * 100).toFixed(precision)}%`;
      case 'decimal':
        return value.toFixed(precision);
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      default:
        return String(value);
    }
  };

  // Handle card click
  const handleCardClick = useCallback(() => {
    if (clickable && !isDisabled && !loading) {
      onClick();
      
      // Audit trail logging
      if (auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Metric card clicked:', {
          action: 'metric_card_click',
          cardId: id,
          title,
          metricValue: metric?.value,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }
    }
  }, [clickable, isDisabled, loading, onClick, auditTrail, id, title, metric?.value, commerceState, workflowContext, userRole]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (!refreshable || isRefreshing || isDisabled) return;
    
    setIsRefreshing(true);
    
    try {
      await onRefresh();
      
      // Audit trail logging
      if (auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Metric card refreshed:', {
          action: 'metric_card_refresh',
          cardId: id,
          title,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshable, isRefreshing, isDisabled, onRefresh, auditTrail, id, title, commerceState, workflowContext, userRole]);

  // Handle action click
  const handleActionClick = useCallback((actionKey: string) => {
    if (!isDisabled) {
      onAction(actionKey);
      
      // Audit trail logging
      if (auditTrail.enabled && auditTrail.logUserActions) {
        console.log('Metric card action:', {
          action: 'metric_card_action',
          actionKey,
          cardId: id,
          title,
          timestamp: new Date(),
          commerceState,
          workflowContext,
          userRole
        });
      }

      if (onUpdate) {
        onUpdate({ action: actionKey, metricData: { id, title, value: metric?.value } });
      }
    }
  }, [isDisabled, onAction, onUpdate, auditTrail, id, title, metric?.value, commerceState, workflowContext, userRole]);

  // Get status color classes
  const getStatusColors = () => {
    switch (status) {
      case 'excellent':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          accent: 'bg-green-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          accent: 'bg-yellow-500'
        };
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          accent: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          text: 'text-gray-900',
          accent: 'bg-primary-500'
        };
    }
  };

  const statusColors = getStatusColors();

  // Build container classes
  const containerClasses = cn(
    'metric-card relative overflow-hidden transition-all duration-200',
    size === 'sm' && 'p-3',
    size === 'md' && 'p-4',
    size === 'lg' && 'p-6',
    variant === 'default' && `${statusColors.bg} border ${statusColors.border} rounded-lg shadow-sm`,
    variant === 'outlined' && `bg-transparent border-2 ${statusColors.border} rounded-lg`,
    variant === 'filled' && `${statusColors.bg} border ${statusColors.border} rounded-lg`,
    variant === 'minimal' && 'bg-transparent border-0',
    variant === 'gradient' && 'bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0 rounded-lg shadow-lg',
    clickable && !isDisabled && !loading && 'cursor-pointer hover:shadow-md hover:scale-105',
    isDisabled && 'opacity-60 cursor-not-allowed',
    loading && 'animate-pulse',
    commerceState === 'completion' && 'border-gray-300 bg-gray-50',
    className
  );

  // Build metric value classes
  const metricValueClasses = cn(
    'font-bold',
    size === 'sm' && 'text-xl',
    size === 'md' && 'text-2xl',
    size === 'lg' && 'text-3xl',
    variant === 'gradient' ? 'text-white' : statusColors.text
  );

  // Format last updated
  const formatLastUpdated = (timestamp: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
      return date.toLocaleDateString();
    } catch {
      return timestamp;
    }
  };

  // Trend icon
  const TrendIcon = ({ direction }: { direction: 'up' | 'down' | 'neutral' }) => {
    const iconClass = cn(
      'w-4 h-4',
      direction === 'up' && 'text-green-500',
      direction === 'down' && 'text-red-500',
      direction === 'neutral' && 'text-gray-500'
    );

    if (direction === 'up') {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5M7 7l5-5 5 5" />
        </svg>
      );
    }
    
    if (direction === 'down') {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-5 5-5-5M17 17l-5 5-5-5" />
        </svg>
      );
    }
    
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };

  // Refresh icon
  const RefreshIcon = () => (
    <svg
      className={cn('w-4 h-4', isRefreshing && 'animate-spin')}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );

  // Progress bar for target
  const TargetProgress = () => {
    if (!target || typeof metric?.value !== 'number') return null;
    
    const progress = (metric?.value / target) * 100;
    const isOverTarget = progress > 100;
    
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Target: {formatValue(target, metric?.format, metric?.precision)}</span>
          <span className={cn(
            'font-medium',
            isOverTarget ? 'text-green-600' : 'text-gray-600'
          )}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              isOverTarget ? 'bg-green-500' : 'bg-primary-500'
            )}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses} style={style} onClick={handleCardClick}>
      {/* Status Accent */}
      {variant !== 'minimal' && variant !== 'gradient' && (
        <div className={cn('absolute top-0 left-0 w-full h-1', statusColors.accent)} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-semibold truncate',
            size === 'sm' && 'text-sm',
            size === 'lg' && 'text-lg',
            variant === 'gradient' ? 'text-white' : 'text-gray-900'
          )}>
            {title}
          </h3>
          
          {subtitle && (
            <p className={cn(
              'text-sm truncate mt-1',
              variant === 'gradient' ? 'text-white/80' : 'text-gray-600'
            )}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2">
          {category && (
            <Badge
              variant={variant === 'gradient' ? 'secondary' : 'primary'}
              size="sm"
            >
              {category}
            </Badge>
          )}
          
          {refreshable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRefresh();
              }}
              disabled={isRefreshing || isDisabled}
              className={cn(
                'transition-colors',
                variant === 'gradient' ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-600'
              )}
              aria-label="Refresh metric"
            >
              <RefreshIcon />
            </button>
          )}
        </div>
      </div>

      {/* Metric Value */}
      <div className={cn(
        'flex items-baseline gap-2',
        layout === 'horizontal' && 'items-center'
      )}>
        <div className="flex items-baseline gap-1">
          {metric?.prefix && (
            <span className={cn(
              'text-sm font-medium',
              variant === 'gradient' ? 'text-white/80' : 'text-gray-600'
            )}>
              {metric.prefix}
            </span>
          )}
          {metric?.value && 
          <span className={metricValueClasses}>
            {formatValue(metric?.value, metric?.format, metric?.precision)}
          </span>}
          
          {metric?.unit && (
            <span className={cn(
              'text-sm font-medium ml-1',
              variant === 'gradient' ? 'text-white/80' : 'text-gray-600'
            )}>
              {metric.unit}
            </span>
          )}
          
          {metric?.suffix && (
            <span className={cn(
              'text-sm font-medium',
              variant === 'gradient' ? 'text-white/80' : 'text-gray-600'
            )}>
              {metric.suffix}
            </span>
          )}
        </div>

        {/* Trend */}
        {showTrend && trend && (
          <div className={cn(
            'flex items-center gap-1 text-sm',
            trend.isPositive === false ? 'text-red-500' : trend.direction === 'up' ? 'text-green-500' : trend.direction === 'down' ? 'text-red-500' : 'text-gray-500'
          )}>
            <TrendIcon direction={trend.direction || 'neutral'} />
            <span className="font-medium">
              {formatValue(Math.abs(trend.value || 0), 'percentage', 1)}
            </span>
            <span className="text-xs">
              {trend.period}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className={cn(
          'text-sm mt-2',
          variant === 'gradient' ? 'text-white/80' : 'text-gray-600'
        )}>
          {description}
        </p>
      )}

      {/* Target Progress */}
      {showTarget && target && <TargetProgress />}

      {/* Comparison */}
      {showComparison && comparison && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{comparison.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                {formatValue(comparison.previous || 0, comparison.format)}
              </span>
              <span className="text-gray-400">→</span>
              <span className="font-medium text-gray-900">
                {formatValue(comparison.current || 0, comparison.format)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-gray-500">
          {showLastUpdated && lastUpdated && (
            <span>Updated {formatLastUpdated(lastUpdated)}</span>
          )}
          
          {commerceState && commerceState !== 'initiation' && (
            <Badge variant="secondary" size="sm" className="ml-2">
              {commerceState}
            </Badge>
          )}
        </div>

        {/* Actions */}
        {showActions && actions.length > 0 && (
          <div className="flex items-center gap-1">
            {actions.map((action) => (
              <Button
                key={action.key}
                variant={action.variant || 'tertiary'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  action.key && handleActionClick(action.key);
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

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" />
        </div>
      )}

      {/* AI Config Display (development only) */}
      {process.env.NODE_ENV === 'development' && aiConfig && (
        <div className="absolute -top-6 left-0 p-1 bg-blue-50 rounded text-xs text-blue-600 z-50 opacity-0 hover:opacity-100 transition-opacity">
          AI: {JSON.stringify(aiConfig.layout)}
        </div>
      )}
    </div>
  );
};

MetricCard.displayName = 'MetricCard';

export default MetricCard;