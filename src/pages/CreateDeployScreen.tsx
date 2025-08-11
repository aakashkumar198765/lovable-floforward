import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FlexLayout } from "../components/atoms/layouts";
import { Button, LoadingState, Alert } from "../components/atoms";
import paramSDKService from "../services/ParamSDKService";
import appCreationService from "../services/AppCreationService";
import DemoApp from "../components/DemoApp";

interface ConversationMessage {
  id: string;
  type: "user" | "agent" | "system";
  content: string;
  timestamp: string;
  status?: "sending" | "sent" | "processing";
  suggestions?: string[];
}

const CreateDeployScreen: React.FC = () => {
  const navigate = useNavigate();
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "creating" | "created" | "deploying" | "deployed" | "failed">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [showLocalDemo, setShowLocalDemo] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addMessage = (type: ConversationMessage["type"], content: string, suggestions?: string[]) => {
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString(),
      status: type === "user" ? "sent" : undefined,
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateAgentResponse = (userMessage: string) => {
    setIsAgentTyping(true);
    
    setTimeout(() => {
      setIsAgentTyping(false);
      
      const lowerMessage = userMessage.toLowerCase();
      let response = "";
      let suggestions: string[] = [];

      if (lowerMessage.includes("color") || lowerMessage.includes("design") || lowerMessage.includes("style")) {
        response = "I can help you customize the design! What specific colors or styling would you like to change? I can modify the theme, colors, layout, or any visual elements.";
        suggestions = [
          "Change to dark theme",
          "Use blue color scheme",
          "Make it more modern",
          "Add animations"
        ];
      } else if (lowerMessage.includes("feature") || lowerMessage.includes("functionality") || lowerMessage.includes("add")) {
        response = "Great! I can add new features to your application. What functionality would you like to implement? I can add components, APIs, or any interactive elements.";
        suggestions = [
          "Add user authentication",
          "Include data visualization",
          "Add search functionality",
          "Implement notifications"
        ];
      } else if (lowerMessage.includes("deploy") || lowerMessage.includes("live")) {
        response = "Your application is ready for deployment! I can deploy it to various platforms or help you configure the deployment settings. Would you like to proceed?";
        suggestions = [
          "Deploy to Vercel",
          "Configure custom domain",
          "Set up environment variables",
          "Enable analytics"
        ];
      } else if (lowerMessage.includes("bug") || lowerMessage.includes("fix") || lowerMessage.includes("error")) {
        response = "I'll help you identify and fix any issues. Can you describe what's not working as expected? I can analyze the code and provide solutions.";
        suggestions = [
          "Check console errors",
          "Review component logic",
          "Validate API calls",
          "Test responsive design"
        ];
      } else {
        response = "I'm here to help you build and customize your application! I can assist with design changes, adding features, fixing issues, or deploying your app. What would you like to work on?";
        suggestions = [
          "Customize the design",
          "Add new features",
          "Fix any issues",
          "Deploy the application"
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

  const createApplication = async () => {
    setDeploymentStatus("creating");
    setMessages([]);
    setDeploymentProgress(0);
    setIsProcessing(true);

    // Welcome message
    addMessage("agent", "👋 Hi! I'm your AI development assistant. I'm starting to create your application based on your project plan. Let me walk you through the process!", [
      "What features are you adding?",
      "Can I customize the design?",
      "How long will this take?"
    ]);

    try {
      // Simulate application creation with conversational updates
      const steps = [
        "🔍 Analyzing your project requirements and specifications...",
        "⚙️ Setting up the React application structure...",
        "🧩 Generating components based on your workflow...",
        "🎨 Applying styling and UI components...",
        "🔗 Setting up routing and navigation...",
        "📦 Configuring dependencies and build tools...",
        "✅ Application created successfully! Ready for preview."
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        addMessage("system", steps[i]);
        setDeploymentProgress(((i + 1) / steps.length) * 100);
      }

      setDeploymentStatus("created");
      setIsProcessing(false);
      
      addMessage("agent", "🎉 Your application has been created successfully! You can now preview it on the right. Would you like to make any changes to the design, add features, or deploy it?", [
        "Change the color scheme",
        "Add more features",
        "Deploy to production",
        "Modify the layout"
      ]);
      
    } catch (error) {
      console.error("App creation failed:", error);
      addMessage("agent", `❌ Oops! Something went wrong during creation: ${error}. Let me try again or we can troubleshoot this together.`, [
        "Try again",
        "Check the logs",
        "Contact support"
      ]);
      setDeploymentStatus("failed");
      setIsProcessing(false);
    }
  };

  const deployApplication = async () => {
    setDeploymentStatus("deploying");
    setDeploymentProgress(0);
    setIsProcessing(true);

    addMessage("agent", "🚀 Great! Let's deploy your application to make it live. I'll handle the build and deployment process for you.", [
      "Configure custom domain",
      "Set up analytics",
      "Enable performance monitoring"
    ]);

    try {
      const deploySteps = [
        "📦 Building your application for production...",
        "🔧 Optimizing assets and bundle size...",
        "☁️ Uploading to cloud infrastructure...",
        "🌐 Configuring domain and SSL...",
        "✅ Deployment successful! Your app is now live."
      ];

      for (let i = 0; i < deploySteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        addMessage("system", deploySteps[i]);
        setDeploymentProgress(((i + 1) / deploySteps.length) * 100);
      }

      setPreviewUrl("https://your-app.vercel.app");
      setDeploymentStatus("deployed");
      setShowLocalDemo(true);
      setIsProcessing(false);
      
      addMessage("agent", "🎊 Congratulations! Your application is now live and accessible to users worldwide. You can continue to make updates, and I'll help you deploy new versions.", [
        "View live application",
        "Make design changes",
        "Add new features",
        "Monitor performance"
      ]);
      
    } catch (error) {
      console.error("Deployment failed:", error);
      addMessage("agent", `❌ Deployment encountered an issue: ${error}. Don't worry, we can fix this together!`, [
        "Retry deployment",
        "Check build logs",
        "Use different platform"
      ]);
      setDeploymentStatus("failed");
      setIsProcessing(false);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
          {!isUser && (
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
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
          
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : isSystem
                ? 'bg-gray-800 text-gray-300 border border-gray-700'
                : 'bg-gray-800 text-white border border-gray-700'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            
            {isUser && (
              <div className="flex justify-end mt-1">
                <span className="text-xs text-blue-200">{message.timestamp}</span>
              </div>
            )}
          </div>
          
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full border border-gray-600 transition-colors"
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
    if (deploymentStatus === "creating" || deploymentStatus === "deploying") {
      const isCreating = deploymentStatus === "creating";
      return (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isCreating ? "Creating Your Application" : "Deploying Your Application"}
            </h3>
            <p className="text-gray-600 mb-4">
              {isCreating 
                ? "Generating your React application from the project plan..." 
                : "Building and deploying your application to the cloud..."
              }
            </p>
            <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${deploymentProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{deploymentProgress}% Complete</p>
          </div>
        </div>
      );
    }

    if (deploymentStatus === "created") {
      return (
        <div className="h-full">
          <div className="p-4 border-b bg-blue-50">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">👀</span>
              <span className="font-semibold text-blue-800">Application Preview</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">Review your generated application before deployment</p>
          </div>
          
          <div className="h-full overflow-auto">
            <DemoApp />
          </div>
        </div>
      );
    }

    if (deploymentStatus === "deployed") {
      return (
        <div className="h-full">
          <div className="p-4 border-b bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span className="font-semibold text-green-800">Application Deployed Successfully!</span>
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
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Open Live App ↗
                  </a>
                )}
              </div>
            </div>
            <p className="text-sm text-green-700 mt-1">
              {previewUrl ? `Your application is live at: ${previewUrl}` : "Your application has been deployed successfully!"}
            </p>
          </div>
          
          <div className="h-full overflow-auto">
            {showLocalDemo ? (
              <DemoApp />
            ) : previewUrl ? (
              <iframe 
                src={previewUrl} 
                className="w-full h-full border-0"
                title="Application Preview"
                onLoad={() => console.log("Preview loaded successfully")}
                onError={() => console.error("Failed to load preview")}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Deployment Complete!</h3>
                  <p className="text-gray-600">Your application has been successfully deployed.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (deploymentStatus === "failed") {
      return (
        <div className="h-full flex items-center justify-center bg-red-50">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Process Failed</h3>
            <p className="text-red-600 mb-4">There was an error during the process.</p>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Create</h3>
          <p className="text-gray-600">Your application will be created from the project plan.</p>
        </div>
      </div>
    );
  };

  const getStatusDisplay = () => {
    switch (deploymentStatus) {
      case "creating": return { text: "Creating...", color: "bg-blue-100 text-blue-800" };
      case "created": return { text: "Created", color: "bg-green-100 text-green-800" };
      case "deploying": return { text: "Deploying...", color: "bg-blue-100 text-blue-800" };
      case "deployed": return { text: "Deployed", color: "bg-green-100 text-green-800" };
      case "failed": return { text: "Failed", color: "bg-red-100 text-red-800" };
      default: return { text: "Ready", color: "bg-gray-100 text-gray-800" };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/project-plan")}
          >
            ← Back to Project
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Create & Deploy Application</h1>
            <p className="text-sm text-gray-600">
              {deploymentStatus === "creating" && "AI Assistant is creating your application"}
              {deploymentStatus === "created" && "Application ready - chat with AI to customize or deploy"}
              {deploymentStatus === "deploying" && "AI Assistant is deploying your application"}
              {deploymentStatus === "deployed" && "Your application is live - continue chatting for updates"}
              {deploymentStatus === "failed" && "Let's troubleshoot this together"}
              {deploymentStatus === "idle" && "AI Assistant will guide you through the process"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}>
            {statusDisplay.text}
          </div>
          {deploymentStatus === "created" && (
            <Button
              variant="primary"
              size="sm"
              onClick={deployApplication}
              className="bg-blue-600 hover:bg-blue-700"
            >
              🚀 Deploy Application
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversational Chat Panel */}
        <div className="w-2/5 bg-gray-900 flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-sm text-white font-bold">🤖</span>
              </div>
              <div>
                <h2 className="text-white font-semibold">AI Development Assistant</h2>
                <p className="text-gray-400 text-xs">
                  {isProcessing ? "Building your application..." : "Ready to help customize your app"}
                </p>
              </div>
              {isProcessing && (
                <div className="ml-auto">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">🤖</span>
                    </div>
                    <span className="text-xs text-gray-400">AI Assistant</span>
                  </div>
                  <div className="bg-gray-800 text-white border border-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Thinking</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <form onSubmit={handleUserMessage} className="p-4 border-t border-gray-700">
            <div className="flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask me to customize design, add features, or deploy..."
                className="flex-1 bg-gray-800 text-white text-sm px-4 py-3 rounded-2xl border border-gray-600 focus:border-blue-500 focus:outline-none placeholder-gray-400"
                disabled={isAgentTyping}
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isAgentTyping}
                className="px-4 py-3 bg-blue-600 text-white text-sm rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">Send</span>
                <span className="sm:hidden">↗</span>
              </button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        <div className="w-3/5 bg-white flex flex-col h-full">
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
          
          <div className="flex-1 overflow-hidden">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDeployScreen; 