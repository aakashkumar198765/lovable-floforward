import React, { useState, useRef, useEffect } from "react";
import { Button, Icon, Modal, Textarea } from "../components";
import {
  executeMind,
  getSession,
  streamSSE,
} from "../services/paramai_browsersdk";
import masterSchemas from "./sample_data/master_schemas.json";
import masterData from "./sample_data/sample_master_data.json";
import JsonPreview from "./JsonPreview";
import MasterDataPreview from './MasterDataPreview';
import { Tab } from "../components/atoms/navigation";
import Logs from "../components/logs/Logs";

interface MasterSchemaConfigProps {
  getWorkflowSchemaCsv?: () => any;
  getBrdContent?: () => any;
  getCurrentStateMachines?: () => any;
  mindsConfig?: any;
  projectId: string;
  // Modal control props
  isPreviewModalOpen?: boolean;
  isConfigModalOpen?: boolean;
  onPreviewModalClose?: () => void;
  onConfigModalClose?: () => void;
}

const MasterSchemaConfig: React.FC<MasterSchemaConfigProps> = ({
  getWorkflowSchemaCsv = () => {},
  getBrdContent = () => {},
  getCurrentStateMachines = () => {},
  mindsConfig = {},
  projectId,
  // Modal control props
  isPreviewModalOpen = false,
  isConfigModalOpen = false,
  onPreviewModalClose = () => {},
  onConfigModalClose = () => {},
}) => {
  const [masterDataPrompt, setMasterDataPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSchemaPanel, setShowSchemaPanel] = useState(true);
  const [schemaForPreview, setSchemaForPreview] = useState<any | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState("workflow");
  const [showGenerateBtn, setShowGenerateBtn] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<string | null>(null);
  const [activePreviewSchemaTab, setActivePreviewSchemaTab] = useState<string | null>(null);
  const [showRegenerationOptionsModal, setShowRegenerationOptionsModal] = useState(false);
  const [masterSchemaRegenerationType, setMasterSchemaRegenerationType] = useState<"same" | "edit" | null>(null);

  // New state for master schema session management
  const [masterSchemaSession, setMasterSchemaSession] = useState<any>(null);
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [streamedLogs, setStreamedLogs] = useState<any[]>([]);
  const [isStreamingLogs, setIsStreamingLogs] = useState(false);
  const streamAbortController = useRef<AbortController | null>(null);

  // Ref for the prompt textarea
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to scroll to prompt textarea
  const scrollToPromptTextarea = () => {
    if (promptTextareaRef.current) {
      promptTextareaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      promptTextareaRef.current.focus();
    }
  };

  // useEffect for scrolling and highlighting
  useEffect(() => {
    if (masterSchemaRegenerationType === "edit") {
      setTimeout(() => {
        scrollToPromptTextarea();
      }, 150);
    }
  }, [masterSchemaRegenerationType]);

  // Debug useEffect to check props
  useEffect(() => {
    console.log('MasterSchemaConfig props:', {
      getWorkflowSchemaCsv: typeof getWorkflowSchemaCsv,
      getBrdContent: typeof getBrdContent,
      getCurrentStateMachines: typeof getCurrentStateMachines,
      mindsConfig,
      projectId
    });
    
    // Test the functions
    console.log('getWorkflowSchemaCsv result:', getWorkflowSchemaCsv());
  }, [getWorkflowSchemaCsv, getBrdContent, getCurrentStateMachines, mindsConfig, projectId]);

  // Check for existing master schema session
  const checkMasterSchemaSession = async () => {
    if (!projectId || !mindsConfig?.masterSchemaMindId) {
      setIsCheckingSession(false);
      return;
    }

    try {
      setIsCheckingSession(true);
      // Get all sessions for master schema mind
      const masterSchemaSessions = await getSession(mindsConfig.masterSchemaMindId);
      const session = masterSchemaSessions?.response?.find(
        (el: any) => el?.name === projectId
      );
      
      if (session) {
        // Fetch the specific session content
        const sessionDetails = await getSession(
          mindsConfig.masterSchemaMindId,
          "",
          session._id
        );
        setMasterSchemaSession(sessionDetails?.response || {});
        setHasExistingSession(true);
        
        // Set schema for preview if content exists
        if (sessionDetails?.response?.output?.content) {
          setSchemaForPreview(sessionDetails.response.output.content);
          setShowSchemaPanel(true);
        }
      } else {
        setHasExistingSession(false);
        setMasterSchemaSession(null);
      }
    } catch (error) {
      console.error("Error checking master schema session:", error);
      setHasExistingSession(false);
      setMasterSchemaSession(null);
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Refresh master schema data
  const refreshMasterSchemaData = async () => {
    await checkMasterSchemaSession();
  };

  // Check session on component mount
  useEffect(() => {
    checkMasterSchemaSession();
  }, [projectId, mindsConfig?.masterSchemaMindId]);

  // Helper function to handle streamed events and update logs
  const handleStreamEvent = (data: any) => {
    let logMessage = '';
    if (typeof data === 'object' && data !== null && data.message) {
      logMessage = data.message;
    } else if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        if (parsed && parsed.message) {
          logMessage = parsed.message;
        } else {
          logMessage = data;
        }
      } catch(e) {
        logMessage = data;
      }
    } else {
      logMessage = String(data);
    }
    setStreamedLogs((prev) => [...prev, { message: logMessage, status: "info", format: "text" }]);
  };

  const handlePreview = () => {
    // Initialize activePreviewSchemaTab when masterSchemas is set
    if (masterSchemas && Object.keys(masterSchemas).length > 0) {
      setActivePreviewSchemaTab(Object.keys(masterSchemas)[0]);
    }
  };

  const closePreview = () => {
    onPreviewModalClose();
  };

  const closePromptModalOpen = () => {
    onConfigModalClose();
    setShowSchemaPanel(false);
    setActiveSchemaTab(null);
  };

  const handleAddToApp = () => {
    setSchemaForPreview(masterSchemas);
    // Set the first tab as active by default
    if (masterSchemas && Object.keys(masterSchemas).length > 0) {
      setActiveSchemaTab(Object.keys(masterSchemas)[0]);
    }
  };

  // Core generation logic
  const generateMasterSchema = async () => {
    try {
      setLoading(true);
      setStreamedLogs([]);

      const args = {
          prompts: masterDataPrompt,
          schema: getWorkflowSchemaCsv(),
          state_machine: getCurrentStateMachines(),
          brd: getBrdContent(),
          n_instances: 1,
        },
        mindId = mindsConfig?.masterSchemaMindId;
      
      const responseStructure = {
        api: {},
        ui: {
          type: "tabs",
          tabs: [],
          content: {},
        },
      };

      // Execute the mind
      const execution = await executeMind(
        projectId,
        args,
        responseStructure,
        mindId
      );

      const { job_id, session_id } = execution;

      // Stream the execution logs
      streamAbortController.current = new AbortController();
      setLoading(false);
      setIsStreamingLogs(true);
      setStreamedLogs([]);
      
      await streamSSE(job_id, {
        onEvent: handleStreamEvent,
        onComplete: () => setIsStreamingLogs(false),
        onError: (err: any) => {
          if (err.name !== 'AbortError') {
            console.error("SSE error during master schema generation:", err);
          }
          setIsStreamingLogs(false);
        },
        signal: streamAbortController.current.signal,
      });

      // Get the updated session after execution
      const response = await getSession(mindId, "", session_id);
      if (response?.response) {
        setMasterSchemaSession(response.response);
        setHasExistingSession(true);
        
        // Update schema for preview if content exists
        if (response.response.output?.content) {
          setSchemaForPreview(response.response.output.content);
          setShowSchemaPanel(true);
          if (Object.keys(response.response.output.content).length > 0) {
            setActiveSchemaTab(Object.keys(response.response.output.content)[0]);
          }
        }
        
        setShowGenerateBtn(false);
      }
    } catch (e) {
      console.error("Error generating master schema:", e);
      setLoading(false);
      setShowSchemaPanel(false);
      setShowGenerateBtn(false);
    } finally {
      setMasterSchemaRegenerationType(null);
      setIsStreamingLogs(false);
    }
  };

  // Handle submit to app
  const handleSubmitToApp = async (regenerate: boolean) => {
    if (regenerate && hasExistingSession) {
      // Show regeneration options for existing session
      onConfigModalClose();
      setShowRegenerationOptionsModal(true);
      setShowGenerateBtn(true);
      setSchemaForPreview(masterSchemas);
      if (masterSchemas && Object.keys(masterSchemas).length > 0) {
        setActiveSchemaTab(Object.keys(masterSchemas)[0]);
      }
      setShowSchemaPanel(true);
      onPreviewModalClose();
    } else {
      // Generate new master schema
      await generateMasterSchema();
    }
  };

  const handleRegenerationOption = async (type: "same" | "edit") => {
    setShowRegenerationOptionsModal(false);
    setMasterSchemaRegenerationType(type);
    
    if (type === "same") {
      // Regenerate with same prompt
      await generateMasterSchema();
    } else {
      // Edit prompt - reopen the config modal
      onConfigModalClose();
      // The modal will reopen with the prompt input
    }
  };

  return (
    <>
      {/* Show loading state while checking session */}
      {isCheckingSession && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing master schema configuration...</p>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={closePreview}
        title={"Preview"}
        size="lg"
        variant="slider"
        footer={
          <div className="flex items-center justify-end space-x-4">
            {hasExistingSession && (
              <Button
                variant="outline"
                onClick={refreshMasterSchemaData}
                disabled={isCheckingSession}
              >
                Refresh
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => handleSubmitToApp(true)}
              loading={loading}
            >
              {hasExistingSession ? "Re-Generate Master Schema" : "Generate Master Schema"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 p-2">
          {/* Content based on activePreviewTab */}
          <>
            {activePreviewTab === 'workflow' && (
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
                        {hasExistingSession 
                          ? "No master schema content found. Try refreshing or regenerating."
                          : "Generate a master schema first to preview the content."
                        }
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
            {activePreviewTab === 'master-data' && (
              <div className="border-l border-gray-300 bg-gray-50 flex flex-col shadow-lg">
                <div className="flex-1 overflow-y-auto">
                  <MasterDataPreview data={masterData} />
                </div>
              </div>
            )}
          </>
        </div>
      </Modal>

      {/* Add to App Modal */}
      <Modal
        isOpen={isConfigModalOpen}
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
              onClick={() => handleSubmitToApp(!hasExistingSession)}
              loading={loading}
            >
              {loading
                ? "Generating Master Schema"
                : hasExistingSession
                ? "Re-Generate Master Schema"
                : "Generate Master Schema"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 p-2">
          {isCheckingSession ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Checking for existing master schema...</p>
              </div>
            </div>
          ) : isStreamingLogs ? (
            <Logs
              logs={streamedLogs}
              onBackToPrompt={() => {
                setIsStreamingLogs(false);
                setStreamedLogs([]);
              }}
              onViewOutput={() => setStreamedLogs([])}
              streamCompleted={!isStreamingLogs && streamedLogs.length > 0}
              title="Master Schema Generation Logs"
              backButtonText="Back to Prompt"
              viewOutputButtonText="View Output"
              bgStyling={false}
            />
          ) : (
            <>
              <div>
                <h3 className="text-base font-semibold text-gray-700">
                  The following items have been processed:
                </h3>
              </div>

              <ul>
                <li className="flex items-center gap-3 rounded-lg p-3">
                  {(() => {
                    const brdResult = getBrdContent();
                    console.log('BRD check:', { brdResult });
                    // Check if the function actually returns meaningful data
                    const hasBrd = brdResult && 
                      (typeof brdResult === 'string' ? brdResult.trim().length > 0 : 
                       Array.isArray(brdResult) ? brdResult.length > 0 : 
                       Object.keys(brdResult || {}).length > 0);
                    return hasBrd ? <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                      <Icon name="check" size="sm" className="text-green-600" />
                    </div> : <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                      <Icon name="error" size="sm" className="text-red-600" />
                    </div>;
                  })()}
                  <span className="font-medium text-gray-800">BRD</span>
                </li>
                <li className="flex items-center gap-3 rounded-lg p-3">
                  {(() => {
                    const stateMachineResult = getCurrentStateMachines();
                    console.log('State Machine check:', { stateMachineResult });
                    // Check if the function actually returns meaningful data
                    const hasStateMachine = stateMachineResult && 
                      (typeof stateMachineResult === 'string' ? stateMachineResult.trim().length > 0 : 
                       Array.isArray(stateMachineResult) ? stateMachineResult.length > 0 : 
                       Object.keys(stateMachineResult || {}).length > 0);
                    return hasStateMachine ? <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                      <Icon name="check" size="sm" className="text-green-600" />
                    </div> : <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                      <Icon name="error" size="sm" className="text-red-600" />
                    </div>;
                  })()}
                  <span className="font-medium text-gray-800">State Machine</span>
                </li>
                <li className="flex items-center gap-3 rounded-lg p-3">
                  {(() => {
                    const schemaResult = getWorkflowSchemaCsv();
                    console.log('Schema check:', { schemaResult });
                    // Check if the function actually returns meaningful data
                    const hasSchema = schemaResult && 
                      (typeof schemaResult === 'string' ? schemaResult.trim().length > 0 : 
                       Array.isArray(schemaResult) ? schemaResult.length > 0 : 
                       Object.keys(schemaResult || {}).length > 0);
                    return hasSchema ? <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                      <Icon name="check" size="sm" className="text-green-600" />
                    </div> : <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                      <Icon name="error" size="sm" className="text-red-600" />
                    </div>;
                  })()}
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
                ref={promptTextareaRef}
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
                            activeTab={activeSchemaTab as string}
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
                              setActiveSchemaTab(null);
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
              )}
            </>
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
    </>
  );
};

export default MasterSchemaConfig; 