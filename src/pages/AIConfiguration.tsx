import React, { useState, useRef, useEffect } from "react";
import { Button, Icon, Modal, Textarea } from "../components";
import aiConfigData from "./sample_data/ai_configurations.json";
import {
  executeMind,
  getSession,
  streamSSE,
} from "../services/paramai_browsersdk";
import { useParams } from "react-router-dom";
import masterSchemas from "./sample_data/master_schemas.json";
import JsonPreview from "./JsonPreview";
import { Tab } from "../components/atoms/navigation";

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
  const [previewConfig, setPreviewConfig] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [masterDataPrompt, setMasterDataPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSchemaPanel, setShowSchemaPanel] = useState(true);
  const [schemaForPreview, setSchemaForPreview] = useState<any | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState("workflow");
  const [showGenerateBtn, setShowGenerateBtn] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<string | null>(null);
  const [activePreviewSchemaTab, setActivePreviewSchemaTab] = useState<string | null>(null);
  const [showRegenerationOptionsModal, setShowRegenerationOptionsModal] = useState(false); // New state
  const [masterSchemaRegenerationType, setMasterSchemaRegenerationType] = useState<"same" | "edit" | null>(null); // New state

  // Ref for the prompt textarea
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null); // New ref

  // Function to scroll to prompt textarea
  const scrollToPromptTextarea = () => {
    if (promptTextareaRef.current) {
      promptTextareaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center' // 'start' might hide it behind header
      });
      promptTextareaRef.current.focus();
    }
  };

  // useEffect for scrolling and highlighting
  useEffect(() => {
    if (masterSchemaRegenerationType === "edit") {
      setTimeout(() => {
        scrollToPromptTextarea();
      }, 150); // Small delay to ensure modal closes
    }
  }, [masterSchemaRegenerationType]);

  const { projectId, projectName } = useParams<{
    projectId: string;
    projectName: string;
  }>();

  const handlePreview = () => {
    setIsPreviewOpen(true);
    setSchemaForPreview(masterSchemas);
    // Initialize activePreviewSchemaTab when masterSchemas is set
    if (masterSchemas && Object.keys(masterSchemas).length > 0) {
      setActivePreviewSchemaTab(Object.keys(masterSchemas)[0]);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewConfig(false);
  };

  const closePromptModalOpen = () => {
    setIsPromptModalOpen(false);
    setShowSchemaPanel(false);
    setActiveSchemaTab(null); // Reset active tab
  };

  const handleAddToApp = () => {
    setIsPromptModalOpen(true);
    setSchemaForPreview(masterSchemas);
    // setShowSchemaPanel(true);
    // Set the first tab as active by default
    if (masterSchemas && Object.keys(masterSchemas).length > 0) {
      setActiveSchemaTab(Object.keys(masterSchemas)[0]);
    }
  };

  // New function for core generation logic
  const generateMasterSchema = async () => {
    try {
      setLoading(true);

      const args = {
          prompts: masterDataPrompt,
          schema: getWorkflowSchemaCsv(schemaWorkflow),
          state_machine: getCurrentStateMachines(),
          brd: getBrdContent(),
          n_instances: 1,
        },
        mindId = mindsConfig?.syntheticData;
      const responseStructure = {
        api: {},
        ui: {
          type: "tabs",
          tabs: [],
          content: {},
        },
      };
      const execution = await executeMind(
        projectId,
        args,
        responseStructure,
        mindId
      );

      const { job_id, session_id } = execution;
      await streamSSE(job_id);
      const response = await getSession(mindId, "", session_id);
      if (response?.response) {
        setLoading(false);
        setSchemaForPreview(masterSchemas);
        setShowSchemaPanel(true);
        if (masterSchemas && Object.keys(masterSchemas).length > 0) {
          setActiveSchemaTab(Object.keys(masterSchemas)[0]);
        }
        setShowGenerateBtn(false);
      }
    } catch (e) {
      setLoading(false);
      setShowSchemaPanel(false);
      setShowGenerateBtn(false);
    } finally {
      setMasterSchemaRegenerationType(null); // Reset regeneration type
    }
  };

  // Modified handleSubmitToApp
  const handleSubmitToApp = async (regenerate: boolean) => {
    if (regenerate) {
      setIsPromptModalOpen(false);
      setShowRegenerationOptionsModal(true);
      setShowGenerateBtn(true);
      setSchemaForPreview(masterSchemas);
      if (masterSchemas && Object.keys(masterSchemas).length > 0) {
        setActiveSchemaTab(Object.keys(masterSchemas)[0]);
      }
      setShowSchemaPanel(true);
      setIsPreviewOpen(false);
    } else {
      await generateMasterSchema();
    }
  };

  const handleRegenerationOption = async (type: "same" | "edit") => {
    setShowRegenerationOptionsModal(false);
    setMasterSchemaRegenerationType(type);
    setIsPromptModalOpen(true);

    if (type === "same") {
      await generateMasterSchema();
    }
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
                    onClick={() => handlePreview()}
                  >
                    Preview
                  </button>
                  <button
                    className={`flex-1 font-medium text-sm text-right py-2 px-4 transition-colors focus:outline-none ${
                      config.enabled
                        ? "text-green-600 hover:text-green-700"
                        : "text-blue-600 hover:text-blue-700"
                    }`}
                    onClick={() => handleAddToApp()}
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
          title={"Preview"}
          size="lg"
          variant="slider"
          footer={
            <div className="flex items-center justify-end space-x-4">
              <Button
                variant="primary"
                onClick={() => handleSubmitToApp(true)}
                loading={loading}
              >
                Re-Generate Master Schema
              </Button>
            </div>
          }
        >
          <div className="space-y-4 p-2">
            {/* Content based on activePreviewTab */}
            <>
                <div className="border-l border-gray-300 bg-gray-50 flex flex-col shadow-lg">
                  {/* Add tabs here */}
                  {schemaForPreview && Object.keys(schemaForPreview).length > 0 && (
                    <div className="bg-white border-b border-gray-200 px-6 py-4">
                      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="min-w-max">
                          <Tab
                            items={Object.keys(schemaForPreview).map(key => ({ id: key, label: key }))}
                            activeTab={activePreviewSchemaTab as string}
                            onChange={(tabId) => setActivePreviewSchemaTab(tabId as string)}
                            variant="pills"
                            size="sm"
                            className="whitespace-nowrap"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Panel Content - Direct rendering without wrapper */}
                  <div className="flex-1 overflow-y-auto">
                    {(() => {
                      if (schemaForPreview && activePreviewSchemaTab) {
                        const currentSchema = schemaForPreview[activePreviewSchemaTab];
                        return (
                          <JsonPreview
                            schema={currentSchema}
                            title={`${activePreviewSchemaTab} Schema Details`}
                            onClose={() => {
                              // This onClose is for JsonPreview, not the modal.
                              // The modal's onClose is handled by closePreview.
                            }}
                          />
                        );
                      }
                      return (
                        <div className="p-4">
                          Could not determine schema for the generated data.
                        </div>
                      );
                    })()}
                  </div>
                </div>
            </>
          </div>
        </Modal>

        {/* Add to App Modal */}
        <Modal
          isOpen={isPromptModalOpen}
          onClose={closePromptModalOpen}
          title="Configure Master Schema"
          size="lg"
          variant="slider"
          footer={
            <div className="flex items-center justify-end space-x-4">
              <Button variant="outline" onClick={closePromptModalOpen}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSubmitToApp(!showGenerateBtn && showSchemaPanel ? true : false)}
                loading={loading}
              >
                {loading
                  ? "Generating Master Schema"
                  : !showGenerateBtn && showSchemaPanel
                  ? "Re-Generate Master Schema"
                  : "Generate Master Schema"}
              </Button>
            </div>
          }
        >
          <div className="space-y-4 p-2">
            <div>
              <h3 className="text-base font-semibold text-gray-700">
                The following items have been processed:
              </h3>
            </div>

            <ul>
              <li className="flex items-center gap-3 rounded-lg p-3">
                {getBrdContent() ? <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <Icon name="check" size="sm" className="text-green-600" />
                </div> : <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                  <Icon name="error" size="sm" className="text-red-600" />
                </div>}
                <span className="font-medium text-gray-800">BRD</span>
              </li>
              <li className="flex items-center gap-3 rounded-lg p-3">
                {getCurrentStateMachines() ? <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <Icon name="check" size="sm" className="text-green-600" />
                </div> : <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                  <Icon name="error" size="sm" className="text-red-600" />
                </div>}
                <span className="font-medium text-gray-800">State Machine</span>
              </li>
              <li className="flex items-center gap-3 rounded-lg p-3">
                {getWorkflowSchemaCsv(schemaWorkflow) ? <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <Icon name="check" size="sm" className="text-green-600" />
                </div> : <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                  <Icon name="error" size="sm" className="text-red-600" />
                </div>}
                <span className="font-medium text-gray-800">Schema</span>
              </li>
            </ul>

            <Textarea
              id="resize-vertical"
              label="Prompt for generating master schema"
              placeholder="Enter prompt"
              resize="vertical"
              rows={4}
              onChange={(e) => setMasterDataPrompt(e.target.value)}
              ref={promptTextareaRef} // Added ref
            />
            {showSchemaPanel && (
              <div className="border-l border-gray-300 bg-gray-50 flex flex-col shadow-lg">
                {/* Add tabs here */}
                {schemaForPreview && Object.keys(schemaForPreview).length > 0 && (
                  <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <div className="min-w-max">
                        <Tab
                          items={Object.keys(schemaForPreview).map(key => ({ id: key, label: key }))}
                          activeTab={activeSchemaTab as string} // Cast here
                          onChange={(tabId) => setActiveSchemaTab(tabId as string)}
                          variant="pills"
                          size="sm"
                          className="whitespace-nowrap"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Panel Content - Direct rendering without wrapper */}
                <div className="flex-1 overflow-y-auto">
                  {(() => {
                    if (schemaForPreview && activeSchemaTab) {
                      const currentSchema = schemaForPreview[activeSchemaTab];
                      return (
                        <JsonPreview
                          schema={currentSchema}
                          title={`${activeSchemaTab} Schema Details`}
                          onClose={() => {
                            setShowSchemaPanel(false);
                            setSchemaForPreview(null);
                            setActiveSchemaTab(null); // Reset active tab
                          }}
                        />
                      );
                    }
                    return (
                      <div className="p-4">
                        Could not determine schema for the generated data.
                      </div> // Corrected closing tag
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </Modal>

      {/* Regeneration Options Modal */}
      {showRegenerationOptionsModal && (
        <Modal
          isOpen={showRegenerationOptionsModal}
          onClose={() => setShowRegenerationOptionsModal(false)}
          title="Regenerate Master Schema"
          size="lg"
        >
          <div className="text-center p-4">
            <Icon
              name="refresh"
              size="lg"
              className="mx-auto mb-4 text-blue-500"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              How would you like to regenerate?
            </h3>
            <p className="text-gray-600 mb-6">
              Choose whether to regenerate with the same prompt or edit your requirements in the prompt input below.
            </p>
            <div className="flex flex-col space-y-3">
              <Button
                variant="primary"
                onClick={() => handleRegenerationOption("same")}
                className="px-8 py-3 rounded-lg font-semibold text-base"
                iconLeft={<Icon name="refresh" />}
              >
                Regenerate with Same Prompt
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleRegenerationOption("edit")}
                className="px-8 py-3 rounded-lg font-semibold text-base"
                iconLeft={<Icon name="edit" />}
              >
                Edit Prompt Input
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRegenerationOptionsModal(false)}
                className="px-8 py-3 rounded-lg font-semibold text-base"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
    </div>
  );
};

export default AIConfiguration;
