import React, { useState } from "react";
import { Button, Icon } from "../components";
import aiConfigData from "./sample_data/ai_configurations.json";
import { useParams } from "react-router-dom";
import MasterSchemaConfig from "./MasterSchemaConfig";

interface AIConfiguration {
  id: string;
  title: string;
  icon: string;
  description: string;
  exampleQuery?: {
    label: string;
    text: string;
  };
  exampleAlert?: {
    label: string;
    text: string;
  };
  exampleForecast?: {
    label: string;
    text: string;
  };
  features: string[];
  enabled: boolean;
}

interface AIConfigurationProps {
  getWorkflowSchemaCsv?: (schemaWorkflow: any) => any;
  getBrdContent?: () => any;
  getCurrentStateMachines?: () => any;
  schemaWorkflow?: any;
  mindsConfig?: any;
}

interface AIConfigData {
  title: string;
  subtitle: string;
  configurations: AIConfiguration[];
}

const AIConfiguration: React.FC<AIConfigurationProps> = ({
  getWorkflowSchemaCsv = () => {},
  getBrdContent = () => {},
  getCurrentStateMachines = () => {},
  schemaWorkflow,
  mindsConfig = {},
}) => {
  const [configs, setConfigs] = useState<AIConfiguration[]>(
    (aiConfigData as AIConfigData).configurations
  );
  
  // Modal state for MasterSchemaConfig
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const { projectId, projectName } = useParams<{
    projectId: string;
    projectName: string;
  }>();

  // Modal control functions
  const handlePreviewClick = () => {
    setIsPreviewModalOpen(true);
  };

  const handleAddToAppClick = () => {
    setIsConfigModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const closeConfigModal = () => {
    setIsConfigModalOpen(false);
  };


  return (
    <div className="bg-gray-50 p-6 h-[100%]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {(aiConfigData as AIConfigData).title}
          </h1>
          <p className="text-gray-600 text-lg">
            {(aiConfigData as AIConfigData).subtitle}
          </p>
        </div>

        {/* AI Configuration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {configs.map((config) => {
            // Get example content based on config type
            let exampleContent = null;
            if (config.exampleQuery) {
              exampleContent = config.exampleQuery;
            } else if (config.exampleAlert) {
              exampleContent = config.exampleAlert;
            } else if (config.exampleForecast) {
              exampleContent = config.exampleForecast;
            }

            return (
              <div
                key={config.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Header with Icon and Title */}
                <div className="p-6 pb-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-2xl">{config.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {config.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {config.description}
                      </p>
                    </div>
                  </div>

                  {/* Example Content */}
                  {exampleContent && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        {exampleContent.label}
                      </p>
                      <div className="bg-gray-50 rounded-md p-3">
                        <p className="text-sm text-gray-700 italic">
                          {exampleContent.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider line */}
                <div className="border-t border-gray-200 mx-6"></div>

                {/* Action Buttons */}
                <div className="p-4 flex gap-3">
                  <button
                    className="flex-1 text-blue-600 hover:text-blue-700 font-medium text-sm text-left py-2 px-4 transition-colors focus:outline-none"
                    onClick={handlePreviewClick}
                  >
                    Preview
                  </button>
                  <button
                    className={`flex-1 font-medium text-sm text-right py-2 px-4 transition-colors focus:outline-none ${
                      config.enabled
                        ? "text-green-600 hover:text-green-700"
                        : "text-blue-600 hover:text-blue-700"
                    }`}
                    onClick={handleAddToAppClick}
                  >
                    {config.enabled ? "Added" : "Add to app"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Master Schema Component */}
        <MasterSchemaConfig
          getWorkflowSchemaCsv={getWorkflowSchemaCsv}
          getBrdContent={getBrdContent}
          getCurrentStateMachines={getCurrentStateMachines}
          schemaWorkflow={schemaWorkflow}
          mindsConfig={mindsConfig}
          projectId={projectId || ""}
          isPreviewModalOpen={isPreviewModalOpen}
          isConfigModalOpen={isConfigModalOpen}
          onPreviewModalClose={closePreviewModal}
          onConfigModalClose={closeConfigModal}
        />
      </div>
    </div>
  );
};

export default AIConfiguration;
