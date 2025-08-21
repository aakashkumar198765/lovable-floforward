import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FlexLayout } from "../../components/atoms/layouts";
import { Button, LoadingState, Alert } from "../../components/atoms";
import paramSDKService from "../../services/ParamSDKService";
import appCreationService from "../../services/AppCreationService";
import DemoApp from "../../components/DemoApp";
import { executeMind, streamSSE } from "../../services/paramai_browsersdk";
import Logs from "./Logs";

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
    "idle" | "creating" | "created" | "deploying" | "deployed" | "failed"
  >("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    "https://www.paramai.studio/"
  );
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [showLocalDemo, setShowLocalDemo] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [streamCompleted, setStreamCompleted] = useState(false);
  const [project, setProject] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const simulateAgentResponse = (userMessage: string) => {
    setIsAgentTyping(true);

    setTimeout(() => {
      setIsAgentTyping(false);

      const lowerMessage = userMessage.toLowerCase();
      let response = "";
      let suggestions: string[] = [];

      if (
        lowerMessage.includes("color") ||
        lowerMessage.includes("design") ||
        lowerMessage.includes("style")
      ) {
        response =
          "I can help you customize the design! What specific colors or styling would you like to change? I can modify the theme, colors, layout, or any visual elements.";
        suggestions = [
          "Change to dark theme",
          "Use blue color scheme",
          "Make it more modern",
          "Add animations",
        ];
      } else if (
        lowerMessage.includes("feature") ||
        lowerMessage.includes("functionality") ||
        lowerMessage.includes("add")
      ) {
        response =
          "Great! I can add new features to your application. What functionality would you like to implement? I can add components, APIs, or any interactive elements.";
        suggestions = [
          "Add user authentication",
          "Include data visualization",
          "Add search functionality",
          "Implement notifications",
        ];
      } else if (
        lowerMessage.includes("deploy") ||
        lowerMessage.includes("live")
      ) {
        response =
          "Your application is ready for deployment! I can deploy it to various platforms or help you configure the deployment settings. Would you like to proceed?";
        suggestions = [
          "Deploy to Vercel",
          "Configure custom domain",
          "Set up environment variables",
          "Enable analytics",
        ];
      } else if (
        lowerMessage.includes("bug") ||
        lowerMessage.includes("fix") ||
        lowerMessage.includes("error")
      ) {
        response =
          "I'll help you identify and fix any issues. Can you describe what's not working as expected? I can analyze the code and provide solutions.";
        suggestions = [
          "Check console errors",
          "Review component logic",
          "Validate API calls",
          "Test responsive design",
        ];
      } else {
        response =
          "I'm here to help you build and customize your application! I can assist with design changes, adding features, fixing issues, or deploying your app. What would you like to work on?";
        suggestions = [
          "Customize the design",
          "Add new features",
          "Fix any issues",
          "Deploy the application",
        ];
      }

      addMessage("agent", response, suggestions);
    }, 1000 + Math.random() * 2000);
  };

  const handleUserMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isAgentTyping) return;

    const message = userInput.trim();
    setUserInput("");

    addMessage("user", message);
    simulateAgentResponse(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    addMessage("user", suggestion);
    simulateAgentResponse(suggestion);
  };

  const handleBackToPrompt = () => {
    navigate(
      `/project-plan/${projectId || "default-id"}/${
        projectName || "default-project"
      }`
    );
  };

  const handleViewOutput = () => {
    setDeploymentStatus("created");
  };

  const createApplication = async () => {
    setDeploymentStatus("creating");
    setMessages([]);
    setLogs([]);
    setDeploymentProgress(0);
    setIsProcessing(true);

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const mindName = `CD_${pad(now.getDate())}${pad(
      now.getMonth() + 1
    )}${now.getFullYear()}_${pad(now.getHours())}${pad(now.getMinutes())}`;

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
      setLogs((prev) => [
        ...prev,
        {
          message: `\`[API]\` **Connected to build service...**  
- Job ID: \`${mindName}\`  
- Project: \`${projectName}\``,
          status: "started",
          format: "markdown",
        },
      ]);

      // Execute the mind
      const response = await executeMind(mindName, args, responseStructure);
      const { job_id, session_id } = response;

      // Add execution log
      setLogs((prev) => [
        ...prev,
        {
          message: `\`[EXECUTE]\` **Mind execution started**  
- Job ID: \`${job_id}\`  
- Session: \`${session_id}\``,
          status: "pending",
          format: "markdown",
        },
      ]);

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

            setLogs((prev) => [
              ...prev,
              {
                message: `\`[STREAM]\` ${message}`,
                status,
                format,
              },
            ]);
          },
          onComplete: (data: any) => {
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

            setLogs((prev) => [
              ...prev,
              {
                message: `\`[STREAM]\` ${message}`,
                status,
                format,
              },
            ]);

            setDeploymentStatus("created");
            setIsProcessing(false);
          },
          onError: (error: any) => {
            console.error("Stream error:", error);
            setLogs((prev) => [
              ...prev,
              {
                message: `\`[ERROR]\` **Stream connection failed**  
- Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                status: "error",
                format: "markdown",
              },
            ]);
            setDeploymentStatus("failed");
            setIsProcessing(false);
          },
          maxRetries: 3,
          retryDelay: 2000,
        });
      } catch (streamError) {
        console.error("Stream error:", streamError);
        setLogs((prev) => [
          ...prev,
          {
            message: `\`[ERROR]\` **Stream connection failed**  
- Error: ${
              streamError instanceof Error
                ? streamError.message
                : "Unknown error"
            }`,
            status: "error",
            format: "markdown",
          },
        ]);
        setDeploymentStatus("failed");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("App creation failed:", error);
      setLogs((prev) => [
        ...prev,
        {
          message: `\`[ERROR]\` **Build failed**  
- Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          status: "error",
          format: "markdown",
        },
      ]);
      setDeploymentStatus("failed");
      setIsProcessing(false);
    }
  };

  const deployApplication = async () => {
    setDeploymentStatus("deploying");
    setDeploymentProgress(0);
    setIsProcessing(true);

    addMessage(
      "agent",
      "🚀 Great! Let's deploy your application to make it live. I'll handle the build and deployment process for you.",
      [
        "Configure custom domain",
        "Set up analytics",
        "Enable performance monitoring",
      ]
    );

    try {
      const deploySteps = [
        "📦 Building your application for production...",
        "🔧 Optimizing assets and bundle size...",
        "☁️ Uploading to cloud infrastructure...",
        "🌐 Configuring domain and SSL...",
        "✅ Deployment successful! Your app is now live.",
      ];

      for (let i = 0; i < deploySteps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        addMessage("system", deploySteps[i]);
        setDeploymentProgress(((i + 1) / deploySteps.length) * 100);
      }

      setPreviewUrl("https://your-app.vercel.app");
      setDeploymentStatus("deployed");
      setShowLocalDemo(true);
      setIsProcessing(false);

      addMessage(
        "agent",
        "🎊 Congratulations! Your application is now live and accessible to users worldwide. You can continue to make updates, and I'll help you deploy new versions.",
        [
          "View live application",
          "Make design changes",
          "Add new features",
          "Monitor performance",
        ]
      );
    } catch (error) {
      console.error("Deployment failed:", error);
      addMessage(
        "agent",
        `❌ Deployment encountered an issue: ${error}. Don't worry, we can fix this together!`,
        ["Retry deployment", "Check build logs", "Use different platform"]
      );
      setDeploymentStatus("failed");
      setIsProcessing(false);
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

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
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

          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full border border-gray-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    if (deploymentStatus === "creating") {
      return (
        <Logs
          logs={logs}
          onBackToPrompt={handleBackToPrompt}
          onViewOutput={handleViewOutput}
          streamCompleted={streamCompleted}
          setStreamingCompleted={setStreamCompleted}
        />
      );
    }

    if (deploymentStatus === "deploying") {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Deploying Your Application
            </h3>
            <p className="text-gray-600 mb-4">
              Building and deploying your application to the cloud...
            </p>
            <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
              <div
                className="bg-gray-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${deploymentProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {deploymentProgress}% Complete
            </p>
          </div>
        </div>
      );
    }

    if (deploymentStatus === "created") {
      return (
        <div className="h-full">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">👀</span>
              <span className="font-semibold text-gray-800">
                Application Preview
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              Review your generated application before deployment
            </p>
          </div>

          <div className="h-full overflow-auto">
            {/* <DemoApp /> */}
            <iframe
              src={previewUrl || "https://www.paramai.studio"}
              className="w-full h-full border-0"
              title="Application Preview"
              onLoad={() => console.log("Preview loaded successfully")}
              onError={() => console.error("Failed to load preview")}
            />
          </div>
        </div>
      );
    }

    if (deploymentStatus === "deployed") {
      return (
        <div className="h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">✅</span>
                <span className="font-semibold text-gray-800">
                  Application Deployed Successfully!
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={showLocalDemo ? "outline" : "primary"}
                  onClick={() => setShowLocalDemo(!showLocalDemo)}
                >
                  {showLocalDemo ? "Show External" : "Show Demo"}
                </Button>
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Open Live App ↗
                  </a>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              {previewUrl
                ? `Your application is live at: ${previewUrl}`
                : "Your application has been deployed successfully!"}
            </p>
          </div>

          <div className="h-full overflow-auto">
            {false ? (
              <DemoApp />
            ) : true ? (
              <iframe
                src={previewUrl || "https://www.paramai.studio"}
                className="w-full h-full border-0"
                title="Application Preview"
                onLoad={() => console.log("Preview loaded successfully")}
                onError={() => console.error("Failed to load preview")}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Deployment Complete!
                  </h3>
                  <p className="text-gray-600">
                    Your application has been successfully deployed.
                  </p>
                </div>
              </div>
            )}
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
              Process Failed
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error during the process.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setDeploymentStatus("idle");
                setShowLocalDemo(false);
                createApplication();
              }}
            >
              Retry
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
            Ready to Create
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
        return { text: "Creating...", color: "bg-gray-100 text-gray-800" };
      case "created":
        return { text: "Created", color: "bg-gray-100 text-gray-800" };
      case "deploying":
        return { text: "Deploying...", color: "bg-gray-100 text-gray-800" };
      case "deployed":
        return { text: "Deployed", color: "bg-gray-100 text-gray-800" };
      case "failed":
        return { text: "Failed", color: "bg-gray-100 text-gray-800" };
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
              Create & Deploy Application
            </h1>
            <p className="text-sm text-gray-600">
              {deploymentStatus === "creating" &&
                "AI Assistant is creating your application"}
              {deploymentStatus === "created" &&
                "Application ready - chat with AI to customize or deploy"}
              {deploymentStatus === "deploying" &&
                "AI Assistant is deploying your application"}
              {deploymentStatus === "deployed" &&
                "Your application is live - continue chatting for updates"}
              {deploymentStatus === "failed" &&
                "Let's troubleshoot this together"}
              {deploymentStatus === "idle" &&
                "AI Assistant will guide you through the process"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}
          >
            {statusDisplay.text}
          </div>
          {deploymentStatus === "created" && (
            <Button
              variant="primary"
              size="sm"
              onClick={deployApplication}
              className=""
            >
              Deploy Application
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversational Chat Panel */}
        <div className="w-2/5  flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-5 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-sm text-white font-bold">🤖</span>
              </div>
              <div>
                <h2 className=" font-semibold">AI Development Assistant</h2>
                <p className="text-gray-400 text-xs">
                  {isProcessing
                    ? "Building your application..."
                    : "Ready to help customize your app"}
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
                <p className="text-sm">AI Assistant is initializing...</p>
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
                    <span className="text-xs text-gray-400">AI Assistant</span>
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
          <form onSubmit={handleUserMessage} className="p-4 border-t ">
            <div className="flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask me to customize design, add features, or deploy..."
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
          {/* <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Application Preview</h2>
            <p className="text-gray-600 text-sm mt-1">
              {deploymentStatus === "creating" && "Creating your application..."}
              {deploymentStatus === "created" && "Preview your generated application"}
              {deploymentStatus === "deploying" && "Deploying your application..."}
              {deploymentStatus === "deployed" && "Your live application"}
              {deploymentStatus === "failed" && "Process failed"}
              {deploymentStatus === "idle" && "Preview will appear after creation"}
            </p>
          </div> */}

          <div className="flex-1 overflow-hidden">{renderPreview()}</div>
        </div>
      </div>
    </div>
  );
};

export default CreateDeployScreen;
