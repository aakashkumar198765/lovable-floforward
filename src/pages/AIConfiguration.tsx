import React, { useState } from 'react';
import { Button, Modal } from '../components';
import aiConfigData from './sample_data/ai_configurations.json';

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

interface AIConfigData {
  title: string;
  subtitle: string;
  configurations: AIConfiguration[];
}

const AIConfiguration: React.FC = () => {
  const [configs, setConfigs] = useState<AIConfiguration[]>(
    (aiConfigData as AIConfigData).configurations
  );
  const [previewConfig, setPreviewConfig] = useState<AIConfiguration | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (configId: string) => {
    const config = configs.find(c => c.id === configId);
    if (config) {
      setPreviewConfig(config);
      setIsPreviewOpen(true);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewConfig(null);
  };

  const handleAddToApp = (configId: string) => {
    setConfigs(prev => 
      prev.map(config => 
        config.id === configId 
          ? { ...config, enabled: !config.enabled }
          : config
      )
    );
  };

  const getExampleContent = (config: AIConfiguration) => {
    if (config.exampleQuery) {
      return config.exampleQuery;
    }
    if (config.exampleAlert) {
      return config.exampleAlert;
    }
    if (config.exampleForecast) {
      return config.exampleForecast;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            const exampleContent = getExampleContent(config);
            
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
                    onClick={() => handlePreview(config.id)}
                  >
                    Preview
                  </button>
                  <button
                    className={`flex-1 font-medium text-sm text-right py-2 px-4 transition-colors focus:outline-none ${
                      config.enabled
                        ? 'text-green-600 hover:text-green-700'
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                    onClick={() => handleAddToApp(config.id)}
                  >
                    {config.enabled ? "Added" : "Add to app"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preview Modal */}
        <Modal
          isOpen={isPreviewOpen}
          onClose={closePreview}
          title={previewConfig ? `${previewConfig.icon} ${previewConfig.title}` : ''}
          size="lg"
        >
          {previewConfig && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {previewConfig.description}
                </p>
              </div>

              {/* Example Content */}
              {getExampleContent(previewConfig) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Example</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      {getExampleContent(previewConfig)?.label}
                    </p>
                    <p className="text-gray-700 italic">
                      {getExampleContent(previewConfig)?.text}
                    </p>
                  </div>
                </div>
              )}

              {/* Key Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {previewConfig.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Configuration Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    previewConfig.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className="font-medium text-gray-900">
                    Status: {previewConfig.enabled ? 'Added to Application' : 'Not Added'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={closePreview}
                >
                  Close
                </Button>
                <Button
                  variant={previewConfig.enabled ? "success" : "primary"}
                  onClick={() => {
                    handleAddToApp(previewConfig.id);
                    // Update the preview config state to reflect the change
                    setPreviewConfig(prev => prev ? { ...prev, enabled: !prev.enabled } : null);
                  }}
                >
                  {previewConfig.enabled ? "Remove from App" : "Add to App"}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AIConfiguration; 