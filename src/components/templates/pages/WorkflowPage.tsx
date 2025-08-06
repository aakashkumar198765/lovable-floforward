import React, { useState, useCallback, useMemo } from 'react';
import { WorkflowPageProps } from '../../../types';
import { Search } from 'lucide-react';

export const WorkflowPage: React.FC<WorkflowPageProps> = ({
  id,
  title = 'Workflow Management',
  description = 'Design, monitor, and manage your business workflows',
  workflows = [],
  templates = [],
  currentWorkflow,
  showDesigner = true,
  showTemplates = true,
  showMetrics = true,
  showHistory = true,
  designerMode = 'visual',
  viewMode = 'list',
  size = 'md',
  setViewMode = () => {},
  setDesignerMode = () => {},
  onWorkflowSelect,
  onWorkflowCreate,
  onWorkflowUpdate,
  onWorkflowDelete,
  onWorkflowExecute,
  onWorkflowPause,
  onWorkflowResume,
  onWorkflowCancel,
  onTemplateSelect,
  onStepEdit,
  onConnectionEdit,
  className = '',
  style = {},
  children,
  allowedActions = [],
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(currentWorkflow);
  const [activeTab, setActiveTab] = useState<'list' | 'designer' | 'templates' | 'metrics' | 'history'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [designerZoom, setDesignerZoom] = useState(100);

  const handleWorkflowSelect = useCallback((workflow: any) => {
    setSelectedWorkflow(workflow);
    onWorkflowSelect?.(workflow);
  }, [onWorkflowSelect]);

  const handleWorkflowAction = useCallback((workflowId: string, action: string) => {
    switch (action) {
      case 'execute':
        onWorkflowExecute?.(workflowId);
        break;
      case 'pause':
        onWorkflowPause?.(workflowId);
        break;
      case 'resume':
        onWorkflowResume?.(workflowId);
        break;
      case 'cancel':
        onWorkflowCancel?.(workflowId);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this workflow?')) {
          onWorkflowDelete?.(workflowId);
        }
        break;
    }
  }, [onWorkflowExecute, onWorkflowPause, onWorkflowResume, onWorkflowCancel, onWorkflowDelete]);

  const handleBulkAction = useCallback((action: string) => {
    selectedWorkflows.forEach(workflowId => {
      handleWorkflowAction(workflowId, action);
    });
    setSelectedWorkflows([]);
  }, [selectedWorkflows, handleWorkflowAction]);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter(workflow => {
      const matchesSearch = !searchTerm || 
        workflow.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || workflow.status === filterStatus;
      const matchesCategory = !filterCategory || workflow.category === filterCategory;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [workflows, searchTerm, filterStatus, filterCategory]);

  const workflowMetrics = useMemo(() => {
    const total = workflows.length;
    const active = workflows.filter(w => w.status === 'running').length;
    const completed = workflows.filter(w => w.status === 'completed').length;
    const failed = workflows.filter(w => w.status === 'failed').length;
    const paused = workflows.filter(w => w.status === 'paused').length;

    return { total, active, completed, failed, paused };
  }, [workflows]);

  const sizeClasses = {
    sm: 'max-w-5xl',
    md: 'max-w-7xl',
    lg: 'max-w-full'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTabNavigation = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'list', label: 'Workflows', icon: '📋' },
          ...(showDesigner ? [{ id: 'designer', label: 'Designer', icon: '🎨' }] : []),
          ...(showTemplates ? [{ id: 'templates', label: 'Templates', icon: '📄' }] : []),
          ...(showMetrics ? [{ id: 'metrics', label: 'Analytics', icon: '📊' }] : []),
          ...(showHistory ? [{ id: 'history', label: 'History', icon: '📜' }] : [])
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  const renderFiltersAndControls = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="running">Running</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="approval">Approval</option>
            <option value="automation">Automation</option>
            <option value="integration">Integration</option>
            <option value="notification">Notification</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              ☰
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              ⊞
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Bulk Actions */}
          {selectedWorkflows.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedWorkflows.length} selected</span>
              <button
                onClick={() => handleBulkAction('execute')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Execute
              </button>
              <button
                onClick={() => handleBulkAction('pause')}
                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Pause
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}

          {/* Create Workflow */}
          {allowedActions.includes('create_workflow') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              ➕ Create Workflow
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderWorkflowList = () => (
    <div className="space-y-4">
      {filteredWorkflows.map(workflow => (
        <div key={workflow.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedWorkflows.includes(workflow.id)}
                onChange={(e) => {
                  setSelectedWorkflows(prev => 
                    e.target.checked 
                      ? [...prev, workflow.id]
                      : prev.filter(id => id !== workflow.id)
                  );
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              
              <div className="flex-1 cursor-pointer" onClick={() => handleWorkflowSelect(workflow)}>
                <h3 className="text-lg font-medium text-gray-900">{workflow.name}</h3>
                <p className="text-sm text-gray-600">{workflow.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                    {workflow.status}
                  </span>
                  {workflow.category && (
                    <span className="text-xs text-gray-500">{workflow.category}</span>
                  )}
                  {workflow.lastRun && (
                    <span className="text-xs text-gray-500">
                      Last run: {new Date(workflow.lastRun).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {workflow.status === 'draft' && allowedActions.includes('execute_workflow') && (
                <button
                  onClick={() => handleWorkflowAction(workflow.id, 'execute')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  ▶ Execute
                </button>
              )}
              
              {workflow.status === 'running' && allowedActions.includes('pause_workflow') && (
                <button
                  onClick={() => handleWorkflowAction(workflow.id, 'pause')}
                  className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  ⏸ Pause
                </button>
              )}
              
              {workflow.status === 'paused' && allowedActions.includes('resume_workflow') && (
                <button
                  onClick={() => handleWorkflowAction(workflow.id, 'resume')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ▶ Resume
                </button>
              )}

              {allowedActions.includes('edit_workflow') && (
                <button
                  onClick={() => setActiveTab('designer')}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  ✏ Edit
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWorkflowGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredWorkflows.map(workflow => (
        <div key={workflow.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1" onClick={() => handleWorkflowSelect(workflow)}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{workflow.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                {workflow.status}
              </span>
            </div>
            <input
              type="checkbox"
              checked={selectedWorkflows.includes(workflow.id)}
              onChange={(e) => {
                setSelectedWorkflows(prev => 
                  e.target.checked 
                    ? [...prev, workflow.id]
                    : prev.filter(id => id !== workflow.id)
                );
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>{workflow.steps?.length || 0} steps</span>
            <span>{workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString() : 'Never run'}</span>
          </div>

          <div className="flex space-x-2">
            {workflow.status === 'draft' && (
              <button
                onClick={() => handleWorkflowAction(workflow.id, 'execute')}
                className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Execute
              </button>
            )}
            <button
              onClick={() => setActiveTab('designer')}
              className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWorkflowDesigner = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {selectedWorkflow ? `Editing: ${selectedWorkflow.name}` : 'Workflow Designer'}
        </h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Zoom:</label>
            <input
              type="range"
              min="50"
              max="200"
              value={designerZoom}
              onChange={(e) => setDesignerZoom(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600">{designerZoom}%</span>
          </div>
          <button
            onClick={() => setDesignerMode(designerMode === 'visual' ? 'code' : 'visual')}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            {designerMode === 'visual' ? '{ }' : '🎨'} {designerMode === 'visual' ? 'Code' : 'Visual'}
          </button>
        </div>
      </div>

      <div className="h-96 p-4" style={{ zoom: `${designerZoom}%` }}>
        {designerMode === 'visual' ? (
          <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Visual Workflow Designer</h4>
              <p className="text-gray-600">Drag and drop workflow builder would be implemented here</p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <textarea
              className="w-full h-full p-4 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="// Workflow definition in JSON or YAML format"
              defaultValue={selectedWorkflow ? JSON.stringify(selectedWorkflow, null, 2) : ''}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map(template => (
        <div key={template.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {template.category}
                </span>
                <span className="text-xs text-gray-500">
                  {template.usageCount || 0} uses
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onTemplateSelect?.(template)}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Use Template
            </button>
            <button
              onClick={() => {/* Preview template */}}
              className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              👁
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-600">Total Workflows</h4>
          <p className="text-2xl font-bold text-gray-900">{workflowMetrics.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm font-medium text-green-600">Running</h4>
          <p className="text-2xl font-bold text-green-900">{workflowMetrics.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm font-medium text-blue-600">Completed</h4>
          <p className="text-2xl font-bold text-blue-900">{workflowMetrics.completed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm font-medium text-red-600">Failed</h4>
          <p className="text-2xl font-bold text-red-900">{workflowMetrics.failed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm font-medium text-yellow-600">Paused</h4>
          <p className="text-2xl font-bold text-yellow-900">{workflowMetrics.paused}</p>
        </div>
      </div>

      {/* Charts would go here */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Workflow Performance</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-600">Performance charts would be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Execution History</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Mock history entries */}
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div>
                <div className="font-medium text-gray-900">Workflow {i} Execution</div>
                <div className="text-sm text-gray-600">
                  Executed {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleString()}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                i % 3 === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {i % 3 === 0 ? 'Failed' : 'Success'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'designer':
        return renderWorkflowDesigner();
      case 'templates':
        return renderTemplates();
      case 'metrics':
        return renderMetrics();
      case 'history':
        return renderHistory();
      default:
        return viewMode === 'grid' ? renderWorkflowGrid() : renderWorkflowList();
    }
  };

  return (
    <div
      id={id}
      className={`workflow-page ${className}`}
      style={style}
      role="main"
      aria-label="Workflow Page"
    >
      <div className="py-8">
        <div className={`mx-auto px-6 ${sizeClasses[size]}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Action Buttons */}
            </div>
          </div>

          {renderTabNavigation()}
          {activeTab === 'list' && renderFiltersAndControls()}
          {renderTabContent()}

          {children}
        </div>
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Create New Workflow</h3>
            <p className="text-gray-600 mb-4">Workflow creation form would go here...</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onWorkflowCreate?.({ name: 'New Workflow', description: 'Description' });
                  setShowCreateModal(false);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowPage;