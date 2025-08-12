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

      {/* JSON content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex items-center justify-between flex-shrink-0">
            <h4 className="text-sm font-medium text-gray-700">{contentTitle}</h4>
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
          
          <div className="bg-gray-900 rounded-lg p-4 flex-1 overflow-auto min-h-0">
            <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono h-full">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonPreview; 