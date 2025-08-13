import React, { useState } from 'react';
import { Button, Icon } from '../components';

interface JsonPreviewProps {
  schema?: any;
  stateName: string;
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
  const [viewMode, setViewMode] = useState<'json' | 'ui'>('ui');

  // Simple node type detection
  const getNodeType = () => {
    if (stateName === "project-plan-node") return "root";
    if (stateName.endsWith("-node")) return "workflow";
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      {/* Simple header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${styling.color} rounded-lg flex items-center justify-center`}>
              <Icon name={styling.icon} size="sm" className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {stateName === "project-plan-node" ? "Project" : stateName.replace("-node", "").replace("-", " ")}
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
      </div>

      {/* View mode toggle and content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-700">{contentTitle}</h4>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('ui')}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    viewMode === 'ui' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  UI Preview
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
          {viewMode === 'ui' ? (
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