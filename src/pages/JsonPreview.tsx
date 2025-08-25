import React, { useState } from 'react';
import { Button, Icon } from '../components';

interface JsonPreviewProps {
  schema?: any;
  stateName?: string;
  data?: any;
  title?: string;
  onClose?: () => void;
}

const JsonPreview: React.FC<JsonPreviewProps> = ({ 
  schema = null, 
  stateName, 
  data = null, 
  title = "Node Details",
  onClose 
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'ui' | 'json'>('preview');

  // Simple node type detection
  const getNodeType = () => {
    if (stateName === "project-plan-node") return "root";
    if (stateName?.endsWith("-node")) return "workflow";
    return "state";
  };

  const nodeType = getNodeType();

  // Simple styling
  const getNodeStyling = () => {
    switch (nodeType) {
      case "root":
        return { color: "bg-blue-500", icon: "home", label: "Project" };
      case "workflow":
        return { color: "bg-amber-500", icon: "package", label: "Workflow" };
      default:
        return { color: "bg-green-500", icon: "circle", label: "State" };
    }
  };

  const styling = getNodeStyling();

  const handleCopy = async (content: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(content, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Get content to display
  const getContent = () => {
    if (schema) return { content: schema, title: 'Schema' };
    if (data) return { content: data, title: 'Node Data' };
    return { content: { nodeId: stateName, type: nodeType }, title: 'Basic Info' };
  };

  const { content, title: contentTitle } = getContent();

  // Render JSON as human-readable UI
  const renderJsonAsUI = (data: any, depth: number = 0): React.ReactNode => {
    if (data === null || data === undefined) {
      return <span className="text-gray-500 italic">null</span>;
    }

    if (typeof data === 'string') {
      return <span className="text-blue-600 font-medium">"{data}"</span>;
    }

    if (typeof data === 'number') {
      return <span className="text-green-600 font-medium">{data}</span>;
    }

    if (typeof data === 'boolean') {
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${data ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {data ? 'true' : 'false'}
        </span>
      );
    }

    if (Array.isArray(data)) {
      return (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-gray-500 text-sm w-6 flex-shrink-0">{index}:</span>
              <div className="flex-1">
                {renderJsonAsUI(item, depth + 1)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (typeof data === 'object') {
      return (
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="border-l-2 border-gray-200 pl-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-gray-900 font-medium text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-gray-500 text-xs">
                  ({typeof value})
                </span>
              </div>
              <div className="ml-4">
                {renderJsonAsUI(value, depth + 1)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-gray-600">{String(data)}</span>;
  };

  // Render rich UI preview with proper interface elements
  const renderRichUIPreview = (data: any): React.ReactNode => {
    if (!data || typeof data !== 'object') {
      return (
        <div className="text-center py-8 text-gray-500">
          <Icon name="alert-circle" size="lg" className="mx-auto mb-2 text-gray-400" />
          <p>No data available to preview</p>
        </div>
      );
    }

    // Handle state machine data (workflow/project)
    if (data.Name && data.AppType) {
      return (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="info" size="sm" />
              Workflow Information
            </h3>
            <div className="grid gap-3">
              {data.StartAt && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">Starts at:</span>
                    <span className="ml-2 text-sm text-gray-900 font-medium">{data.StartAt}</span>
                  </div>
                </div>
              )}
              
              {data.AppType && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">App Type:</span>
                    <span className="ml-2 text-sm text-gray-900 font-medium">{data.AppType}</span>
                  </div>
                </div>
              )}
              
              {data.Desc && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">Description:</span>
                    <p className="mt-1 text-sm text-gray-900">{data.Desc}</p>
                  </div>
                </div>
              )}
            </div>
          </div>


            {/* Organizations Section */}
            {data.Organizations && data.Organizations.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="building" size="sm" />
                Organizations ({data.Organizations.length})
              </h3>
              <div className="space-y-3">
                {data.Organizations.map((org: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-2">{org.Name}</h4>
                    {org.Desc && <p className="text-sm text-gray-600 mb-2">{org.Desc}</p>}
                    {org.Teams && org.Teams.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-700">Teams:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {org.Teams.map((team: any, teamIndex: number) => (
                            <span key={teamIndex} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                              {team.Role}: {team.Desc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* States Section */}
          {data.States && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="document" size="sm" />
                States ({Object.keys(data.States).length})
              </h3>
              <div className="grid gap-4">
                {Object.entries(data.States).map(([stateName, stateData]: [string, any]) => (
                  <div key={stateName} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="truncate">{stateName}</span>
                      </h4>
                      {stateData.Desc && (
                        <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded flex-shrink-0 ml-2">
                          {stateData.Desc}
                        </span>
                      )}
                    </div>
                    
                    {/* State Details */}
                    <div className="space-y-3">
                      {stateData.Owner && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Owners:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Array.isArray(stateData.Owner) ? stateData.Owner.map((owner: string) => (
                              <span key={owner} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {owner}
                              </span>
                            )) : (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {stateData.Owner}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {stateData.Props && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Properties:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(stateData.Props).map(([prop, value]: [string, any]) => (
                              <span key={prop} className={`text-xs px-2 py-1 rounded-full ${
                                value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {prop.replace(/([A-Z])/g, ' $1').trim()}: {value ? 'Yes' : 'No'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {stateData.Visibility && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Visibility:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(stateData.Visibility).map(([role, hasAccess]: [string, any]) => (
                              <span key={role} className={`text-xs px-2 py-1 rounded-full ${
                                hasAccess ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {role.replace(/([A-Z])/g, ' $1').trim()}: {hasAccess ? 'Access' : 'No Access'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {stateData.NextState && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Next State:</span>
                          <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            {stateData.NextState}
                          </span>
                        </div>
                      )}

                      {stateData.SubStates && Object.keys(stateData.SubStates).length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Sub-States:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.keys(stateData.SubStates).map((subStateName) => (
                              <span key={subStateName} className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                                {subStateName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      );
    }

    // Handle state data (when viewing a specific state)
    if (data.workflowName && data.stateName && data.stateData) {
      return (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
                <Icon name="circle" size="lg" className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.stateName}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Icon name="git-branch" size="sm" />
                    State of {data.workflowName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* State Details */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="info" size="sm" />
              State Details
            </h3>
            <div className="space-y-4">
              {data.stateData.Desc && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Description:</span>
                  <p className="text-gray-700 mt-1">{data.stateData.Desc}</p>
                </div>
              )}

              {data.stateData.Owner && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Owners:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Array.isArray(data.stateData.Owner) ? data.stateData.Owner.map((owner: string) => (
                      <span key={owner} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {owner}
                      </span>
                    )) : (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {data.stateData.Owner}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {data.stateData.Visibility && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Visibility:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(data.stateData.Visibility).map(([role, hasAccess]: [string, any]) => (
                      <span key={role} className={`text-xs px-2 py-1 rounded-full ${
                        hasAccess ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {role}: {hasAccess ? 'Access' : 'No Access'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.stateData.NextState && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Next State:</span>
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    {data.stateData.NextState}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Handle schema data - Enhanced to show all properties with detailed information
    if (data.type === 'object' && data.properties) {
      return (
        <div className="space-y-6">
          {/* Schema Properties */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="document" size="sm" />
              Properties ({Object.keys(data.properties).length})
            </h3>
            <div className="space-y-4">
              {Object.entries(data.properties).map(([propName, propData]: [string, any]) => {
                const isRequired = data.required && data.required.includes(propName);
                return (
                  <div key={propName} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                          {propName}
                          {isRequired && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              Required
                            </span>
                          )}
                        </h4>
                        {propData.description && (
                          <p className="text-gray-600 text-sm mt-1">{propData.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          propData.type === 'array' ? 'bg-purple-100 text-purple-800' :
                          propData.type === 'object' ? 'bg-blue-100 text-blue-800' :
                          propData.type === 'string' ? 'bg-green-100 text-green-800' :
                          propData.type === 'number' ? 'bg-yellow-100 text-yellow-800' :
                          propData.type === 'boolean' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {propData.type}
                        </span>
                        {propData.format && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {propData.format}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Property Details */}
                    <div className="space-y-3">
                      {/* Enum values */}
                      {propData.enum && propData.enum.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Allowed values:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {propData.enum.map((value: string) => (
                              <span key={value} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pattern */}
                      {propData.pattern && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Pattern:</span>
                          <code className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-mono">
                            {propData.pattern}
                          </code>
                        </div>
                      )}

                      {/* Min/Max values */}
                      {(propData.minimum !== undefined || propData.maximum !== undefined) && (
                        <div className="flex gap-4">
                          {propData.minimum !== undefined && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Min:</span>
                              <span className="ml-2 text-sm text-gray-900">{propData.minimum}</span>
                            </div>
                          )}
                          {propData.maximum !== undefined && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Max:</span>
                              <span className="ml-2 text-sm text-gray-900">{propData.maximum}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Min/Max length */}
                      {(propData.minLength !== undefined || propData.maxLength !== undefined) && (
                        <div className="flex gap-4">
                          {propData.minLength !== undefined && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Min Length:</span>
                              <span className="ml-2 text-sm text-gray-900">{propData.minLength}</span>
                            </div>
                          )}
                          {propData.maxLength !== undefined && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Max Length:</span>
                              <span className="ml-2 text-sm text-gray-900">{propData.maxLength}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Default value */}
                      {propData.default !== undefined && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Default:</span>
                          <span className="ml-2 text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {String(propData.default)}
                          </span>
                        </div>
                      )}

                      {/* Nested object properties */}
                      {propData.type === 'object' && propData.properties && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Nested Properties:</span>
                          <div className="mt-2 pl-4 border-l-2 border-gray-200">
                            {Object.entries(propData.properties).map(([nestedProp, nestedData]: [string, any]) => (
                              <div key={nestedProp} className="mb-2 p-2 bg-gray-50 rounded">
                                <span className="text-sm font-medium text-gray-800">{nestedProp}</span>
                                <span className="ml-2 text-xs text-gray-600">({nestedData.type})</span>
                                {nestedData.description && (
                                  <p className="text-xs text-gray-600 mt-1">{nestedData.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Array items */}
                      {propData.type === 'array' && propData.items && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Array Items:</span>
                          <div className="mt-2 pl-4 border-l-2 border-gray-200">
                            <div className="p-2 bg-gray-50 rounded">
                              <span className="text-sm font-medium text-gray-800">Type:</span>
                              <span className="ml-2 text-xs text-gray-600">{propData.items.type}</span>
                              {propData.items.description && (
                                <p className="text-xs text-gray-600 mt-1">{propData.items.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Handle project data (root node)
    if (data.projectData || data.schemas) {
      return (
        <div className="space-y-6">
          {data.projectData && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="package" size="sm" />
                Workflows ({Object.keys(data.projectData).length})
              </h3>
              <div className="grid gap-3">
                {Object.entries(data.projectData).map(([workflowName, workflowData]: [string, any]) => (
                  <div key={workflowName} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{workflowName}</h4>
                        {workflowData.Desc && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{workflowData.Desc}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded text-xs flex-shrink-0">
                        {workflowData.AppType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.schemas && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="document" size="sm" />
                Schemas ({Object.keys(data.schemas).length})
              </h3>
              <div className="grid gap-3">
                {Object.entries(data.schemas).map(([schemaName, schemaData]: [string, any]) => (
                  <div key={schemaName} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{schemaName}</h4>
                        {schemaData.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{schemaData.description}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded text-xs flex-shrink-0">
                        {schemaData.type || 'object'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Fallback for other data types
    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <div className="text-gray-700">
              {typeof value === 'object' ? renderRichUIPreview(value) : String(value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      {/* Simple header */}
      {stateName && <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${styling.color} rounded-lg flex items-center justify-center`}>
              <Icon name={styling.icon} size="sm" className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {stateName === "project-plan-node" ? "Project" : stateName?.replace("-node", "").replace("-", " ")}
              </h3>
              <p className="text-sm text-gray-600">{styling.label}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            iconLeft={<Icon name="x" size="sm" />}
            className="text-gray-600 border-gray-600"
          >
            Close
          </Button>
        </div>
      </div>}

      {/* View mode toggle and content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-700">{contentTitle}</h4>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    viewMode === 'preview' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setViewMode('ui')}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    viewMode === 'ui' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  UI
                </button>
                <button
                  onClick={() => setViewMode('json')}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    viewMode === 'json' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  JSON
                </button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(content)}
              iconLeft={<Icon name={copySuccess ? "check" : "copy"} size="sm" />}
              className={copySuccess ? "text-green-600 border-green-600" : ""}
            >
              {copySuccess ? "Copied!" : ""}
            </Button>
          </div>
          
          {/* Content based on view mode */}
          {viewMode === 'preview' ? (
            <div className="flex-1 overflow-auto rounded-lg min-h-0">
              <div className="space-y-4">
                {renderRichUIPreview(content)}
              </div>
            </div>
          ) : viewMode === 'ui' ? (
            <div className="flex-1 overflow-auto bg-gray-50 rounded-lg p-4 min-h-0">
              <div className="space-y-4">
                {renderJsonAsUI(content)}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-4 flex-1 overflow-auto min-h-0">
              <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono h-full">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonPreview; 