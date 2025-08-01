import React, { useState, useMemo, useCallback } from 'react';
import { WorkflowTrackerProps } from '../../../types';

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  id,
  title = 'Workflow Tracker',
  workflows = [],
  groupBy = 'none',
  filters = {},
  layout = 'list',
  size = 'md',
  showMetrics = true,
  showFilters = true,
  autoRefresh = false,
  refreshInterval = 30000,
  onWorkflowClick,
  onWorkflowAction,
  onFilterChange,
  className = '',
  style = {},
  commerceState = 'execution',
  allowedActions = [],
  userRole,
  encryptionLevel = 'none',
  auditTrail,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'priority' | 'dueDate'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Auto-refresh logic
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Trigger refresh callback if provided
      console.log('Auto-refreshing workflow data...');
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Filter workflows based on current filters
  const filteredWorkflows = useMemo(() => {
    return workflows.filter(workflow => {
      if (localFilters.status?.length && !localFilters.status.includes(workflow.status)) return false;
      if (localFilters.assignee?.length && !localFilters.assignee.includes(workflow.assignee)) return false;
      if (localFilters.priority?.length && !localFilters.priority.includes(workflow.priority)) return false;
      if (localFilters.dateRange) {
        const startDate = new Date(localFilters.dateRange.start);
        const endDate = new Date(localFilters.dateRange.end);
        const workflowDate = new Date(workflow.startDate || '');
        if (workflowDate < startDate || workflowDate > endDate) return false;
      }
      return true;
    });
  }, [workflows, localFilters]);

  // Sort workflows
  const sortedWorkflows = useMemo(() => {
    return [...filteredWorkflows].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'dueDate') {
        const aTime = new Date(a.dueDate || '').getTime();
        const bTime = new Date(b.dueDate || '').getTime();
        aValue = aTime;
        bValue = bTime;
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredWorkflows, sortBy, sortDirection]);

  // Group workflows
  const groupedWorkflows = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Workflows': sortedWorkflows };
    }

    const groups: { [key: string]: typeof workflows } = {};
    sortedWorkflows.forEach(workflow => {
      const groupKey = (groupBy && workflow ? workflow[groupBy as keyof typeof workflow] : undefined) || 'Unassigned';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(workflow);
    });

    return groups;
  }, [sortedWorkflows, groupBy]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = workflows.length;
    const active = workflows.filter(w => w.status === 'active').length;
    const completed = workflows.filter(w => w.status === 'completed').length;
    const failed = workflows.filter(w => w.status === 'failed').length;
    const paused = workflows.filter(w => w.status === 'paused').length;

    return { total, active, completed, failed, paused };
  }, [workflows]);

  const handleFilterChange = useCallback((newFilters: any) => {
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  }, [onFilterChange]);

  const handleWorkflowClick = useCallback((workflow: any) => {
    onWorkflowClick?.(workflow);
  }, [onWorkflowClick]);

  const handleWorkflowAction = useCallback((workflowId: string, action: string) => {
    onWorkflowAction?.(workflowId, action);
  }, [onWorkflowAction]);

  const toggleGroupExpansion = useCallback((groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderMetrics = () => {
    if (!showMetrics) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600">Total</h4>
          <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-600">Active</h4>
          <p className="text-2xl font-bold text-green-900">{metrics.active}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-600">Completed</h4>
          <p className="text-2xl font-bold text-blue-900">{metrics.completed}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-red-600">Failed</h4>
          <p className="text-2xl font-bold text-red-900">{metrics.failed}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-600">Paused</h4>
          <p className="text-2xl font-bold text-yellow-900">{metrics.paused}</p>
        </div>
      </div>
    );
  };

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={localFilters.status?.[0] || ''}
              onChange={(e) => handleFilterChange({
                ...localFilters,
                status: e.target.value ? [e.target.value] : []
              })}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Priority:</label>
            <select
              value={localFilters.priority?.[0] || ''}
              onChange={(e) => handleFilterChange({
                ...localFilters,
                priority: e.target.value ? [e.target.value] : []
              })}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Group By:</label>
            <select
              value={groupBy}
              onChange={(e) => handleFilterChange({
                ...localFilters,
                groupBy: e.target.value
              })}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="none">None</option>
              <option value="status">Status</option>
              <option value="assignee">Assignee</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="name">Name</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
            </select>
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderWorkflowCard = (workflow: any) => {
    const progress = workflow.completedSteps && workflow.totalSteps 
      ? (workflow.completedSteps / workflow.totalSteps) * 100 
      : 0;

    return (
      <div
        key={workflow.id}
        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleWorkflowClick(workflow)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">{workflow.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                {workflow.status}
              </span>
              {workflow.priority && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(workflow.priority)}`}>
                  {workflow.priority}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            {allowedActions.includes('pause') && workflow.status === 'active' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleWorkflowAction(workflow.id, 'pause');
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Pause workflow"
              >
                ⏸️
              </button>
            )}
            {allowedActions.includes('resume') && workflow.status === 'paused' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleWorkflowAction(workflow.id, 'resume');
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Resume workflow"
              >
                ▶️
              </button>
            )}
            {allowedActions.includes('cancel') && ['active', 'paused'].includes(workflow.status) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleWorkflowAction(workflow.id, 'cancel');
                }}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Cancel workflow"
              >
                ❌
              </button>
            )}
          </div>
        </div>

        {workflow.currentStep && (
          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-1">
              Current Step: <span className="font-medium">{workflow.currentStep}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {workflow.completedSteps || 0} of {workflow.totalSteps || 0} steps completed ({Math.round(progress)}%)
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            {workflow.assignee && (
              <span>👤 {workflow.assignee}</span>
            )}
            {workflow.startDate && (
              <span>📅 Started {new Date(workflow.startDate).toLocaleDateString()}</span>
            )}
          </div>
          {workflow.dueDate && (
            <span className={`${new Date(workflow.dueDate) < new Date() ? 'text-red-600' : 'text-gray-600'}`}>
              Due {new Date(workflow.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderKanbanColumn = (status: string, workflows: any[]) => {
    return (
      <div key={status} className="flex-1 min-w-0">
        <div className="bg-gray-100 p-3 rounded-t-lg">
          <h3 className="font-medium text-gray-900 capitalize">{status}</h3>
          <span className="text-sm text-gray-600">({workflows.length})</span>
        </div>
        <div className="space-y-3 p-3 bg-gray-50 rounded-b-lg min-h-64">
          {workflows.map(renderWorkflowCard)}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (layout === 'kanban') {
      const kanbanGroups = {
        active: filteredWorkflows.filter(w => w.status === 'active'),
        paused: filteredWorkflows.filter(w => w.status === 'paused'),
        completed: filteredWorkflows.filter(w => w.status === 'completed'),
        failed: filteredWorkflows.filter(w => w.status === 'failed'),
        cancelled: filteredWorkflows.filter(w => w.status === 'cancelled'),
      };

      return (
        <div className="flex space-x-4 overflow-x-auto">
          {Object.entries(kanbanGroups).map(([status, workflows]) =>
            renderKanbanColumn(status, workflows)
          )}
        </div>
      );
    }

    if (layout === 'timeline') {
      const timelineWorkflows = sortedWorkflows.sort((a, b) => 
        new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime()
      );

      return (
        <div className="space-y-6">
          {timelineWorkflows.map((workflow, index) => (
            <div key={workflow.id} className="relative">
              {index !== timelineWorkflows.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-300" />
              )}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  {renderWorkflowCard(workflow)}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default list layout
    return (
      <div className="space-y-6">
        {Object.entries(groupedWorkflows).map(([groupName, groupWorkflows]) => (
          <div key={groupName}>
            {groupBy !== 'none' && (
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => toggleGroupExpansion(groupName)}
                  className="flex items-center space-x-2 text-lg font-medium text-gray-900 hover:text-gray-700"
                >
                  <span>{expandedGroups.has(groupName) ? '▼' : '▶'}</span>
                  <span>{groupName}</span>
                  <span className="text-sm text-gray-600">({groupWorkflows.length})</span>
                </button>
              </div>
            )}
            
            {(groupBy === 'none' || expandedGroups.has(groupName)) && (
              <div className="grid gap-4">
                {groupWorkflows.map(renderWorkflowCard)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      id={id}
      className={`workflow-tracker ${sizeClasses[size]} ${className}`}
      style={style}
      role="region"
      aria-label="Workflow Tracker"
    >
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {autoRefresh && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>🔄</span>
              <span>Auto-refresh every {refreshInterval / 1000}s</span>
            </div>
          )}
        </div>
      )}

      {renderMetrics()}
      {renderFilters()}
      
      {filteredWorkflows.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
          <p className="text-gray-600">Try adjusting your filters or create a new workflow.</p>
        </div>
      ) : (
        renderContent()
      )}

      {/* Audit trail logging */}
      {auditTrail?.enabled && commerceState && (
        <div className="sr-only">
          Workflow tracker viewed - Commerce State: {commerceState}, 
          Total Workflows: {filteredWorkflows.length}, 
          User: {userRole?.name || 'Unknown'}
        </div>
      )}
    </div>
  );
};

export default WorkflowTracker;