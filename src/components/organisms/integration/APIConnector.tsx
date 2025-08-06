import React, { useState, useMemo, useCallback } from 'react';
import { APIConnectorProps } from '../../../types';

export const APIConnector: React.FC<APIConnectorProps> = ({
  id,
  title = 'API Connector',
  endpoints = [],
  integrations = [],
  layout = 'tabs',
  testable = true,
  monitorable = true,
  size = 'md',
  showLogs = true,
  showMetrics = true,
  onEndpointTest,
  onEndpointSave,
  onIntegrationToggle,
  onIntegrationRun,
  onIntegrationCreate,
  className = '',
  style = {},
  allowedActions = [],
  userRole,
  exportable = true,
  importable = true,
}) => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'integrations' | 'logs' | 'metrics'>('endpoints');
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [showEndpointModal, setShowEndpointModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: any }>({});
  const [isTestingEndpoint, setIsTestingEndpoint] = useState<string>('');
  const [editingEndpoint, setEditingEndpoint] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({});

  // Filter endpoints and integrations by status
  const endpointsByStatus = useMemo(() => {
    const groups: { [status: string]: any[] } = {
      connected: [],
      disconnected: [],
      error: [],
      testing: []
    };
    
    endpoints.forEach(endpoint => {
      const status = endpoint.status || 'disconnected';
      if (groups[status]) {
        groups[status].push(endpoint);
      }
    });
    
    return groups;
  }, [endpoints]);

  const integrationsByStatus = useMemo(() => {
    const groups: { [status: string]: any[] } = {
      active: [],
      paused: [],
      error: []
    };
    
    integrations.forEach(integration => {
      const status = integration.status || 'paused';
      if (groups[status]) {
        groups[status].push(integration);
      }
    });
    
    return groups;
  }, [integrations]);

  const handleTestEndpoint = useCallback(async (endpointId: string) => {
    if (!onEndpointTest) return;
    
    setIsTestingEndpoint(endpointId);
    
    try {
      const result = await onEndpointTest(endpointId);
      setTestResults(prev => ({ ...prev, [endpointId]: result }));
      
      // Log the test
      const logEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'endpoint_test',
        endpointId,
        status: result.success ? 'success' : 'error',
        message: result.message || 'Endpoint test completed',
        user: userRole?.name || 'Unknown'
      };
      setLogs(prev => [logEntry, ...prev].slice(0, 100)); // Keep last 100 logs
      
    } catch (error) {
      console.error('Endpoint test failed:', error);
      setTestResults(prev => ({ 
        ...prev, 
        [endpointId]: { success: false, error: (error as Error).message } 
      }));
    } finally {
      setIsTestingEndpoint('');
    }
  }, [onEndpointTest, userRole]);

  const handleSaveEndpoint = useCallback((endpointData: any) => {
    onEndpointSave?.(endpointData);
    setEditingEndpoint(null);
    setShowEndpointModal(false);
  }, [onEndpointSave]);

  const handleToggleIntegration = useCallback((integrationId: string, active: boolean) => {
    onIntegrationToggle?.(integrationId, active);
    
    // Log the action
    const logEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'integration_toggle',
      integrationId,
      status: active ? 'activated' : 'deactivated',
      message: `Integration ${active ? 'activated' : 'deactivated'}`,
      user: userRole?.name || 'Unknown'
    };
    setLogs(prev => [logEntry, ...prev].slice(0, 100));
  }, [onIntegrationToggle, userRole]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active': return 'text-green-600 bg-green-100';
      case 'disconnected':
      case 'paused': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'testing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method?.toUpperCase()) {
      case 'GET': return 'text-blue-600 bg-blue-100';
      case 'POST': return 'text-green-600 bg-green-100';
      case 'PUT': return 'text-yellow-600 bg-yellow-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      case 'PATCH': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderTabNavigation = () => {
    const tabs = [
      { key: 'endpoints', label: 'API Endpoints', count: endpoints.length },
      { key: 'integrations', label: 'Integrations', count: integrations.length },
    ];

    if (showLogs) tabs.push({ key: 'logs', label: 'Activity Logs', count: logs.length });
    if (showMetrics) tabs.push({ key: 'metrics', label: 'Metrics', count: 0 });

    return (
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    );
  };

  const renderEndpointCard = (endpoint: any) => (
    <div key={endpoint.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900">{endpoint.name}</h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(endpoint.status || 'disconnected')}`}>
              {endpoint.status || 'disconnected'}
            </span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(endpoint.method)}`}>
              {endpoint.method}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
          <p className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
            {endpoint.url}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Authentication</h4>
          <p className="text-sm text-gray-600">
            {endpoint.authentication?.type || 'None'}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Last Tested</h4>
          <p className="text-sm text-gray-600">
            {endpoint.lastTested ? new Date(endpoint.lastTested).toLocaleString() : 'Never'}
          </p>
        </div>
      </div>

      {endpoint.parameters && endpoint.parameters.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Parameters</h4>
          <div className="space-y-1">
            {endpoint.parameters.slice(0, 3).map((param: any, index: number) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">{param.name}</span>
                <span className={`px-1 py-0.5 text-xs rounded ${param.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                  {param.required ? 'required' : 'optional'}
                </span>
              </div>
            ))}
            {endpoint.parameters.length > 3 && (
              <p className="text-xs text-gray-500">+{endpoint.parameters.length - 3} more parameters</p>
            )}
          </div>
        </div>
      )}

      {testResults[endpoint.id] && (
        <div className={`mb-4 p-3 rounded-lg ${testResults[endpoint.id].success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${testResults[endpoint.id].success ? 'text-green-800' : 'text-red-800'}`}>
              {testResults[endpoint.id].success ? '✅ Test Passed' : '❌ Test Failed'}
            </span>
          </div>
          {testResults[endpoint.id].message && (
            <p className={`text-sm mt-1 ${testResults[endpoint.id].success ? 'text-green-700' : 'text-red-700'}`}>
              {testResults[endpoint.id].message}
            </p>
          )}
        </div>
      )}

      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        {testable && allowedActions.includes('test_endpoints') && (
          <button
            onClick={() => handleTestEndpoint(endpoint.id)}
            disabled={isTestingEndpoint === endpoint.id}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isTestingEndpoint === endpoint.id ? 'Testing...' : 'Test'}
          </button>
        )}
        
        {allowedActions.includes('edit_endpoints') && (
          <button
            onClick={() => setEditingEndpoint(endpoint)}
            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => setSelectedEndpoint(endpoint)}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Details
        </button>
      </div>
    </div>
  );

  const renderIntegrationCard = (integration: any) => (
    <div key={integration.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integration.status || 'paused')}`}>
              {integration.status || 'paused'}
            </span>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              {integration.type}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {integration.source} → {integration.target}
          </p>
        </div>

        {allowedActions.includes('toggle_integrations') && (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={integration.status === 'active'}
              onChange={(e) => handleToggleIntegration(integration.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Last Run</h4>
          <p className="text-sm text-gray-600">
            {integration.lastRun ? new Date(integration.lastRun).toLocaleString() : 'Never'}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Next Run</h4>
          <p className="text-sm text-gray-600">
            {integration.nextRun ? new Date(integration.nextRun).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>

      {integration.schedule && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Schedule</h4>
          <p className="text-sm text-gray-600">{integration.schedule}</p>
        </div>
      )}

      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        {allowedActions.includes('run_integrations') && integration.status === 'active' && (
          <button
            onClick={() => onIntegrationRun?.(integration.id)}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Run Now
          </button>
        )}
        
        {allowedActions.includes('edit_integrations') && (
          <button
            onClick={() => setSelectedIntegration(integration)}
            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Configure
          </button>
        )}
      </div>
    </div>
  );

  const renderEndpoints = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">API Endpoints</h3>
        {allowedActions.includes('create_endpoints') && (
          <button
            onClick={() => setShowEndpointModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ Add Endpoint
          </button>
        )}
      </div>

      {endpoints.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No endpoints configured</h3>
          <p className="text-gray-600">Add your first API endpoint to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(endpointsByStatus).map(([status, statusEndpoints]) => (
            statusEndpoints.length > 0 && (
              <div key={status}>
                <h4 className="font-medium text-gray-700 mb-4 capitalize">
                  {status} ({statusEndpoints.length})
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {statusEndpoints.map(renderEndpointCard)}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );

  const renderIntegrations = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Data Integrations</h3>
        {allowedActions.includes('create_integrations') && (
          <button
            onClick={() => setShowIntegrationModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ➕ Create Integration
          </button>
        )}
      </div>

      {integrations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations configured</h3>
          <p className="text-gray-600">Create your first data integration to sync information.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(integrationsByStatus).map(([status, statusIntegrations]) => (
            statusIntegrations.length > 0 && (
              <div key={status}>
                <h4 className="font-medium text-gray-700 mb-4 capitalize">
                  {status} ({statusIntegrations.length})
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {statusIntegrations.map(renderIntegrationCard)}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );

  const renderLogs = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Activity Logs</h3>
      
      {logs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activity logs</h3>
          <p className="text-gray-600">API activity will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                    <span className="text-sm text-gray-600">{log.type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm text-gray-900">{log.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(log.timestamp).toLocaleString()} • {log.user}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMetrics = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Performance Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Total Endpoints</h4>
          <p className="text-3xl font-bold text-blue-600">{endpoints.length}</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Connected</h4>
          <p className="text-3xl font-bold text-green-600">
            {endpointsByStatus.connected?.length || 0}
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Integrations</h4>
          <p className="text-3xl font-bold text-green-600">
            {integrationsByStatus.active?.length || 0}
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Error Rate</h4>
          <p className="text-3xl font-bold text-red-600">
            {Math.round(((endpointsByStatus.error?.length || 0) / endpoints.length) * 100) || 0}%
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'integrations': return renderIntegrations();
      case 'logs': return renderLogs();
      case 'metrics': return renderMetrics();
      default: return renderEndpoints();
    }
  };

  return (
    <div
      id={id}
      className={`api-connector ${sizeClasses[size]} ${className}`}
      style={style}
      role="region"
      aria-label="API Connector"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {endpoints.length} endpoints • {integrations.length} integrations
          </div>
          <div className="flex items-center space-x-2">
            {exportable && <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Export
            </button>}
            {importable && <button className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
              Import
            </button>}
          </div>
        </div>
      </div>

      {layout === 'tabs' ? renderTabNavigation() : null}
      {renderContent()}

      {/* Simplified modals */}
      {showEndpointModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Add API Endpoint</h3>
            <p className="text-gray-600 mb-4">Endpoint configuration form would go here...</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEndpointModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEndpoint({ name: 'New Endpoint' })}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIConnector;