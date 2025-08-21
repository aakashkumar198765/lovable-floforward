import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FlexLayout } from "../../components/atoms/layouts";
import { Button, LoadingState, Alert } from "../../components/atoms";
import paramSDKService from "../../services/ParamSDKService";
import appCreationService from "../../services/AppCreationService";
import DemoApp from "../../components/DemoApp";
import { executeMind, streamSSE, getSession } from "../../services/paramai_browsersdk";
import Logs from "./Logs";
import config from "../../config.json";

interface ConversationMessage {
  id: string;
  type: "user" | "agent" | "system";
  content: string;
  timestamp: string;
  status?: "sending" | "sent" | "processing";
  suggestions?: string[];
}

interface LogEntry {
  message: string;
  status: string;
  format: string;
}

const CreateDeployScreen: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, projectName } = useParams<{
    projectId: string;
    projectName: string;
  }>();
  const [deploymentStatus, setDeploymentStatus] = useState<
    "idle" | "creating" | "completed" | "failed"
  >("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [streamCompleted, setStreamCompleted] = useState(false);
  const [project, setProject] = useState("");
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [stateMachineWorkflows, setStateMachineWorkflows] = useState<string[]>([]);
  const [stateMachineSessionId, setStateMachineSessionId] = useState<string | null>(null);
  const [currentlyBuildingWorkflow, setCurrentlyBuildingWorkflow] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const addMessage = (
    type: ConversationMessage["type"],
    content: string,
    suggestions?: string[]
  ) => {
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString(),
      status: type === "user" ? "sent" : undefined,
      suggestions,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addLogMessage = (logEntry: LogEntry) => {
    // Convert log entry to chat message
    const messageType = logEntry.status === "error" ? "system" : "agent";
    addMessage(messageType, logEntry.message);
  };

  // Handle workflow selection
  const handleWorkflowSelect = (workflowName: string) => {
    // Prevent selection if already building a workflow
    if (currentlyBuildingWorkflow) {
      addMessage("agent", `⚠️ **Workflow in progress**: Currently building ${currentlyBuildingWorkflow}. Please wait for it to complete before selecting another workflow.`);
      return;
    }

    console.log("🔍 Workflow selected:", workflowName);
    
    // Create the same format as the button text
    const workflowText = workflowName.toLowerCase().includes('workflow') ? workflowName : `${workflowName} workflow`;
    const fullMessage = `Build ${workflowText}`;
    
    // Set the currently building workflow
    setCurrentlyBuildingWorkflow(workflowText);
    
    // Add the user message to chat immediately
    addMessage("user", fullMessage);
    
    // Add a message to show the workflow was selected
    addMessage("agent", `✅ **Workflow Selected:** ${workflowText}\n\nExecuting this workflow for your application...`);
    
    // Clear the input field
    setUserInput("");
    
    // Directly execute the workflow
    executeWorkflow(workflowText);
  };

  // Handle user message with workflow support
  const handleUserMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isAgentTyping) return;

    const message = userInput.trim();
    setUserInput("");

    addMessage("user", message);
    
    // Check if this is a workflow-related message
    if (message.toLowerCase().startsWith("build ")) {
      // Extract workflow name from the message - capture everything after "Build "
      const workflowMatch = message.match(/^build\s+(.+)/i);
      if (workflowMatch) {
        const workflowName = workflowMatch[1].trim();
        console.log("🔍 Executing workflow:", workflowName);
        
        // Execute the mind with the selected workflow
        executeWorkflow(workflowName);
        return;
      }
    }
    
    // Simple response for other user messages
    setIsAgentTyping(true);
    setTimeout(() => {
      setIsAgentTyping(false);
      addMessage("agent", "I'm currently building your application. Once it's ready, you'll be able to interact with it in the preview panel.");
    }, 1000);
  };

  // Execute workflow using executeMind
  const executeWorkflow = async (workflowName: string) => {
    try {
      setIsAgentTyping(true);
      addMessage("agent", `🚀 **Executing Workflow:** ${workflowName}\n\nI'm now executing this workflow for your application...`);
      
      const mindName = projectName ? 
        (projectName.startsWith("P_") ? projectName.replace(/^P_/, 'A_') : `A_${projectName}`) 
        : `A_${Date.now()}`;
      
      const responseStructure = {
        api: {},
        ui: {
          type: "tabs",
          tabs: [],
          content: {},
        },
      };

      const args = {
        project_id: projectId,
        project_name: projectName,
        user_prompt: `Build ${workflowName}`,
        files: [],
      };

      console.log(`🔧 Executing workflow with parameters:`, {
        mindName,
        args,
        responseStructure,
        mindId: config.paramAiSdk.appBuilderMindId,
        user_prompt: workflowName
      });

      const response = await executeMind(
        mindName, 
        args, 
        responseStructure, 
        config.paramAiSdk.appBuilderMindId
      );

      const { job_id, session_id } = response;
      
      addMessage("agent", `⚡ **Workflow execution initiated**\n- Job ID: \`${job_id}\`\n- Session: \`${session_id}\``);

      // Start streaming logs for the workflow execution
      try {
        await streamSSE(job_id, {
          onEvent: (data: any) => {
            let message = "";
            if (typeof data === "object" && data !== null) {
              message = data.message || data.text || JSON.stringify(data);
            } else if (typeof data === "string") {
              try {
                const parsed = JSON.parse(data);
                message = parsed.message || parsed.text || data;
              } catch (e) {
                message = data;
              }
            }

            if (message) {
              addMessage("agent", `📝 ${message}`);
            }
          },
          onComplete: async (data: any) => {
            console.log("Workflow execution completed:", data);
            addMessage("agent", `✅ **Workflow execution completed successfully!**\n\nYour application has been updated with the ${workflowName} workflow.`);
            setIsAgentTyping(false);
            setCurrentlyBuildingWorkflow(null); // Clear the currently building workflow
          },
          onError: (error: any) => {
            console.error("Workflow execution error:", error);
            addMessage("agent", `❌ **Workflow execution failed**\n- Error: ${error instanceof Error ? error.message : "Unknown error"}`);
            setIsAgentTyping(false);
            setCurrentlyBuildingWorkflow(null); // Clear the currently building workflow
          },
          maxRetries: 3,
          retryDelay: 2000,
        });
      } catch (streamError) {
        console.error("Workflow stream error:", streamError);
        addMessage("agent", `❌ **Workflow stream connection failed**\n- Error: ${streamError instanceof Error ? streamError.message : "Unknown error"}`);
        setIsAgentTyping(false);
        setCurrentlyBuildingWorkflow(null); // Clear the currently building workflow
      }
    } catch (error) {
      console.error("Workflow execution failed:", error);
      addMessage("agent", `❌ **Workflow execution failed**\n- Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsAgentTyping(false);
      setCurrentlyBuildingWorkflow(null); // Clear the currently building workflow
    }
  };

  const handleBackToPrompt = () => {
    navigate(
      `/project-plan/${projectId || "default-id"}/${
        projectName || "default-project"
      }`
    );
  };

  // Check for existing sessions first
  const checkExistingSessions = async () => {
    try {
      console.log("🔍 Checking for existing sessions...");
      console.log("🔍 Project Name:", projectName);
      console.log("🔍 Project ID:", projectId);
      
      // Add initial message
      addMessage("agent", "🔍 Checking for existing application sessions...");

      // Get all sessions
      const allSessions = await getSession(config.paramAiSdk.appBuilderMindId);
      console.log("All sessions response:", allSessions);

      if (!allSessions?.response || !Array.isArray(allSessions.response)) {
        console.log("No sessions found or invalid response");
        return false;
      }

      // Filter sessions starting with "A_"
      const appSessions = allSessions.response.filter((session: any) => 
        session?.name && session.name.startsWith("A_")
      );
      console.log("App sessions (starting with A_):", appSessions);

      // Generate the expected mind name based on project name
      // Project format: "P_21082025_1429" -> Mind format: "A_21082025_1429"
      const expectedMindName = projectName ? 
        (projectName.startsWith("P_") ? projectName.replace(/^P_/, 'A_') : `A_${projectName}`) 
        : null;
      console.log("Expected mind name:", expectedMindName);

      if (!expectedMindName) {
        console.log("No expected mind name generated");
        return false;
      }

      // Find matching session
      const matchingSession = appSessions.find((session: any) => 
        session?.name === expectedMindName
      );

      if (matchingSession) {
        console.log("✅ Found matching session:", matchingSession);
        setProject(expectedMindName);
        
        // If session has a URL, set it
        if (matchingSession.url) {
          setSessionUrl(matchingSession.url);
          addMessage("agent", `🎉 Found existing application! Your application is ready to use.`);
        } else {
          addMessage("agent", `✅ Found existing application session: ${expectedMindName}. Loading preview...`);
        }
        
        setDeploymentStatus("completed");
        setIsProcessing(false);
        
        // Fetch state machine workflows after finding the session
        await fetchStateMachineWorkflows();
        
        return true;
      } else {
        console.log("No matching session found, will create new one");
        addMessage("agent", "🔍 No existing application found. Starting to build a new one...");
        return false;
      }
    } catch (error) {
      console.error("Error checking existing sessions:", error);
      return false;
    }
  };

  // Fetch state machine sessions and extract workflows
  const fetchStateMachineWorkflows = async () => {
    try {
      console.log("🔍 Fetching state machine workflows for project:", projectName);
      
      // Get state machine sessions using the stateMachineMindId from config
      const stateMachineSessions = await getSession(config.paramAiSdk.stateMachineMindId);
      console.log("State machine sessions response:", stateMachineSessions);
      
      if (stateMachineSessions?.response && Array.isArray(stateMachineSessions.response)) {
        // Find session that matches the project name
        const matchingStateMachineSession = stateMachineSessions.response.find(
          (session: any) => session?.name === projectName
        );
        
        if (matchingStateMachineSession) {
          console.log("✅ Found matching state machine session:", matchingStateMachineSession);
          setStateMachineSessionId(matchingStateMachineSession._id);
          
          // Get the full session data using session ID
          const fullStateMachineSession = await getSession(
            config.paramAiSdk.stateMachineMindId,
            "",
            matchingStateMachineSession._id
          );
          console.log("Full state machine session:", fullStateMachineSession);
          
          // Extract workflows from the session response
          if (fullStateMachineSession?.response?.output?.content?.["WorkflowResponse"]?.[0]) {
            const workflowResponse = fullStateMachineSession.response.output.content["WorkflowResponse"][0];
            if (workflowResponse?.type === "markdown") {
              // Parse the JSON content to extract workflow names
              try {
                const workflowContent = workflowResponse.content.replace(/^```json\n|```$/g, "");
                const parsedWorkflows = JSON.parse(workflowContent);
                
                if (parsedWorkflows?.consolidated_state_machines) {
                  const workflowNames = Object.values(parsedWorkflows.consolidated_state_machines)
                    .map((sm: any) => sm?.Name)
                    .filter(Boolean);
                  
                  console.log("📊 Extracted workflow names:", workflowNames);
                  setStateMachineWorkflows(workflowNames);
                  
                  if (workflowNames.length > 0) {
                    addMessage("agent", `📋 **Available Workflows:**\nI found ${workflowNames.length} workflow(s) from your project plan. You can click on any workflow name below to use it in your application.`);
                  }
                }
              } catch (parseError) {
                console.error("Error parsing workflow response:", parseError);
              }
            }
          }
        } else {
          console.log("No matching state machine session found for project:", projectName);
        }
      }
    } catch (error) {
      console.error("Error fetching state machine workflows:", error);
    }
  };

  const createApplication = async (isRebuild = false, existingSessionId?: string) => {
    console.log(`🚀 createApplication called - isRebuild: ${isRebuild}, existingSessionId: ${existingSessionId || 'none'}`);
    
    setIsRebuilding(isRebuild);
    setDeploymentStatus("creating");
    setMessages([]);
    setLogs([]);
    setIsProcessing(true);
    setSessionUrl(null);

    // Add initial message for rebuild vs new build
    if (isRebuild) {
      addMessage("agent", `🔄 **Starting application rebuild...**\nThis will update your existing application with the latest changes.`);
    }

    // Generate mind name based on project name format
    // Project format: "P_21082025_1429" -> Mind format: "A_21082025_1429"
    const mindName = projectName ? 
      (projectName.startsWith("P_") ? projectName.replace(/^P_/, 'A_') : `A_${projectName}`) 
      : `A_${Date.now()}`;
    
    setProject(mindName);

    const responseStructure = {
      api: {},
      ui: {
        type: "tabs",
        tabs: [],
        content: {},
      },
    };

    const args = {
      project_id: projectId,
      project_name: projectName,
      files: [],
    };

    try {
      // Add initial log entry
      const initialLog = {
        message: `🚀 **${isRebuild ? 'Rebuilding' : 'Starting'} application build...**\n- Mind Name: \`${mindName}\`\n- Project: \`${projectName}\`\n- Project ID: \`${projectId}\`${isRebuild && existingSessionId ? `\n- Updating existing session: \`${existingSessionId}\`` : ''}`,
        status: "started",
        format: "markdown",
      };
      setLogs((prev) => [...prev, initialLog]);
      addLogMessage(initialLog);

      // Execute the mind using appBuilderMindId from config
      // If rebuilding, pass the existing session ID to update the same session
      console.log(`🔧 Calling executeMind with parameters:`, {
        mindName,
        args,
        responseStructure,
        mindId: config.paramAiSdk.appBuilderMindId,
        session_id: isRebuild ? existingSessionId : undefined,
        isRebuild
      });
      
      const response = await executeMind(
        mindName, 
        args, 
        responseStructure, 
        config.paramAiSdk.appBuilderMindId,
        isRebuild ? existingSessionId : undefined
      );
      const { job_id, session_id } = response;

      // Add execution log
      const executionLog = {
        message: `⚡ **Build process initiated**\n- Job ID: \`${job_id}\`\n- Session: \`${session_id}\`${isRebuild && existingSessionId ? `\n- Updating existing session: \`${existingSessionId}\`` : ''}`,
        status: "pending",
        format: "markdown",
      };
      setLogs((prev) => [...prev, executionLog]);
      addLogMessage(executionLog);

      // Start streaming logs
      try {
        // Capture the rebuild parameters for use in the callback
        const rebuildParams = { isRebuild, existingSessionId };
        
        await streamSSE(job_id, {
          onEvent: (data: any) => {
            let message = "";
            let status = "pending";
            let format = "text";

            if (typeof data === "object" && data !== null) {
              message = data.message || data.text || JSON.stringify(data);
              status = data.status || "pending";
              format = data.format || "text";
            } else if (typeof data === "string") {
              try {
                const parsed = JSON.parse(data);
                message = parsed.message || parsed.text || data;
                status = parsed.status || "pending";
                format = parsed.format || "text";
              } catch (e) {
                message = data;
              }
            }

            const logEntry = {
              message: `📝 ${message}`,
              status,
              format,
            };

            setLogs((prev) => [...prev, logEntry]);
            addLogMessage(logEntry);
          },
          onComplete: async (data: any) => {
            console.log("Stream completed:", data);
            setStreamCompleted(true);

            let message = "";
            let status = "completed";
            let format = "text";

            if (typeof data === "object" && data !== null) {
              message = data.message || data.text || JSON.stringify(data);
              status = data.status || "completed";
              format = data.format || "text";
            } else if (typeof data === "string") {
              try {
                const parsed = JSON.parse(data);
                message = parsed.message || parsed.text || data;
                status = parsed.status || "completed";
                format = parsed.format || "text";
              } catch (e) {
                message = data;
              }
            }

            const completionLog = {
              message: `✅ **${rebuildParams.isRebuild ? 'Rebuild' : 'Build'} completed successfully!**\n${message}`,
              status,
              format,
            };

            setLogs((prev) => [...prev, completionLog]);
            addLogMessage(completionLog);

            setDeploymentStatus("completed");
            setIsProcessing(false);

            // Try to fetch session URL once, then show iframe regardless
            addMessage("agent", "🔍 Searching for your application URL...");
            // If rebuilding, use the existing session ID; otherwise use the new one
            const sessionIdToUse = rebuildParams.isRebuild && rebuildParams.existingSessionId ? rebuildParams.existingSessionId : session_id;
            await fetchSessionUrl(sessionIdToUse);
            
            // Add completion message
            if (rebuildParams.isRebuild) {
              addMessage("agent", `🎉 **Rebuild completed successfully!** Your application has been updated with the latest changes.`);
            }
            
            // Fetch state machine workflows after build completion
            await fetchStateMachineWorkflows();
          },
          onError: (error: any) => {
            console.error("Stream error:", error);
            const errorLog = {
              message: `❌ **Build failed**\n- Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              status: "error",
              format: "markdown",
            };
            setLogs((prev) => [...prev, errorLog]);
            addLogMessage(errorLog);
            setDeploymentStatus("failed");
            setIsProcessing(false);
          },
          maxRetries: 3,
          retryDelay: 2000,
        });
      } catch (streamError) {
        console.error("Stream error:", streamError);
        const streamErrorLog = {
          message: `❌ **Stream connection failed**\n- Error: ${
            streamError instanceof Error
              ? streamError.message
              : "Unknown error"
          }`,
          status: "error",
          format: "markdown",
        };
        setLogs((prev) => [...prev, streamErrorLog]);
        addLogMessage(streamErrorLog);
        setDeploymentStatus("failed");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("App creation failed:", error);
      const buildErrorLog = {
        message: `❌ **Build initialization failed**\n- Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        status: "error",
        format: "markdown",
      };
      setLogs((prev) => [...prev, buildErrorLog]);
      addLogMessage(buildErrorLog);
      setDeploymentStatus("failed");
      setIsProcessing(false);
    }
  };

    const fetchSessionUrl = async (sessionId: string) => {
    try {
      console.log("🔍 Fetching session URL for sessionId:", sessionId);
      console.log("🔍 Project ID:", projectId);
      console.log("🔍 Project Name:", projectName);
      console.log("🔍 Mind Name:", project);
      
      // First try to get the specific session by sessionId
      const specificSession = await getSession(config.paramAiSdk.appBuilderMindId, "", sessionId);
      console.log("Specific session response:", specificSession);

      if (specificSession?.response?.url) {
        console.log("✅ Found URL in specific session:", specificSession.response.url);
        setSessionUrl(specificSession.response.url);
        addMessage("agent", `🎉 Your application is ready! You can now view it in the preview panel.`);
        return;
      }

      // If no URL in specific session, try to get all sessions and find by mind name
      const allSessions = await getSession(config.paramAiSdk.appBuilderMindId);
      console.log("All sessions response:", allSessions);
      console.log("All sessions count:", allSessions?.response?.length || 0);
      
      if (allSessions?.response) {
        console.log("Available session names:", allSessions.response.map((s: any) => ({ name: s.name, id: s._id, url: s.url })));
      }

      // Try multiple ways to find the project session
      let projectSession = null;
      
      // Method 1: Look for exact mind name match (this should be the primary method)
      projectSession = allSessions?.response?.find(
        (session: any) => session?.name === project
      );

      // Method 2: Look for exact project name match
      if (!projectSession) {
        projectSession = allSessions?.response?.find(
          (session: any) => session?.name === projectName
        );
      }

      // Method 3: Look for project name in session name (partial match)
      if (!projectSession) {
        projectSession = allSessions?.response?.find(
          (session: any) => session?.name?.includes(projectName) || projectName?.includes(session?.name)
        );
      }

      // Method 4: Look for project ID in session name
      if (!projectSession) {
        projectSession = allSessions?.response?.find(
          (session: any) => session?.name === projectId
        );
      }

      console.log("Found project session:", projectSession);

      if (projectSession && projectSession.url) {
        setSessionUrl(projectSession.url);
        addMessage("agent", `🎉 Your application is ready! You can now view it in the preview panel.`);
      } else {
        // Log the session structure to debug
        console.log("Session structure:", projectSession);
        
        // Only show message once, no retries
        if (!sessionUrl) {
          addMessage("agent", `✅ Build completed! The application is ready in the preview panel with fallback content.`);
        }
      }
    } catch (error) {
      console.error("Failed to fetch session URL:", error);
      addMessage("agent", `✅ Build completed! However, there was an issue retrieving the application URL.`);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Start app creation automatically when component mounts
  useEffect(() => {
    const initializeApp = async () => {
      const sessionExists = await checkExistingSessions();
      if (!sessionExists) {
        await createApplication(false); // Not a rebuild
      }
      
      // Always try to fetch state machine workflows
      await fetchStateMachineWorkflows();
    };
    
    initializeApp();
  }, []);

  const renderMessage = (message: ConversationMessage) => {
    const isUser = message.type === "user";
    const isSystem = message.type === "system";

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div className={`max-w-[85%] ${isUser ? "order-2" : "order-1"}`}>
          {!isUser && (
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {isSystem ? "⚙️" : "🤖"}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {isSystem ? "System" : "AI Assistant"}
              </span>
              <span className="text-xs text-gray-500">{message.timestamp}</span>
            </div>
          )}

          <div
            className={`rounded-lg px-4 py-3 ${
              isUser
                ? "bg-gray-800 text-white"
                : isSystem
                ? "bg-gray-100 text-gray-800 border border-gray-200"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>

            {isUser && (
              <div className="flex justify-end mt-1">
                <span className="text-xs text-blue-200">
                  {message.timestamp}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    if (deploymentStatus === "creating") {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isRebuilding ? 'Rebuilding Your Application' : 'Building Your Application'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isRebuilding 
                ? 'AI is rebuilding your application from the project plan...'
                : 'AI is creating your application from the project plan...'}
            </p>
            <div className="text-sm text-gray-500">
              This may take a few minutes
            </div>
          </div>
        </div>
      );
    }

    if (deploymentStatus === "idle") {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Checking for Existing Applications
            </h3>
            <p className="text-gray-600 mb-4">
              Looking for previously built applications...
            </p>
            <div className="text-sm text-gray-500">
              This should only take a moment
            </div>
          </div>
        </div>
      );
    }

    if (deploymentStatus === "completed") {
      // Once build is completed, always show the iframe
      // If we have a session URL, use it; otherwise use a fallback
      const iframeSrc = sessionUrl || "https://www.paramai.studio/";
      
      return (
        <div className="h-full">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">✅</span>
              <span className="font-semibold text-gray-800">
                Application Ready
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              {sessionUrl 
                ? "Your application has been built successfully and is ready to use"
                : "Your application has been built successfully. Loading preview..."
              }
            </p>
            {sessionUrl && (
              <div className="mt-2 text-xs text-gray-500">
                Found existing session: {project}
              </div>
            )}
          </div>

          <div className="h-full overflow-auto">
            <iframe
              src={iframeSrc}
              className="w-full h-full border-0"
              title="Application Preview"
              onLoad={() => {
                console.log("Application loaded successfully");
                if (!sessionUrl) {
                  addMessage("agent", "📱 Application preview loaded successfully! The iframe is now displaying your application.");
                }
              }}
              onError={() => console.error("Failed to load application")}
            />
          </div>
        </div>
      );
    }

    if (deploymentStatus === "failed") {
      return (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-gray-600 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Build Failed
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error during the build process.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setDeploymentStatus("idle");
                createApplication();
              }}
            >
              Retry Build
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🚀</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Ready to Build
          </h3>
          <p className="text-gray-600">
            Your application will be created from the project plan.
          </p>
        </div>
      </div>
    );
  };

  const getStatusDisplay = () => {
    switch (deploymentStatus) {
      case "creating":
        return { 
          text: isRebuilding ? "Rebuilding..." : "Building...", 
          color: "bg-blue-100 text-blue-800" 
        };
      case "completed":
        return { text: "Ready", color: "bg-green-100 text-green-800" };
      case "failed":
        return { text: "Failed", color: "bg-red-100 text-red-800" };
      default:
        return { text: "Checking...", color: "bg-gray-100 text-gray-800" };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(
                `/project-plan/${projectId || "default-id"}/${
                  projectName || "default-project"
                }`
              )
            }
          >
            Back to Project
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Build Application
            </h1>
            <p className="text-sm text-gray-600">
              {deploymentStatus === "creating" &&
                (isRebuilding 
                  ? "AI is rebuilding your application from the project plan"
                  : "AI is building your application from the project plan")}
              {deploymentStatus === "completed" &&
                sessionUrl 
                  ? "Your application is ready to use"
                  : "Your application has been built and is ready to use"}
              {deploymentStatus === "failed" &&
                "Build failed - let's try again"}
              {deploymentStatus === "idle" &&
                "Checking for existing application sessions..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {deploymentStatus === "completed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                // Get the existing session ID before clearing the state
                let existingSessionId;
                if (sessionUrl && project) {
                  // Try to get the actual session ID from the existing session
                  try {
                    console.log("🔍 Rebuild: Looking for existing session with project:", project);
                    const allSessions = await getSession(config.paramAiSdk.appBuilderMindId);
                    console.log("🔍 Rebuild: All sessions response:", allSessions);
                    
                    if (allSessions?.response) {
                      console.log("🔍 Rebuild: Available sessions:", allSessions.response.map((s: any) => ({ 
                        name: s.name, 
                        id: s._id, 
                        url: s.url 
                      })));
                      
                      const existingSession = allSessions.response.find((session: any) => 
                        session?.name === project
                      );
                      console.log("🔍 Rebuild: Found existing session:", existingSession);
                      
                      if (existingSession?._id) {
                        existingSessionId = existingSession._id;
                        console.log("🔍 Found existing session ID for rebuild:", existingSessionId);
                      } else {
                        console.log("⚠️ Rebuild: No session ID found in existing session");
                      }
                    }
                  } catch (error) {
                    console.error("Error getting existing session ID:", error);
                  }
                } else {
                  console.log("⚠️ Rebuild: No sessionUrl or project available");
                }
                
                setDeploymentStatus("idle");
                setMessages([]);
                setLogs([]);
                setSessionUrl(null);
                
                // Pass the existing session ID for rebuilding
                createApplication(true, existingSessionId);
              }}
            >
              Rebuild App
            </Button>
          )}
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}
          >
            {statusDisplay.text}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversational Chat Panel */}
        <div className="w-2/5 flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-5 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-sm text-white font-bold">🤖</span>
              </div>
              <div>
                <h2 className="font-semibold">Build Assistant</h2>
                <p className="text-gray-400 text-xs">
                  {isProcessing
                    ? (isRebuilding ? "Rebuilding your application..." : "Building your application...")
                    : "Ready to help with your app"}
                </p>
              </div>
              {isProcessing && (
                <div className="ml-auto">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-1"
          >
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg">🤖</span>
                </div>
                <p className="text-sm">Build Assistant is initializing...</p>
              </div>
            ) : (
              messages.map(renderMessage)
            )}

            {isAgentTyping && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">🤖</span>
                    </div>
                    <span className="text-xs text-gray-400">Build Assistant</span>
                  </div>
                  <div className="bg-gray-100 text-gray-800 border border-gray-200 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Thinking</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Workflow Suggestions */}
            {stateMachineWorkflows.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-600">📋</span>
                  <span className="text-sm font-medium text-blue-800">Available Workflows</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stateMachineWorkflows.map((workflow, index) => {
                    const workflowText = workflow.toLowerCase().includes('workflow') ? workflow : `${workflow} workflow`;
                    const isCurrentlyBuilding = currentlyBuildingWorkflow === workflowText;
                    const isDisabled = currentlyBuildingWorkflow !== null;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleWorkflowSelect(workflow)}
                        disabled={isDisabled}
                        className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
                          isCurrentlyBuilding
                            ? 'bg-yellow-100 border-yellow-300 text-yellow-800 animate-pulse'
                            : isDisabled
                            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 hover:shadow-sm cursor-pointer'
                        }`}
                      >
                        {isCurrentlyBuilding ? (
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                            Building {workflowText}...
                          </span>
                        ) : (
                          `Build ${workflowText}`
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Click on any workflow to build it in your application
                </p>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleUserMessage} className="p-4 border-t">
            <div className="flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about your application build..."
                className="flex-1 text-sm px-4 py-3 rounded-2xl border focus:border-blue-500 focus:outline-none placeholder-gray-400"
                disabled={isAgentTyping}
              />
              <Button
                type="submit"
                disabled={!userInput.trim() || isAgentTyping}
                variant="primary"
                className="px-4 py-3 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Send</span>
                <span className="sm:hidden">↗</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        <div className="w-3/5 bg-white flex flex-col h-full border-l border-gray-200">
          <div className="flex-1 overflow-hidden">{renderPreview()}</div>
        </div>
      </div>
    </div>
  );
};

export default CreateDeployScreen;
