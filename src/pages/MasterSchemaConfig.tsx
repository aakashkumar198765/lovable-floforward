import React, { useState, useRef, useEffect } from "react";
import { Button, Icon, Modal, Textarea } from "../components";
import {
  executeMind,
  getSession,
  streamSSE,
} from "../services/paramai_browsersdk";
import JsonPreview from "./JsonPreview";
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
  onConfigModalOpen?: () => void;
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
  onConfigModalOpen = () => {},
}) => {
  const [masterDataPrompt, setMasterDataPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSchemaPanel, setShowSchemaPanel] = useState(true);
  const [schemaForPreview, setSchemaForPreview] = useState<any | null>(null);
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
  const [masterSchemaSessionId, setMasterSchemaSessionId] = useState<string>("");

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
      
      // Find sessions matching the project ID and sort by execution time (e_at) to get most recent
      const matchingSessions = masterSchemaSessions?.response?.filter(
        (el: any) => el?.name === projectId
      ) || [];
      
      if (matchingSessions.length > 0) {
        // Sort by e_at timestamp (most recent first) and take the first one
        const sortedSessions = matchingSessions.sort((a: any, b: any) => {
          const dateA = new Date(a.e_at || 0);
          const dateB = new Date(b.e_at || 0);
          return dateB.getTime() - dateA.getTime(); // Descending order (most recent first)
        });
        
        const mostRecentSession = sortedSessions[0];
        console.log('🔍 Found', matchingSessions.length, 'sessions for project', projectId);
        console.log('🔍 Most recent session:', mostRecentSession._id, 'executed at:', mostRecentSession.e_at);
        
        // Fetch the specific session content
        const sessionDetails = await getSession(
          mindsConfig.masterSchemaMindId,
          "",
          mostRecentSession._id
        );
        console.log('🔍 Full session details:', sessionDetails);
        console.log('🔍 Session response structure:', sessionDetails?.response);
        console.log('🔍 Session args:', sessionDetails?.response?.args);
        console.log('🔍 User query in args:', sessionDetails?.response?.args?.user_query);
        
        setMasterSchemaSession(sessionDetails?.response || {});
        setMasterSchemaSessionId(mostRecentSession._id); // Store session ID for regeneration
        setHasExistingSession(true);
        
        // Extract and set the user_query from the session args
        if (sessionDetails?.response?.args?.user_query) {
          console.log('📝 Setting user_query from session:', sessionDetails.response.args.user_query);
          setMasterDataPrompt(sessionDetails.response.args.user_query);
        } else {
          console.log('📝 No user_query found in session args:', sessionDetails?.response?.args);
          // Try alternative paths
          console.log('📝 Trying alternative paths...');
          console.log('📝 Direct response args:', sessionDetails?.response?.args);
          console.log('📝 Response keys:', Object.keys(sessionDetails?.response || {}));
        }
        
        // Parse the master schema CSV content and create individual schema tabs
        if (sessionDetails?.response?.output?.content) {
          const content = sessionDetails.response.output.content;
          // Find the first content item that contains CSV data
          const firstContentKey = Object.keys(content)[0];
          if (firstContentKey && content[firstContentKey] && content[firstContentKey][0]) {
            const csvContent = content[firstContentKey][0].content;
            if (csvContent) {
              console.log('📊 Master Schema CSV content (session check):', csvContent.substring(0, 200));
              const parsedSchemas = parseMasterSchemaCSV(csvContent);
              console.log('📊 Parsed master schemas (session check):', Object.keys(parsedSchemas));
              setSchemaForPreview(parsedSchemas);
              setShowSchemaPanel(true);
              // Set the first schema as active tab
              if (Object.keys(parsedSchemas).length > 0) {
                setActiveSchemaTab(Object.keys(parsedSchemas)[0]);
              }
            }
          }
        }
      } else {
        console.log('🔍 No sessions found for project:', projectId);
        setHasExistingSession(false);
        setMasterSchemaSession(null);
        setMasterSchemaSessionId(""); // Clear session ID when no session exists
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

  // Debug useEffect to monitor masterDataPrompt changes
  useEffect(() => {
    console.log('📝 masterDataPrompt state changed:', masterDataPrompt);
  }, [masterDataPrompt]);

  // Ensure schema panel is shown when modal reopens if schema data exists
  useEffect(() => {
    console.log('🔍 Modal reopen effect triggered:', {
      isConfigModalOpen,
      hasSchemaData: !!schemaForPreview,
      schemaKeys: schemaForPreview ? Object.keys(schemaForPreview) : [],
      showSchemaPanel,
      activeSchemaTab
    });
    
    if (isConfigModalOpen && schemaForPreview && Object.keys(schemaForPreview).length > 0) {
      console.log('🔍 Restoring schema panel display');
      setShowSchemaPanel(true);
      // Set active tab if none is selected
      if (!activeSchemaTab) {
        setActiveSchemaTab(Object.keys(schemaForPreview)[0]);
      }
    } else if (isConfigModalOpen && (!schemaForPreview || Object.keys(schemaForPreview).length === 0)) {
      console.log('🔍 No schema data available, checking session again');
      // If modal is open but no schema data, check session again
      checkMasterSchemaSession();
    }
  }, [isConfigModalOpen, schemaForPreview, activeSchemaTab]);

  // Ensure Preview modal loads schema data when it opens
  useEffect(() => {
    if (isPreviewModalOpen && (!schemaForPreview || Object.keys(schemaForPreview).length === 0)) {
      console.log('🔍 Preview modal opened but no schema data, attempting to load...');
      if (hasExistingSession && masterSchemaSession) {
        // Try to extract schema from existing session
        if (masterSchemaSession.output?.content) {
          const content = masterSchemaSession.output.content;
          const firstContentKey = Object.keys(content)[0];
          if (firstContentKey && content[firstContentKey] && content[firstContentKey][0]) {
            const csvContent = content[firstContentKey][0].content;
            if (csvContent) {
              console.log('🔍 Loading schema data for preview from existing session');
              const parsedSchemas = parseMasterSchemaCSV(csvContent);
              setSchemaForPreview(parsedSchemas);
              setActivePreviewSchemaTab(Object.keys(parsedSchemas)[0]);
            }
          }
        }
      } else {
        // No existing session, check if we need to create one
        console.log('🔍 No existing session, checking if we need to create one...');
        checkMasterSchemaSession();
      }
    } else if (isPreviewModalOpen && schemaForPreview && Object.keys(schemaForPreview).length > 0) {
      // Schema data exists but no tab is selected, select the first one
      if (!activePreviewSchemaTab) {
        console.log('🔍 Preview modal opened with schema data but no tab selected, selecting first tab');
        const firstTabKey = Object.keys(schemaForPreview)[0];
        setActivePreviewSchemaTab(firstTabKey);
      }
    }
  }, [isPreviewModalOpen, schemaForPreview, hasExistingSession, masterSchemaSession, activePreviewSchemaTab]);

  // Parse master schema CSV content into individual schemas
  const parseMasterSchemaCSV = (csvContent: string) => {
    if (!csvContent) return {};

    const lines = csvContent.split("\n").filter((line) => line.trim());
    if (lines.length === 0) return {};

    // Get headers
    const headers = lines[0].split(",").map((h) => h.trim());
    const schemaData: Record<string, any> = {};

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      try {
        // Better CSV parsing to handle commas within quoted fields
        const line = lines[i];
        const values: string[] = [];
        let currentValue = "";
        let inQuotes = false;
        let j = 0;

        while (j < line.length) {
          const char = line[j];

          if (char === '"') {
            if (inQuotes && line[j + 1] === '"') {
              // Escaped quote
              currentValue += '"';
              j += 2;
            } else {
              // Start or end of quoted field
              inQuotes = !inQuotes;
              j++;
            }
          } else if (char === "," && !inQuotes) {
            // Field separator
            values.push(currentValue.trim());
            currentValue = "";
            j++;
          } else {
            currentValue += char;
            j++;
          }
        }

        // Add the last value
        values.push(currentValue.trim());

        if (values.length < 3) continue; // Need at least 3 fields

        const schema = values[0];
        const subSchema = values[1];
        const subSchemaType = values[2];
        const keyProperty = values[3] || "";
        const propertyTitle = values[4] || "";
        const description = values[5] || "";
        const propertyType = values[6] || "";
        const format = values[7] || "";
        const required = values[8] === "true";
        const options = values[9] || "";

        // Create unique schema key
        const schemaKey = schema.toLowerCase().replace(/\s+/g, "");

        if (!schemaData[schemaKey]) {
          schemaData[schemaKey] = {
            _id: `master:${schema}`,
            title: schema,
            type: "object",
            properties: {},
            order: [],
            schema: schema,
          };
        }

        // Add subSchema to properties if not exists
        if (!schemaData[schemaKey].properties[subSchema]) {
          schemaData[schemaKey].properties[subSchema] = {
            type: subSchemaType,
            title: subSchema,
            properties: {},
            order: [],
          };
          schemaData[schemaKey].order.push(subSchema);
        }

        // Add property to subSchema if keyProperty exists
        if (keyProperty && propertyTitle) {
          // Generate a simple index based on position
          const currentIndex = Object.keys(
            schemaData[schemaKey].properties[subSchema].properties
          ).length;
          const index = currentIndex > 3 ? 100 + currentIndex : currentIndex;

          // Parse options safely
          let enumValues = undefined;
          if (options && options.length > 0) {
            try {
              if (options.startsWith("[") && options.endsWith("]")) {
                const cleanOptions = options.replace(/\"\"/g, '"');
                enumValues = JSON.parse(cleanOptions);
              }
            } catch (e) {
              console.warn("Failed to parse options for", keyProperty, ":", options, e);
              enumValues = undefined;
            }
          }

          schemaData[schemaKey].properties[subSchema].properties[keyProperty] = {
            type: propertyType,
            title: propertyTitle,
            description: description,
            format: format || undefined,
            required: required,
            index: index,
            enum: enumValues,
          };

          if (!schemaData[schemaKey].properties[subSchema].order.includes(keyProperty)) {
            schemaData[schemaKey].properties[subSchema].order.push(keyProperty);
          }
        }
      } catch (error) {
        console.warn("Error parsing CSV line", i, ":", lines[i], error);
        continue;
      }
    }

    return schemaData;
  };

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
    // Initialize activePreviewSchemaTab when schemas are available
    if (schemaForPreview && Object.keys(schemaForPreview).length > 0) {
      setActivePreviewSchemaTab(Object.keys(schemaForPreview)[0]);
    } else {
      // If no schema data available, try to load it from existing session
      console.log('🔍 Preview opened but no schema data, checking session...');
      if (hasExistingSession && masterSchemaSession) {
        // Try to extract schema from existing session
        if (masterSchemaSession.output?.content) {
          const content = masterSchemaSession.output.content;
          const firstContentKey = Object.keys(content)[0];
          if (firstContentKey && content[firstContentKey] && content[firstContentKey][0]) {
            const csvContent = content[firstContentKey][0].content;
            if (csvContent) {
              console.log('🔍 Loading schema data for preview from existing session');
              const parsedSchemas = parseMasterSchemaCSV(csvContent);
              setSchemaForPreview(parsedSchemas);
              setActivePreviewSchemaTab(Object.keys(parsedSchemas)[0]);
            }
          }
        }
      }
    }
  };

  const closePreview = () => {
    onPreviewModalClose();
  };

  const closePromptModalOpen = () => {
    onConfigModalClose();
    // Don't clear schema panel state - let it persist for when modal reopens
    // setShowSchemaPanel(false);
    // setActiveSchemaTab(null);
  };

  // Core generation logic
  const generateMasterSchema = async () => {
    try {
      setLoading(true);
      setStreamedLogs([]);

      const args = {
          user_query: masterDataPrompt,
          schema_csv: getWorkflowSchemaCsv(),
          brd: getBrdContent(),
        };
      const mindId = mindsConfig?.masterSchemaMindId;
      
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
        mindId,
        hasExistingSession ? masterSchemaSessionId : undefined // Pass session ID if regenerating
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
      console.log('🔍 New session response:', response);
      console.log('🔍 New session args:', response?.response?.args);
      console.log('🔍 New session user_query:', response?.response?.args?.user_query);
      
      if (response?.response) {
        setMasterSchemaSession(response.response);
        setMasterSchemaSessionId(session_id); // Update session ID with new one
        setHasExistingSession(true);
        
        // Extract and set the user_query from the new session args
        if (response.response.args?.user_query) {
          console.log('📝 Setting user_query from new session:', response.response.args.user_query);
          setMasterDataPrompt(response.response.args.user_query);
        } else {
          console.log('📝 No user_query found in new session args:', response.response?.args);
          // Try alternative paths
          console.log('📝 New session response keys:', Object.keys(response.response || {}));
        }
        
        // Parse the master schema CSV content and create individual schema tabs
        if (response.response.output?.content) {
          const content = response.response.output.content;
          // Find the first content item that contains CSV data
          const firstContentKey = Object.keys(content)[0];
          if (firstContentKey && content[firstContentKey] && content[firstContentKey][0]) {
            const csvContent = content[firstContentKey][0].content;
            if (csvContent) {
              console.log('📊 Master Schema CSV content:', csvContent.substring(0, 200));
              const parsedSchemas = parseMasterSchemaCSV(csvContent);
              console.log('📊 Parsed master schemas:', Object.keys(parsedSchemas));
              setSchemaForPreview(parsedSchemas);
              setShowSchemaPanel(true);
              // Set the first schema as active tab
              if (Object.keys(parsedSchemas).length > 0) {
                setActiveSchemaTab(Object.keys(parsedSchemas)[0]);
              }
            }
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
      setShowRegenerationOptionsModal(true);
      setShowGenerateBtn(true);
      // Use existing parsed schemas instead of static masterSchemas
      if (schemaForPreview && Object.keys(schemaForPreview).length > 0) {
        setActiveSchemaTab(Object.keys(schemaForPreview)[0]);
      }
      setShowSchemaPanel(true);
      // Don't close the preview modal yet - let user choose regeneration option
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
      // Edit prompt - close preview modal and open config modal
      onPreviewModalClose(); // Close preview modal
      onConfigModalClose(); // Close any open config modal
      // Small delay to ensure modals are closed, then open config modal
      setTimeout(() => {
        onConfigModalOpen(); // Open the config modal
      }, 100);
    }
  };

  const handleRegenerationCancel = () => {
    setShowRegenerationOptionsModal(false);
    // Don't close the preview modal - just hide the regeneration options
    // User can continue viewing the preview
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
        title={"Preview Master Schema"}
        size="lg"
        variant="slider"
        footer={
          <div className="flex items-center justify-end space-x-4">
          </div>
        }
      >
        <div className="space-y-4 p-2">
          {/* Content - Schema preview */}
          <div className="border-l border-gray-300 bg-gray-50 flex flex-col shadow-lg">
            {/* Add tabs here */}
            {schemaForPreview && Object.keys(schemaForPreview).length > 0 && (
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="min-w-max">
                    <Tab
                      items={Object.keys(schemaForPreview).map(key => ({ 
                        id: key, 
                        label: schemaForPreview[key].title || key 
                      }))}
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
                      title={`${currentSchema.title || activePreviewSchemaTab} Schema Details`}
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
                value={masterDataPrompt}
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
                            items={Object.keys(schemaForPreview).map(key => ({ 
                              id: key, 
                              label: schemaForPreview[key].title || key 
                            }))}
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
                            title={`${currentSchema.title || activeSchemaTab} Schema Details`}
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
          onClose={handleRegenerationCancel}
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
                onClick={handleRegenerationCancel}
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