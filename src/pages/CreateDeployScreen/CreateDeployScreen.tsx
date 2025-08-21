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

  const handleUserMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isAgentTyping) return;

    const message = userInput.trim();
    setUserInput("");

    addMessage("user", message);
    
    // Simple response for user messages
    setIsAgentTyping(true);
    setTimeout(() => {
      setIsAgentTyping(false);
      addMessage("agent", "I'm currently building your application. Once it's ready, you'll be able to interact with it in the preview panel.");
    }, 1000);
  };

  const handleBackToPrompt = () => {
    navigate(
      `/project-plan/${projectId || "default-id"}/${
        projectName || "default-project"
      }`
    );
  };

  const createApplication = async () => {
    setDeploymentStatus("creating");
    setMessages([]);
    setLogs([]);
    setIsProcessing(true);
    setSessionUrl(null);

    // Generate mind name based on project name format
    // Project format: "P_21082025_1429" -> Mind format: "A_21082025_1429"
    const mindName = projectName ? projectName.replace(/^P_/, 'A_') : `A_${Date.now()}`;
    
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
        message: `🚀 **Starting application build...**\n- Mind Name: \`${mindName}\`\n- Project: \`${projectName}\`\n- Project ID: \`${projectId}\``,
        status: "started",
        format: "markdown",
      };
      setLogs((prev) => [...prev, initialLog]);
      addLogMessage(initialLog);

      // Execute the mind using appBuilderMindId from config
      const response = await executeMind(mindName, args, responseStructure, config.paramAiSdk.appBuilderMindId);
      const { job_id, session_id } = response;

      // Add execution log
      const executionLog = {
        message: `⚡ **Build process initiated**\n- Job ID: \`${job_id}\`\n- Session: \`${session_id}\``,
        status: "pending",
        format: "markdown",
      };
      setLogs((prev) => [...prev, executionLog]);
      addLogMessage(executionLog);

      // Start streaming logs
      try {
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
              message: `✅ **Build completed successfully!**\n${message}`,
              status,
              format,
            };

            setLogs((prev) => [...prev, completionLog]);
            addLogMessage(completionLog);

            setDeploymentStatus("completed");
            setIsProcessing(false);

            // Try to fetch session URL once, then show iframe regardless
            addMessage("agent", "🔍 Searching for your application URL...");
            await fetchSessionUrl(session_id);
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
      const specificSession = await getSession("", "", sessionId);
      console.log("Specific session response:", specificSession);

      if (specificSession?.response?.url) {
        console.log("✅ Found URL in specific session:", specificSession.response.url);
        setSessionUrl(specificSession.response.url);
        addMessage("agent", `🎉 Your application is ready! You can now view it in the preview panel.`);
        return;
      }

      // If no URL in specific session, try to get all sessions and find by mind name
      const allSessions = await getSession();
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
    createApplication();
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
    if (deploymentStatus === "creating" || deploymentStatus === "idle") {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Building Your Application
            </h3>
            <p className="text-gray-600 mb-4">
              AI is creating your application from the project plan...
            </p>
            <div className="text-sm text-gray-500">
              This may take a few minutes
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
        return { text: "Building...", color: "bg-blue-100 text-blue-800" };
      case "completed":
        return { text: "Ready", color: "bg-green-100 text-green-800" };
      case "failed":
        return { text: "Failed", color: "bg-red-100 text-red-800" };
      default:
        return { text: "Ready", color: "bg-gray-100 text-gray-800" };
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
                "AI is building your application from the project plan"}
              {deploymentStatus === "completed" &&
                "Your application has been built and is ready to use"}
              {deploymentStatus === "failed" &&
                "Build failed - let's try again"}
              {deploymentStatus === "idle" &&
                "Preparing to build your application"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
                    ? "Building your application..."
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
