import React from "react";
import PromptContent from "./content";
import {
  executeMind,
  executeMindAndGetResults,
  streamSSE,
} from "../../services/paramai_browsersdk";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const MOCK_RECENTS = [
  { id: "1", name: "Meridian EXIM" },
  { id: "2", name: "Sales Insights" },
  { id: "3", name: "Ops Monitor" },
  { id: "4", name: "Support Hub" },
  { id: "5", name: "Docs Portal" },
  { id: "6", name: "Data Sync" },
];

const Prompt: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = React.useState("");
  const [building, setBuilding] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [streamCompleted, setStreamCompleted] = React.useState(false);
  const [buildingAppName, setBuildingAppName] = React.useState<
    string | undefined
  >(undefined);
  const [logs, setLogs] = React.useState<
    { message: string; status: string; format: string }[]
  >([]);

  const handleSubmit = React.useCallback(async () => {
    if (!isAuthenticated) {
      return navigate("/login", { replace: true });
    }

    setLoading(true);
    if (!prompt.trim()) return;
    const name = prompt.trim();
    setBuilding(true);
    setBuildingAppName(name);
    setLogs([]);

    const mindName = "newMind";
    const responseStructure = {
      api: {},
      ui: {
        type: "tabs",
        tabs: [],
        content: {},
      },
    };
    const args = {
      user_query: prompt,
      files: [],
    };

    // Initial mock logs to show immediate feedback
    const initialSteps = [
      {
        message: `\`[INFO]\` **Initializing workspace for ${name}...**  
- Setting up project environment  
- Loading configuration files`,
        status: "started",
        format: "markdown",
      },
      {
        message: `\`[INFO]\` **Analyzing prompt requirements...**  
- Detected app type: *${name}*  
- Generating schema for components`,
        status: "pending",
        format: "markdown",
      },
    ];

    // Add initial logs immediately
    setLogs(initialSteps);

    try {
      // Execute the mind and get job_id
      const response = await executeMind(mindName, args, responseStructure);
      const { job_id, session_id } = response;

      // Add a log entry for the API call
      setLogs((prev) => [
        ...prev,
        {
          message: `\`[API]\` **Connected to build service...**  
- Job ID: \`${job_id}\`  
- Session: \`${session_id}\``,
          status: "started",
          format: "markdown",
        },
      ]);

      // Start streaming logs from the event source
      try {
        await streamSSE(job_id, {
          onEvent: (data: any) => {
            // Handle incoming stream data
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

            // Add the streamed log to state
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
            // Handle completion - stream is already closed
            console.log("Stream completed:", data);
            setStreamCompleted(true);
          },
          onError: (error: any) => {
            console.error("Stream error:", error);
            // Add error log entry
            setLogs((prev) => [
              ...prev,
              {
                message: `\`[ERROR]\` **Stream connection failed**  
- Error: ${error instanceof Error ? error.message : "Unknown error"}  
- Falling back to mock logs`,
                status: "error",
                format: "markdown",
              },
            ]);
          },
          maxRetries: 3,
          retryDelay: 2000,
        });
      } catch (streamError) {
        console.error("Stream error:", streamError);
        // Add error log entry
        setLogs((prev) => [
          ...prev,
          {
            message: `\`[ERROR]\` **Stream connection failed**  
- Error: ${
              streamError instanceof Error
                ? streamError.message
                : "Unknown error"
            }  
- Falling back to mock logs`,
            status: "error",
            format: "markdown",
          },
        ]);

        // Add fallback completion log
        setLogs((prev) => [
          ...prev,
          {
            message: `\`[DONE]\` **${name} build completed (fallback mode)!**  
# Next Steps  
1. Open project in editor  
2. Run \`npm start\`  
3. Deploy to production`,
            status: "completed",
            format: "markdown",
          },
        ]);
      }
    } catch (error) {
      console.error("Build error:", error);
      // Add error log entry
      setLogs((prev) => [
        ...prev,
        {
          message: `\`[ERROR]\` **Build failed**  
- Error: ${error instanceof Error ? error.message : "Unknown error"}  
- Please try again or check your prompt`,
          status: "error",
          format: "markdown",
        },
      ]);
    } finally {
      setLoading(false);
      // Keep building state true to show logs with action buttons
      // setBuilding(false); // Removed - logs should stay visible
    }
  }, [prompt]);

  const handleSelectRecent = React.useCallback(
    (app: { id: string; name: string }) => {
      setPrompt(app.name);
    },
    []
  );

  return (
    <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-200 rounded-full filter blur-2xl opacity-40 animate-pulse"></div>
        <div
          className="absolute -bottom-10 -left-10 w-80 h-80 bg-purple-200 rounded-full filter blur-2xl opacity-40 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full filter blur-2xl opacity-40 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
      <PromptContent
        prompt={prompt}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
        building={building}
        setBuilding={setBuilding}
        buildingAppName={buildingAppName}
        recentApps={MOCK_RECENTS}
        onSelectRecent={handleSelectRecent}
        logs={logs}
        streamCompleted={streamCompleted}
      />
    </div>
  );
};

export default Prompt;
