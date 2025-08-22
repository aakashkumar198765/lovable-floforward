import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FlexLayout } from "../../components/atoms/layouts";
import { Button, LoadingState, Alert } from "../../components/atoms";
import paramSDKService from "../../services/ParamSDKService";
import appCreationService from "../../services/AppCreationService";
import DemoApp from "../../components/DemoApp";
import { executeMind, streamSSE, getSession } from "../../services/paramai_browsersdk";
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
  const [sessionId, setSessionId] = useState<string | null>(null); // Store the actual session ID
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [stateMachineWorkflows, setStateMachineWorkflows] = useState<string[]>([]);
  const [stateMachineSessionId, setStateMachineSessionId] = useState<string | null>(null);
  const [currentlyBuildingWorkflow, setCurrentlyBuildingWorkflow] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logsMessageId, setLogsMessageId] = useState<string | null>(null);
  const [logsData, setLogsData] = useState<any[] | null>(null); // New state for logs data
  const [logsLoading, setLogsLoading] = useState(false); // New state for loading logs
  const [fullSessionData, setFullSessionData] = useState<any>(null);
  const [showWorkflowAnalysis, setShowWorkflowAnalysis] = useState(false); // New state for workflow analysis
  const [workflowAnalysisData, setWorkflowAnalysisData] = useState<any>(null); // New state for workflow analysis data

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

  // Function to manually refresh session information
  const refreshSessionInfo = async () => {
    if (!sessionId) {
      addMessage("agent", "⚠️ No session ID available to refresh.");
      return;
    }
    
    try {
      addMessage("agent", "🔄 **Refreshing session information...**");
      
      const fullSession = await getSession(
        config.paramAiSdk.appBuilderMindId,
        "",
        sessionId
      );
      
      if (fullSession?.response) {
        console.log("Refreshed session data:", fullSession.response);
        displaySessionInfo(fullSession.response, "Refreshed Application Session");
      } else {
        addMessage("agent", "❌ Failed to refresh session information.");
      }
    } catch (error) {
      console.error("Error refreshing session info:", error);
      addMessage("agent", `❌ **Error refreshing session:** ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  // Function to display full session logs
  const viewFullLogs = async () => {
    if (!sessionId) {
      addMessage("agent", "⚠️ No session ID available to view logs.");
      return;
    }
    
    try {
      addMessage("agent", "📝 **Fetching full session logs...**");
      
      const fullSession = await getSession(
        config.paramAiSdk.appBuilderMindId,
        "",
        sessionId
      );
      
      if (fullSession?.response?.logs && Array.isArray(fullSession.response.logs)) {
        const logs = fullSession.response.logs;
        addMessage("agent", `📋 **Full Session Logs (${logs.length} entries):**`);
        
        logs.forEach((log: any, index: number) => {
          if (log.message) {
            const timestamp = log.timestamp || `Entry ${index + 1}`;
            const status = log.status ? ` [${log.status}]` : '';
            addMessage("agent", `📝 **${timestamp}${status}:**\n${log.message}`);
          }
        });
      } else {
        addMessage("agent", "ℹ️ No logs found for this session.");
      }
    } catch (error) {
      console.error("Error fetching full logs:", error);
      addMessage("agent", `❌ **Error fetching logs:** ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  // Function to display detailed session output
  const viewOutputDetails = async () => {
    if (!sessionId) {
      addMessage("agent", "⚠️ No session ID available to view output details.");
      return;
    }
    
    try {
      addMessage("agent", "📤 **Fetching session output details...**");
      
      const fullSession = await getSession(
        config.paramAiSdk.appBuilderMindId,
        "",
        sessionId
      );
      
      if (fullSession?.response?.output) {
        const output = fullSession.response.output;
        addMessage("agent", `📊 **Session Output Details:**`);
        
        if (output.type === "tabs" && output.tabs) {
          addMessage("agent", `📑 **Output Type:** ${output.type}\n📋 **Available Tabs:** ${output.tabs.join(", ")}`);
          
          if (output.content) {
            Object.keys(output.content).forEach((tabName) => {
              const tabContent = output.content[tabName];
              if (Array.isArray(tabContent) && tabContent.length > 0) {
                addMessage("agent", `\n**${tabName} Tab Content:**`);
                tabContent.forEach((item: any, index: number) => {
                  if (item.type === "markdown" && item.content) {
                    addMessage("agent", `📝 **${tabName} - Item ${index + 1}:**\n\`\`\`markdown\n${item.content}\n\`\`\``);
                  } else {
                    addMessage("agent", `📄 **${tabName} - Item ${index + 1}:**\n\`\`\`json\n${JSON.stringify(item, null, 2)}\n\`\`\``);
                  }
                });
              }
            });
          }
        } else {
          addMessage("agent", `📄 **Raw Output:**\n\`\`\`json\n${JSON.stringify(output, null, 2)}\n\`\`\``);
        }
      } else {
        addMessage("agent", "ℹ️ No output found for this session.");
      }
    } catch (error) {
      console.error("Error fetching output details:", error);
      addMessage("agent", `❌ **Error fetching output details:** ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  // Helper function to extract URL from session data
  const extractUrlFromSession = (sessionData: any): string | null => {
    if (!sessionData?.output) return null;
    
    const output = sessionData.output;
    
    // Check if output has the expected structure with tabs and content
    if (output.type === "tabs" && output.content) {
      // Look for the Aipagegenerator__001 tab content
      const aiPageContent = output.content["Aipagegenerator__001"];
      if (aiPageContent && Array.isArray(aiPageContent) && aiPageContent.length > 0) {
        // Get the first item which should contain the URL
        const firstItem = aiPageContent[0];
        if (firstItem.type === "markdown" && firstItem.content) {
          // Check if content is a URL
          if (firstItem.content.startsWith('http')) {
            return firstItem.content;
          }
        }
      }
    }
    
    // Fallback: check if there's a direct URL property
    return sessionData.url || null;
  };

  // Helper function to display session information in a formatted way
  const displaySessionInfo = (sessionData: any, sessionType: string = "Session") => {
    // Store the full session data for future use (logs, etc.)
    setFullSessionData(sessionData);
    
    let infoMessage = `📊 **${sessionType} Information:**\n`;
    
    // Display session args if available
    if (sessionData.args) {
      infoMessage += `\n📋 **Args:**\n\`\`\`json\n${JSON.stringify(sessionData.args, null, 2)}\n\`\`\``;
    }
    
    // Display session output if available - Updated to handle the specific output structure
    if (sessionData.output) {
      if (sessionData.output.type === "tabs" && sessionData.output.tabs) {
        infoMessage += `\n📤 **Output Tabs:** ${sessionData.output.tabs.join(", ")}`;
        
        // Display content for each tab - Updated to handle the specific content structure
        if (sessionData.output.content) {
          Object.keys(sessionData.output.content).forEach((tabName) => {
            const tabContent = sessionData.output.content[tabName];
            if (Array.isArray(tabContent) && tabContent.length > 0) {
              infoMessage += `\n\n**${tabName}:**`;
              tabContent.forEach((item: any, index: number) => {
                if (item.type === "markdown" && item.content) {
                  // Check if content is a URL
                  if (item.content.startsWith('http')) {
                    infoMessage += `\n${index + 1}. 🔗 **Application URL:** ${item.content}`;
                    
                    // If this is the first URL found and we don't have a session URL yet, set it
                    if (!sessionUrl && index === 0) {
                      console.log("🔗 Setting session URL from displaySessionInfo:", item.content);
                      setSessionUrl(item.content);
                    }
                  } else {
                    // Truncate long content to avoid overwhelming the chat
                    const truncatedContent = item.content.length > 200 
                      ? item.content.substring(0, 200) + "..."
                      : item.content;
                    infoMessage += `\n${index + 1}. ${truncatedContent}`;
                  }
                }
              });
            }
          });
        }
      } else {
        infoMessage += `\n📤 **Output:**\n\`\`\`json\n${JSON.stringify(sessionData.output, null, 2)}\n\`\`\``;
      }
    }
    
    // Display session logs count if available
    if (sessionData.logs && Array.isArray(sessionData.logs)) {
      infoMessage += `\n\n📝 **Logs:** Found ${sessionData.logs.length} log entries`;
      
      // Add recent logs (limit to last 3 to avoid spam)
      const recentLogs = sessionData.logs.slice(-3);
      if (recentLogs.length > 0) {
        infoMessage += `\n\n**Recent Logs:**`;
        recentLogs.forEach((log: any, index: number) => {
          if (log.message) {
            // Truncate long log messages
            const truncatedMessage = log.message.length > 150 
              ? log.message.substring(0, 150) + "..."
              : log.message;
            infoMessage += `\n${index + 1}. ${truncatedMessage}`;
          }
        });
      }
    }
    
    // Add session metadata if available
    if (sessionData.created_at) {
      infoMessage += `\n\n⏰ **Created:** ${new Date(sessionData.created_at).toLocaleString()}`;
    }
    if (sessionData.e_at) {
      infoMessage += `\n🔄 **Executed:** ${new Date(sessionData.e_at).toLocaleString()}`;
    }
    if (sessionData.execution_status) {
      infoMessage += `\n✅ **Status:** ${sessionData.execution_status}`;
    }
    
    addMessage("agent", infoMessage);
  };

  // Function to display all logs in one card
  const displayAllLogsCard = (logs: any[]) => {
    // Store logs data for display in the card (not in chat)
    setLogsData(logs);
    setLogsLoading(false); // Ensure loading is off when using stored data
  };

  // Function to display workflow analysis in a card format
  const displayWorkflowAnalysisCard = (analysis: any) => {
    // Store workflow analysis data for display in the card (not in chat)
    setWorkflowAnalysisData(analysis);
    setShowWorkflowAnalysis(true);
  };

  // Function to fetch and display all logs
  const fetchAndDisplayAllLogs = async () => {
    if (!sessionId) {
      addMessage("agent", "⚠️ No session ID available to view logs.");
      return;
    }
    
    // Use stored session data if available, otherwise fetch
    if (fullSessionData && fullSessionData.logs && Array.isArray(fullSessionData.logs)) {
      // Use stored logs data - no need to fetch again
      displayAllLogsCard(fullSessionData.logs);
      return;
    }
    
    try {
      setLogsLoading(true);
      
      const fullSession = await getSession(
        config.paramAiSdk.appBuilderMindId,
        "",
        sessionId
      );
      
      if (fullSession?.response?.logs && Array.isArray(fullSession.response.logs)) {
        displayAllLogsCard(fullSession.response.logs);
      } else {
        addMessage("agent", "ℹ️ No logs found for this session.");
      }
    } catch (error) {
      console.error("Error fetching all logs:", error);
      addMessage("agent", `❌ **Error fetching logs:** ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLogsLoading(false);
    }
  };

  // Function to hide logs by clearing the logs data
  const hideLogs = () => {
    setLogsData(null);
    setLogsMessageId(null);
  };

  // Function to hide workflow analysis by clearing the analysis data
  const hideWorkflowAnalysis = () => {
    setWorkflowAnalysisData(null);
    setShowWorkflowAnalysis(false);
  };

  // Function to format log messages for better readability
  const formatLogMessage = (message: string) => {
    if (!message) return "";
    
    // Handle different types of log messages
    if (message.includes('[TOOL_USE]') || message.includes('[TOOL_RESULT]')) {
      return (
        <div className="space-y-2">
          {message.split('\n').map((line, lineIndex) => {
            if (line.includes('[TOOL_USE]') || line.includes('[TOOL_RESULT]')) {
              return (
                <div key={lineIndex} className="bg-blue-50 border border-blue-200 rounded p-2">
                  <span className="font-mono text-xs text-blue-800 break-all">{line}</span>
                </div>
              );
            } else if (line.includes('**') && line.includes('**')) {
              return (
                <div key={lineIndex} className="font-semibold text-gray-900">
                  {line}
                </div>
              );
            } else if (line.includes('```')) {
              return (
                <div key={lineIndex} className="bg-gray-50 border border-gray-200 rounded p-2">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all overflow-x-auto">
                    {line.replace(/```/g, '')}
                  </pre>
                </div>
              );
            } else if (line.trim()) {
              return (
                <div key={lineIndex} className="break-words">
                  {line}
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
    
    // For regular messages, just wrap long text
    return (
      <div className="break-words whitespace-pre-wrap">
        {message}
      </div>
    );
  };

  // Handle workflow selection
  const handleWorkflowSelect = (workflowName: string) => {
    // Prevent selection if already building a workflow or if application is building
    if (currentlyBuildingWorkflow) {
      addMessage("agent", `⚠️ **Workflow in progress**: Currently building ${currentlyBuildingWorkflow}. Please wait for it to complete before selecting another workflow.`);
      return;
    }
    
    // Prevent selection if application is currently building
    if (isProcessing || deploymentStatus === "creating") {
      addMessage("agent", `⚠️ **Application building in progress**: Please wait for the current application build to complete before executing additional workflows.`);
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

  // Execute user query using executeMind
  const executeUserQuery = async (userQuery: string) => {
    try {
      setIsAgentTyping(true);
      addMessage("agent", `🚀 **Executing Query:** ${userQuery}\n\nI'm now processing your request...`);
      
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

      const args: any = {
        codegen_id: mindName.replace(/^(US|P|A)/, 'P'),
        user_query: userQuery,
        files: [],
      };

      // Use the stored session ID if available
      const existingSessionId = sessionId;
      console.log(`🔧 Executing user query with parameters:`, {
        mindName,
        args,
        responseStructure,
        mindId: config.paramAiSdk.appBuilderMindId,
        user_query: userQuery,
        session_id: existingSessionId
      });
      
      const response = await executeMind(
        mindName, 
        args, 
        responseStructure, 
        config.paramAiSdk.appBuilderMindId,
        existingSessionId // Pass the stored session ID
      );

      const { job_id, session_id } = response;
      
      addMessage("agent", `⚡ **Query execution initiated**\n- Job ID: \`${job_id}\`\n- Session: \`${session_id}\``);

      // Start streaming logs for the query execution
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
            console.log("User query execution completed:", data);
            addMessage("agent", `✅ **Query execution completed successfully!**\n\nI've processed your request: "${userQuery}"`);
            setIsAgentTyping(false);
          },
          onError: (error: any) => {
            console.error("User query execution error:", error);
            addMessage("agent", `❌ **Query execution failed**\n- Error: ${error instanceof Error ? error.message : "Unknown error"}`);
            setIsAgentTyping(false);
          },
          maxRetries: 3,
          retryDelay: 2000,
        });
      } catch (streamError) {
        console.error("User query stream error:", streamError);
        addMessage("agent", `❌ **Query stream connection failed**\n- Error: ${streamError instanceof Error ? streamError.message : "Unknown error"}`);
        setIsAgentTyping(false);
      }
    } catch (error) {
      console.error("User query execution failed:", error);
      addMessage("agent", `❌ **Query execution failed**\n- Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsAgentTyping(false);
    }
  };

  // Handle user message with workflow support
  const handleUserMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isAgentTyping || isProcessing || deploymentStatus === "creating") return;

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
    
    // For other user messages, execute the mind with the user's query
    setIsAgentTyping(true);
    addMessage("agent", `🤔 **Processing your query:** "${message}"\n\nLet me analyze this and provide you with a response...`);
    
    // Execute the mind with the user's query
    executeUserQuery(message);
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

      const args: any = {
        codegen_id: mindName.replace(/^(US|P|A)/, 'P'),
        user_query: `Build ${workflowName}`,
        files: [],
      };

      // Use the stored session ID if available
      const existingSessionId = sessionId;
      console.log(`🔧 Executing workflow with parameters:`, {
        mindName,
        args,
        responseStructure,
        mindId: config.paramAiSdk.appBuilderMindId,
        user_query: `Build ${workflowName}`,
        session_id: existingSessionId
      });
      
      const response = await executeMind(
        mindName, 
        args, 
        responseStructure, 
        config.paramAiSdk.appBuilderMindId,
        existingSessionId // Pass the stored session ID
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
        
        // Store the session ID for future use
        if (matchingSession._id) {
          setSessionId(matchingSession._id);
          console.log("✅ Stored session ID:", matchingSession._id);
          
          // Fetch the full session content with logs, args, and output
          try {
            console.log("🔍 Fetching full session content for session ID:", matchingSession._id);
            const fullSession = await getSession(
              config.paramAiSdk.appBuilderMindId,
              "",
              matchingSession._id
            );
            console.log("Full session content:", fullSession);
            
            if (fullSession?.response) {
              // Extract and display session information
              const sessionData = fullSession.response;
              console.log("Full session data:", sessionData);
              
              // Use the helper function to display session information
              displaySessionInfo(sessionData, "Existing Application Session");

                // The URL extraction and status setting is now handled by displaySessionInfo
              // We just need to wait a moment for the state to update, then check if URL was found
              const sessionUrl = extractUrlFromSession(sessionData);
              setTimeout(() => {
                if (sessionUrl) {
                  console.log("✅ URL found, setting deployment status to completed");
                  setDeploymentStatus("completed");
                } else {
                  console.log("❌ No URL found, setting deployment status to failed");
                  setDeploymentStatus("failed");
                }
                setIsProcessing(false);
              }, 100);
            }
          } catch (sessionError) {
            console.error("Error fetching full session content:", sessionError);
            addMessage("agent", `⚠️ **Note:** Found existing session but couldn't retrieve full content.`);
          }
        }
        
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
    if (!isRebuild) {
      setMessages([]); // Only clear messages for new builds, not rebuilds
      setSessionUrl(null); // Only clear session URL for new builds, not rebuilds
    }
    setLogs([]);
    setIsProcessing(true);

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

    const args: any = {
      codegen_id: mindName.replace(/^(US|P|A)/, 'P'),
      user_query: isRebuild ? "Rebuild Application" : "Build Application",
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
      const sessionIdToUse = isRebuild ? (existingSessionId || sessionId) : undefined;
      console.log(`🔧 Calling executeMind with parameters:`, {
        mindName,
        args,
        responseStructure,
        mindId: config.paramAiSdk.appBuilderMindId,
        session_id: sessionIdToUse,
        user_query: isRebuild ? "Rebuild Application" : "Build Application",
        isRebuild,
        stored_session_id: sessionId
      });
      
      // Add codegen_id to args
      args.codegen_id = mindName.replace(/^(US|P|A)/, 'P');
      
      const response = await executeMind(
        mindName, 
        args, 
        responseStructure, 
        config.paramAiSdk.appBuilderMindId,
        sessionIdToUse
      );
      const { job_id, session_id } = response;

      // Add execution log
      const executionLog = {
        message: `⚡ **Build process initiated**\n- Job ID: \`${job_id}\`\n- Session: \`${session_id}\`${isRebuild && existingSessionId ? `\n- Updating existing session: \`${existingSessionId}\`` : ''}\n- Rebuild mode: ${isRebuild ? 'Yes' : 'No'}\n- Stored session ID: ${sessionId || 'None'}`,
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

            // Try to fetch session URL once, then check if build was successful
            addMessage("agent", "🔍 Searching for your application URL...");
            // If rebuilding, use the existing session ID; otherwise use the new one
            const sessionIdToUse = rebuildParams.isRebuild && rebuildParams.existingSessionId ? rebuildParams.existingSessionId : session_id;
            const urlFound = await fetchSessionUrl(sessionIdToUse);
            
                    // Check if URL was found to determine build success
        if (urlFound) {
          // Add completion message
          if (rebuildParams.isRebuild) {
            addMessage("agent", `🎉 **Rebuild completed successfully!** Your application has been updated with the latest changes.`);
          } else {
            addMessage("agent", `🎉 **Build completed successfully!** Your application is ready to use.`);
          }
          
          // Fetch state machine workflows after successful build completion
          await fetchStateMachineWorkflows();
        } else {
          // Build failed - no URL found
          addMessage("agent", `❌ **Build Failed**\n\nThe mind execution completed, but the application URL could not be found. This indicates the build process failed to generate a deployable application.`);
          setDeploymentStatus("failed");
          setIsProcessing(false);
        }
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

    const fetchSessionUrl = async (sessionId: string): Promise<boolean> => {
    try {
      console.log("🔍 Fetching session URL for sessionId:", sessionId);
      console.log("🔍 Project ID:", projectId);
      console.log("🔍 Project Name:", projectName);
      console.log("🔍 Mind Name:", project);
      
      // First try to get the specific session by sessionId
      const specificSession = await getSession(config.paramAiSdk.appBuilderMindId, "", sessionId);
      console.log("Specific session response:", specificSession);

      // Extract URL from the session output structure using the helper function
      const extractedUrl = extractUrlFromSession(specificSession.response);
      if (extractedUrl) {
        console.log("✅ Found URL using helper function:", extractedUrl);
      }

      if (extractedUrl) {
        console.log("✅ Successfully extracted URL:", extractedUrl);
        setSessionUrl(extractedUrl);
        
        // Also store the session ID if available
        if (specificSession.response._id) {
          setSessionId(specificSession.response._id);
          console.log("✅ Stored session ID from specific session:", specificSession.response._id);
        }
        
        addMessage("agent", `🎉 Your application is ready! You can now view it in the preview panel.`);
        return true;
      }

      // If no URL found in specific session, try to get all sessions and find by mind name
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

              if (projectSession) {
          // Try to extract URL from the project session output structure using the helper function
          const projectUrl = extractUrlFromSession(projectSession);
          if (projectUrl) {
            console.log("✅ Found URL in project session using helper function:", projectUrl);
          }
        
        if (projectUrl) {
          setSessionUrl(projectUrl);
          
          // Also store the session ID if available
          if (projectSession._id) {
            setSessionId(projectSession._id);
            console.log("✅ Stored session ID from project session:", projectSession._id);
            
            // Fetch the full session content with logs, args, and output
            try {
              console.log("🔍 Fetching full session content for project session ID:", projectSession._id);
              const fullSession = await getSession(
                config.paramAiSdk.appBuilderMindId,
                "",
                projectSession._id
              );
              console.log("Full project session content:", fullSession);
              
              if (fullSession?.response) {
                // Extract and display session information
                const sessionData = fullSession.response;
                console.log("Full project session data:", sessionData);
                
                // Use the helper function to display session information
                displaySessionInfo(sessionData, "Project Session");
              }
            } catch (sessionError) {
              console.error("Error fetching full project session content:", sessionError);
              addMessage("agent", `⚠️ **Note:** Found project session but couldn't retrieve full content.`);
            }
          }
          
          addMessage("agent", `🎉 Your application is ready! You can now view it in the preview panel.`);
          return true;
        } else {
          // Log the session structure to debug
          console.log("Project session structure:", projectSession);
          console.log("Project session output:", projectSession.output);
          
          // Only show message once, no retries
          if (!sessionUrl) {
            addMessage("agent", `✅ Build completed! However, the application URL could not be extracted from the session.`);
          }
        }
      } else {
        console.log("No project session found");
        
        // Only show message once, no retries
        if (!sessionUrl) {
          addMessage("agent", `✅ Build completed! However, no matching session was found.`);
        }
      }
      
      // If we reach here, no URL was found
      return false;
    } catch (error) {
      console.error("Failed to fetch session URL:", error);
      addMessage("agent", `✅ Build completed! However, there was an issue retrieving the application URL.`);
      return false;
    }
  };

  // Function to analyze app builder mind session logs and extract workflow information
  const analyzeSessionLogs = (logs: any[]) => {
    if (!logs || !Array.isArray(logs)) {
      return {
        error: "No logs available for analysis"
      };
    }

    // Initialize analysis structure
    const analysis = {
      totalLogs: logs.length,
      workflowSummary: {
        totalWorkflows: 0,
        completedWorkflows: 0,
        pendingWorkflows: 0,
        failedWorkflows: 0,
        progressPercentage: 0
      },
      workflowDetails: [] as any[],
      toolUsage: {
        totalTools: 0,
        successfulTools: 0,
        failedTools: 0,
        toolTypes: {} as Record<string, number>
      },
      executionPhases: {
        analysis: { status: 'pending', steps: 0, completed: 0 },
        setup: { status: 'pending', steps: 0, completed: 0 },
        implementation: { status: 'pending', steps: 0, completed: 0 },
        completion: { status: 'pending', steps: 0, completed: 0 }
      },
      errors: [] as string[],
      recommendations: [] as string[]
    };

    // Analyze each log entry
    logs.forEach((log, index) => {
      const message = log.message || '';
      const status = log.status || 'unknown';
      const timestamp = log.timestamp || '';

      // Detect workflow phases
      if (message.includes('[INFO]') && message.includes('Analyzing')) {
        analysis.executionPhases.analysis.status = 'in_progress';
        analysis.executionPhases.analysis.steps++;
        if (status === 'completed') {
          analysis.executionPhases.analysis.completed++;
        }
      }

      if (message.includes('[SEQUENCE]') || message.includes('[START]')) {
        analysis.executionPhases.setup.status = 'in_progress';
        analysis.executionPhases.setup.steps++;
        if (status === 'completed') {
          analysis.executionPhases.setup.completed++;
        }
      }

      if (message.includes('[TOOL_USE]')) {
        analysis.executionPhases.implementation.status = 'in_progress';
        analysis.executionPhases.implementation.steps++;
        if (status === 'completed') {
          analysis.executionPhases.implementation.completed++;
        }

        // Extract tool information
        analysis.toolUsage.totalTools++;
        const toolMatch = message.match(/Using Tool:`\s*`([^`]+)`/);
        if (toolMatch) {
          const toolName = toolMatch[1];
          analysis.toolUsage.toolTypes[toolName] = (analysis.toolUsage.toolTypes[toolName] || 0) + 1;
        }
      }

      if (message.includes('[TOOL_RESULT]')) {
        if (message.includes('✅') || message.includes('SUCCESS')) {
          analysis.toolUsage.successfulTools++;
        } else if (message.includes('❌') || message.includes('ERROR') || message.includes('File does not exist')) {
          analysis.toolUsage.failedTools++;
          analysis.errors.push(`Tool execution failed at step ${index + 1}: ${message.substring(0, 100)}...`);
        }
      }

      // Detect workflow completion
      if (message.includes('MODE 1') && message.includes('completed')) {
        analysis.workflowSummary.totalWorkflows++;
        analysis.workflowSummary.completedWorkflows++;
        analysis.workflowDetails.push({
          name: 'MODE 1: Initial Project Setup',
          status: 'completed',
          completionTime: timestamp,
          description: 'Project foundation and configuration setup'
        });
      }

      // Detect specific workflow implementations
      if (message.includes('Orders Workflow') || message.includes('Invoice Workflow') || message.includes('Payment Workflow')) {
        analysis.workflowSummary.totalWorkflows++;
        const workflowName = message.match(/(Orders|Invoice|Payment)\s+Workflow/)?.[1] || 'Unknown';
        
        if (status === 'completed') {
          analysis.workflowSummary.completedWorkflows++;
          analysis.workflowDetails.push({
            name: `${workflowName} Workflow`,
            status: 'completed',
            completionTime: timestamp,
            description: `${workflowName} workflow implementation completed`
          });
        } else if (status === 'pending' || status === 'in_progress') {
          analysis.workflowSummary.pendingWorkflows++;
          analysis.workflowDetails.push({
            name: `${workflowName} Workflow`,
            status: 'in_progress',
            startTime: timestamp,
            description: `${workflowName} workflow implementation in progress`
          });
        }
      }

      // Detect errors and issues
      if (message.includes('File does not exist') || message.includes('tool_use_error')) {
        analysis.errors.push(`File access error at step ${index + 1}: ${message.substring(0, 100)}...`);
      }

      if (message.includes('ERROR') || message.includes('FAILED')) {
        analysis.errors.push(`Execution error at step ${index + 1}: ${message.substring(0, 100)}...`);
      }
    });

    // Calculate progress percentages
    analysis.workflowSummary.progressPercentage = analysis.workflowSummary.totalWorkflows > 0 
      ? Math.round((analysis.workflowSummary.completedWorkflows / analysis.workflowSummary.totalWorkflows) * 100)
      : 0;

    // Update phase statuses based on completion
    Object.keys(analysis.executionPhases).forEach(phase => {
      const phaseData = analysis.executionPhases[phase as keyof typeof analysis.executionPhases];
      if (phaseData.steps > 0) {
        if (phaseData.completed === phaseData.steps) {
          phaseData.status = 'completed';
        } else if (phaseData.completed > 0) {
          phaseData.status = 'in_progress';
        }
      }
    });

    // Generate recommendations
    if (analysis.workflowSummary.pendingWorkflows > 0) {
      analysis.recommendations.push(`Continue with ${analysis.workflowSummary.pendingWorkflows} pending workflow(s)`);
    }

    if (analysis.toolUsage.failedTools > 0) {
      analysis.recommendations.push(`Review and fix ${analysis.toolUsage.failedTools} failed tool executions`);
    }

    if (analysis.errors.length > 0) {
      analysis.recommendations.push(`Address ${analysis.errors.length} identified errors for smooth execution`);
    }

    if (analysis.workflowSummary.progressPercentage >= 80) {
      analysis.recommendations.push('Excellent progress! Consider final testing and validation');
    }

    return analysis;
  };

  // Function to display workflow analysis in a formatted way
  const displayWorkflowAnalysis = (analysis: any) => {
    let analysisMessage = `📊 **Workflow Analysis Report**\n\n`;
    
    // Workflow Summary
    analysisMessage += `🎯 **Workflow Summary:**\n`;
    analysisMessage += `• Total Workflows: ${analysis.workflowSummary.totalWorkflows}\n`;
    analysisMessage += `• Completed: ${analysis.workflowSummary.completedWorkflows} ✅\n`;
    analysisMessage += `• Pending: ${analysis.workflowSummary.pendingWorkflows} ⏳\n`;
    analysisMessage += `• Failed: ${analysis.workflowSummary.failedWorkflows} ❌\n`;
    analysisMessage += `• Progress: ${analysis.workflowSummary.progressPercentage}% 📈\n\n`;

    // Execution Phases
    analysisMessage += `🚀 **Execution Phases:**\n`;
    Object.entries(analysis.executionPhases).forEach(([phase, data]: [string, any]) => {
      const statusIcon = data.status === 'completed' ? '✅' : data.status === 'in_progress' ? '⏳' : '⏸️';
      analysisMessage += `• ${phase.charAt(0).toUpperCase() + phase.slice(1)}: ${statusIcon} ${data.completed}/${data.steps} steps\n`;
    });
    analysisMessage += `\n`;

    // Tool Usage
    analysisMessage += `🛠️ **Tool Usage:**\n`;
    analysisMessage += `• Total Tools: ${analysis.toolUsage.totalTools}\n`;
    analysisMessage += `• Successful: ${analysis.toolUsage.successfulTools} ✅\n`;
    analysisMessage += `• Failed: ${analysis.toolUsage.failedTools} ❌\n\n`;

    // Workflow Details
    if (analysis.workflowDetails.length > 0) {
      analysisMessage += `📋 **Workflow Details:**\n`;
      analysis.workflowDetails.forEach((workflow: any, index: number) => {
        const statusIcon = workflow.status === 'completed' ? '✅' : '⏳';
        analysisMessage += `${index + 1}. ${statusIcon} **${workflow.name}**\n`;
        analysisMessage += `   Status: ${workflow.status}\n`;
        analysisMessage += `   ${workflow.status === 'completed' ? 'Completed' : 'Started'}: ${workflow.completionTime || workflow.startTime}\n`;
        analysisMessage += `   Description: ${workflow.description}\n\n`;
      });
    }

    // Errors (if any)
    if (analysis.errors.length > 0) {
      analysisMessage += `⚠️ **Identified Issues:**\n`;
      analysis.errors.slice(0, 5).forEach((error: string, index: number) => {
        analysisMessage += `${index + 1}. ${error}\n`;
      });
      if (analysis.errors.length > 5) {
        analysisMessage += `... and ${analysis.errors.length - 5} more issues\n`;
      }
      analysisMessage += `\n`;
    }

    // Recommendations
    if (analysis.recommendations.length > 0) {
      analysisMessage += `💡 **Recommendations:**\n`;
      analysis.recommendations.forEach((rec: string, index: number) => {
        analysisMessage += `${index + 1}. ${rec}\n`;
      });
    }

    return analysisMessage;
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const initialized = useRef(false); // New ref

  // Start app creation automatically when component mounts
  useEffect(() => {
    if (!initialized.current) { // Check if already initialized
      initialized.current = true; // Mark as initialized
      const initializeApp = async () => {
        const sessionExists = await checkExistingSessions();
        if (!sessionExists) {
          await createApplication(false); // Not a rebuild
        } 
        await fetchStateMachineWorkflows();
      };
      initializeApp();
    }
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
      const app_url = sessionUrl || "";
      
      return (
        <div className="h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">✅</span>
                <span className="font-semibold text-gray-800">
                  Application Ready
                </span>
              </div>
              {app_url && (
                <button
                  onClick={() => window.open(app_url, '_blank')}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
                >
                  <span>Preview</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 mt-1">
              {app_url 
                ? "Your application has been built successfully and is ready to use"
                : "Your application has been built successfully. Loading preview..."
              }
            </p>

          </div>

          <div className="h-full overflow-auto">
            <iframe
              src={app_url}
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
              disabled={isProcessing || isAgentTyping || currentlyBuildingWorkflow !== null}
              onClick={async () => {
                // Use the stored session ID if available, otherwise try to get it
                let existingSessionId = sessionId; // Use stored session ID first
                if (!existingSessionId && sessionUrl && project) {
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
                } else if (existingSessionId) {
                  console.log("🔍 Rebuild: Using stored session ID:", existingSessionId);
                } else {
                  console.log("⚠️ Rebuild: No session ID available");
                }
                
                // Add user message to chat first (same as workflow suggestions)
                addMessage("user", "Rebuild Application");
                
                // Add agent confirmation message
                addMessage("agent", "🔄 **Rebuild Selected:** Rebuild Application\n\nExecuting application rebuild...");
                
                setDeploymentStatus("idle");
                setLogs([]);
                // Don't clear sessionUrl during rebuild - keep it for reference
                
                // Pass the existing session ID for rebuilding
                createApplication(true, existingSessionId ?? undefined);
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
                {(isProcessing || deploymentStatus === "creating") && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-orange-600 font-medium">Chat disabled during build</span>
                  </div>
                )}
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
              <>
                {messages.map(renderMessage)}

              </>
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

            {/* Session Information and Actions */}
            {sessionId && (
              <div className="mt-4 py-4 px-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">📊</span>
                    <span className="text-sm font-medium text-gray-700">Session Information</span>
                  </div>
                  {/* <div className="flex gap-2">
                    <button
                      onClick={viewFullLogs}
                      className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-300 hover:border-green-300 hover:text-green-700 bg-white hover:bg-green-50 transition-all duration-200 cursor-pointer"
                    >
                      📝 View Logs
                    </button>
                    <button
                      onClick={viewOutputDetails}
                      className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-300 hover:border-purple-300 hover:text-purple-700 bg-white hover:bg-purple-50 transition-all duration-200 cursor-pointer"
                    >
                      📤 Output Details
                    </button>
                    <button
                      onClick={refreshSessionInfo}
                      className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-300 hover:border-blue-300 hover:text-blue-700 bg-white hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                    >
                      🔄 Refresh
                    </button>
                  </div> */}
                </div>
                
                <div className="text-xs text-gray-500 mb-2">
                  Session ID: <code className="bg-gray-100 px-1 py-0.5 rounded break-all">{sessionId}</code>
                </div>
                
                <div className="text-xs text-gray-500 mb-2">
                  App URL: {sessionUrl ? (
                    <a 
                      href={sessionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline cursor-pointer break-all"
                    >
                      {sessionUrl}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Not available</span>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 mb-2">
                  Session logs: <button 
                    onClick={() => {
                      if (!showLogs) {
                        // Fetch and display all logs
                        fetchAndDisplayAllLogs();
                      } else {
                        // Hide logs
                        hideLogs();
                      }
                      setShowLogs(!showLogs);
                    }}
                    className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    {showLogs ? 'Hide Logs' : 'View Logs'}
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 mb-2">
                  Workflow Analysis: <button 
                    onClick={() => {
                      if (!showWorkflowAnalysis) {
                        // Fetch and display workflow analysis
                        if (fullSessionData && fullSessionData.logs) {
                          const analysis = analyzeSessionLogs(fullSessionData.logs);
                          displayWorkflowAnalysisCard(analysis);
                        } else {
                          addMessage("agent", "⚠️ No session data available for workflow analysis. Please ensure logs are loaded first.");
                        }
                      } else {
                        // Hide workflow analysis
                        hideWorkflowAnalysis();
                      }
                    }}
                    className="text-green-600 hover:text-green-800 underline cursor-pointer"
                  >
                    {showWorkflowAnalysis ? 'Hide Analysis' : 'Analyze Workflows'}
                  </button>
                </div>
                
                {/* Workflow Analysis Card - appears below Analyze Workflows button when toggled on */}
                {showWorkflowAnalysis && workflowAnalysisData && (
                  <div className="mt-3 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-green-50 px-4 py-3 border-b border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">📊</span>
                          <span className="text-sm font-semibold text-green-800">Workflow Analysis Report</span>
                          <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full">
                            {workflowAnalysisData.workflowSummary.totalWorkflows} workflows
                          </span>
                        </div>
                        <span className="text-xs text-green-600">Click "Hide Analysis" above to close</span>
                      </div>
                    </div>
                    
                    {/* Analysis Content */}
                    <div className="max-h-96 overflow-y-auto p-4">
                      {/* Workflow Summary */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">🎯 Workflow Summary</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Total:</span>
                            <span className="ml-1 font-medium">{workflowAnalysisData.workflowSummary.totalWorkflows}</span>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <span className="text-green-600">Completed:</span>
                            <span className="ml-1 font-medium text-green-700">{workflowAnalysisData.workflowSummary.completedWorkflows} ✅</span>
                          </div>
                          <div className="bg-yellow-50 p-2 rounded">
                            <span className="text-yellow-600">Pending:</span>
                            <span className="ml-1 font-medium text-yellow-700">{workflowAnalysisData.workflowSummary.pendingWorkflows} ⏳</span>
                          </div>
                          <div className="bg-red-50 p-2 rounded">
                            <span className="text-red-600">Failed:</span>
                            <span className="ml-1 font-medium text-red-700">{workflowAnalysisData.workflowSummary.failedWorkflows} ❌</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Progress:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${workflowAnalysisData.workflowSummary.progressPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">{workflowAnalysisData.workflowSummary.progressPercentage}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Execution Phases */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">🚀 Execution Phases</h4>
                        <div className="space-y-2">
                          {Object.entries(workflowAnalysisData.executionPhases).map(([phase, data]: [string, any]) => {
                            const statusIcon = data.status === 'completed' ? '✅' : data.status === 'in_progress' ? '⏳' : '⏸️';
                            const statusColor = data.status === 'completed' ? 'text-green-600' : data.status === 'in_progress' ? 'text-yellow-600' : 'text-gray-500';
                            return (
                              <div key={phase} className="flex items-center justify-between text-xs">
                                <span className="capitalize">{phase}:</span>
                                <div className="flex items-center gap-2">
                                  <span className={statusColor}>{statusIcon}</span>
                                  <span className="text-gray-600">{data.completed}/{data.steps} steps</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tool Usage */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">🛠️ Tool Usage</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded text-center">
                            <div className="font-medium text-gray-800">{workflowAnalysisData.toolUsage.totalTools}</div>
                            <div className="text-gray-600">Total</div>
                          </div>
                          <div className="bg-green-50 p-2 rounded text-center">
                            <div className="font-medium text-green-700">{workflowAnalysisData.toolUsage.successfulTools} ✅</div>
                            <div className="text-green-600">Successful</div>
                          </div>
                          <div className="bg-red-50 p-2 rounded text-center">
                            <div className="font-medium text-red-700">{workflowAnalysisData.toolUsage.failedTools} ❌</div>
                            <div className="text-red-600">Failed</div>
                          </div>
                        </div>
                      </div>

                      {/* Workflow Details */}
                      {workflowAnalysisData.workflowDetails.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">📋 Workflow Details</h4>
                          <div className="space-y-2">
                            {workflowAnalysisData.workflowDetails.map((workflow: any, index: number) => {
                              const statusIcon = workflow.status === 'completed' ? '✅' : '⏳';
                              const statusColor = workflow.status === 'completed' ? 'text-green-600' : 'text-yellow-600';
                              return (
                                <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={statusColor}>{statusIcon}</span>
                                    <span className="font-medium">{workflow.name}</span>
                                  </div>
                                  <div className="text-gray-600 mb-1">Status: {workflow.status}</div>
                                  <div className="text-gray-600 mb-1">
                                    {workflow.status === 'completed' ? 'Completed' : 'Started'}: {workflow.completionTime || workflow.startTime}
                                  </div>
                                  <div className="text-gray-600">{workflow.description}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Errors (if any) */}
                      {workflowAnalysisData.errors.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-red-800 mb-2">⚠️ Identified Issues</h4>
                          <div className="space-y-1">
                            {workflowAnalysisData.errors.slice(0, 5).map((error: string, index: number) => (
                              <div key={index} className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
                                {index + 1}. {error}
                              </div>
                            ))}
                            {workflowAnalysisData.errors.length > 5 && (
                              <div className="text-xs text-red-600 text-center">
                                ... and {workflowAnalysisData.errors.length - 5} more issues
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      {workflowAnalysisData.recommendations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Recommendations</h4>
                          <div className="space-y-1">
                            {workflowAnalysisData.recommendations.map((rec: string, index: number) => (
                              <div key={index} className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-700">
                                {index + 1}. {rec}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* All Logs Card - appears below View Logs button when toggled on */}
                {showLogs && logsData && (
                  <div className="mt-3 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">📋</span>
                          <span className="text-sm font-semibold text-gray-800">All Session Logs</span>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                            {logsData.length} entries
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">Click "Hide Logs" above to close</span>
                      </div>
                    </div>
                    
                    {/* Logs Content */}
                    {logsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                        <p className="text-sm text-gray-600">Loading logs...</p>
                      </div>
                    ) : logsData.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-600">No logs available for this session.</p>
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {logsData.map((log, index) => (
                          <div key={index} className={`px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}>
                            {/* Log Header */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                Entry {index + 1}
                              </span>
                            </div>
                            
                            {/* Log Message */}
                            <div className="text-sm text-gray-800 leading-relaxed">
                              {formatLogMessage(log.message)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Workflow Suggestions */}
            {stateMachineWorkflows.length > 0 && (
              <div className="mt-4 py-4 px-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-600">🤖</span>
                  <span className="text-sm font-medium text-gray-700">AI Workflow Suggestions</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {stateMachineWorkflows.map((workflow, index) => {
                    const workflowText = workflow.toLowerCase().includes('workflow') ? workflow : `${workflow} workflow`;
                    const isCurrentlyBuilding = currentlyBuildingWorkflow === workflowText;
                    const isDisabled = currentlyBuildingWorkflow !== null || isProcessing || deploymentStatus === "creating" || isAgentTyping;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleWorkflowSelect(workflow)}
                        disabled={isDisabled}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
                          isCurrentlyBuilding
                            ? 'bg-yellow-100 border-yellow-300 text-yellow-700 animate-pulse'
                            : isDisabled
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-blue-50 text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-700 cursor-pointer'
                        }`}
                      >
                        {isCurrentlyBuilding ? (
                          <span className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 border border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                            Building...
                          </span>
                        ) : (
                          `Build ${workflowText}`
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  {isProcessing || deploymentStatus === "creating" || isAgentTyping || currentlyBuildingWorkflow !== null
                    ? "Workflow suggestions are disabled while a mind is executing. Please wait for the current operation to complete."
                    : "Click any suggestion to integrate the workflow into your application."
                  }
                </p>
              </div>
            )}
          </div>

          {/* Chat Input */}
          {(isProcessing || deploymentStatus === "creating") && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Application is building...</span>
                <span className="text-blue-600">Chat is temporarily disabled until build completes</span>
              </div>
            </div>
          )}
          <form onSubmit={handleUserMessage} className="p-4 border-t">
            <div className="flex flex-col gap-3">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={
                  isProcessing || isAgentTyping || deploymentStatus === "creating"
                    ? "Application is building... Please wait..."
                    : "Ask about your application build..."
                }
                className="flex-1 text-sm px-4 py-3 rounded-2xl border focus:border-blue-500 focus:outline-none placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 resize-none min-h-[80px] max-h-[200px] overflow-y-auto"
                disabled={isProcessing || isAgentTyping || deploymentStatus === "creating"}
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.shiftKey) {
                    // Allow Shift+Enter for new lines
                    return;
                  }
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (userInput.trim() && !isProcessing && !isAgentTyping && deploymentStatus !== "creating") {
                      handleUserMessage(e as any);
                    }
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Press Enter to send, Shift+Enter for new line
                </div>
                <Button
                  type="submit"
                  disabled={!userInput.trim() || isProcessing || isAgentTyping || deploymentStatus === "creating"}
                  variant="primary"
                  className="px-4 py-2 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Send</span>
                  <span className="sm:hidden">↗</span>
                </Button>
              </div>
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
