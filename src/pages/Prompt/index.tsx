import React, { useState } from "react";
import PromptContent from "./content";
import {
  executeMind,
  executeMindAndGetResults,
  getSession,
  streamSSE,
} from "../../services/paramai_browsersdk";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * TODO: Session Management for User Story Regeneration
 * 
 * Current Implementation:
 * - First generation: Creates new mind name and session ID
 * - Regeneration: Uses same mind name but creates NEW session ID
 * 
 * Future Improvement Needed:
 * - Implement session updating instead of session creation for regeneration
 * - This would require an updateSession API call in paramai_browsersdk
 * - Benefits: Same session ID, better tracking, reduced API calls
 * 
 * Current Workaround:
 * - Same mind name ensures consistency in naming convention
 * - Different session IDs are logged for debugging
 * - User experience remains consistent despite different sessions
 */

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
  const [project, setProject] = useState("");

  // New state for user story flow
  const [userStory, setUserStory] = useState<string>("");
  const [showUserStory, setShowUserStory] = useState(false);
  const [userStoryLoading, setUserStoryLoading] = useState(false);
  const [userStoryMindName, setUserStoryMindName] = useState<string>("");
  const [userStorySessionId, setUserStorySessionId] = useState<string>(""); // Store session ID for regeneration
  
  // New state for regeneration options
  const [showRegenerationOptions, setShowRegenerationOptions] = useState(false);
  const [regenerationType, setRegenerationType] = useState<"same" | "edit" | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>("");

  const userStoryMindId = "033e0168-bc64-4833-bc22-bd3e3992501a";

  // Debug: Monitor userStory state changes
  React.useEffect(() => {
    console.log("🔍 userStory state changed to:", userStory);
    console.log("🔍 userStory length:", userStory?.length);
    console.log("🔍 userStory type:", typeof userStory);
  }, [userStory]);

  const executeUserStoryMind = React.useCallback(
    async (userPrompt: string, previousUserStory?: string) => {
      if (!isAuthenticated) {
        return navigate("/login", { replace: true });
      }

      setUserStoryLoading(true);
      setShowUserStory(true);

      // For regeneration, include the previous user story context
      const finalPrompt = userPrompt;

      // Use existing mind name if regenerating, otherwise create new one
      let mindName = userStoryMindName;
      if (!mindName) {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        mindName = `US_${pad(now.getDate())}${pad(
          now.getMonth() + 1
        )}${now.getFullYear()}_${pad(now.getHours())}${pad(now.getMinutes())}`;
        setUserStoryMindName(mindName);
      }

      const responseStructure = {
        api: {},
        ui: {
          type: "tabs",
          tabs: [],
          content: {},
        },
      };

      const args = {
        user_query: finalPrompt,
        user_story: previousUserStory || "",
        files: [],
      };

      try {
        let response;
        
        // Check if we're regenerating and have an existing session ID
        if (userStorySessionId && previousUserStory) {
          console.log("🔄 Regenerating user story using existing session:", userStorySessionId);
          console.log("🔄 Using existing mind name:", mindName);
          console.log("🔄 Previous user story length:", previousUserStory?.length);
          
          // For regeneration, we'll create a new session but with the same mind name
          // This ensures the mind name is consistent, though the session ID will be different
          // In a future update, we could implement session updating if the API supports it
          response = await executeMind(
            mindName,
            args,
            responseStructure,
            userStoryMindId
          );
          
          console.log("🔄 New session created for regeneration with ID:", response.session_id);
          console.log("🔄 Note: This is a new session, not updating the existing one");
        } else {
          console.log("🆕 Creating new user story session");
          console.log("🆕 New mind name:", mindName);
          response = await executeMind(
            mindName,
            args,
            responseStructure,
            userStoryMindId
          );
        }
        
        const { job_id, session_id } = response;
        
        // Store the session ID for future regeneration
        if (!userStorySessionId) {
          setUserStorySessionId(session_id);
          console.log("💾 Stored new session ID for regeneration:", session_id);
        }

        // Start streaming logs from the event source
        try {
          await streamSSE(job_id, {});
          const mindResult = await getSession(userStoryMindId, "", session_id);
          
          // Debug: Log the entire response to see the structure
          console.log("🔍 Full mindResult:", JSON.stringify(mindResult, null, 2));
          console.log("🔍 Response path:", mindResult?.response);
          console.log("🔍 Output path:", mindResult?.response?.output);
          console.log("🔍 Content path:", mindResult?.response?.output?.content);
          console.log("🔍 UserStory path:", mindResult?.response?.output?.content?.UserStory);
          
          const userStory = mindResult?.response?.output?.content?.UserStory[0];
          console.log("🔍 Extracted userStory:", userStory);
          
          // More robust parsing - try different response structures
          let finalUserStory = "";
          if (userStory?.type === "markdown" && userStory?.content) {
            finalUserStory = userStory.content;
          } else if (userStory?.content) {
            // If no type specified, assume it's the content directly
            finalUserStory = userStory.content;
          } else if (typeof userStory === "string") {
            // If userStory is directly a string
            finalUserStory = userStory;
          } else {
            // Try alternative response paths
            const altPaths = [
              mindResult?.response?.UserStory?.[0]?.content,
              mindResult?.response?.UserStory?.[0],
              mindResult?.UserStory?.[0]?.content,
              mindResult?.UserStory?.[0],
              mindResult?.output?.UserStory?.[0]?.content,
              mindResult?.output?.UserStory?.[0],
              mindResult?.content?.UserStory?.[0]?.content,
              mindResult?.content?.UserStory?.[0],
              mindResult?.response?.output?.UserStory?.[0]?.content,
              mindResult?.response?.output?.UserStory?.[0],
            ];
            
            console.log("🔍 Trying alternative paths:", altPaths);
            
            for (const path of altPaths) {
              if (path && typeof path === "string") {
                finalUserStory = path;
                console.log("🔍 Found user story in alternative path:", path);
                break;
              }
            }
          }
          
          console.log("🔍 Final parsed user story:", finalUserStory);
          setUserStory(finalUserStory);
          
          // Reset regeneration state when user story is successfully generated
          setRegenerationType(null);
          setEditPrompt("");
          setShowRegenerationOptions(false);
          
        } catch (streamError) {
          console.error("User story stream error:", streamError);
        } finally {
          setUserStoryLoading(false);
        }
      } catch (error) {
        console.error("User story mind execution failed:", error);
        setUserStoryLoading(false);
      }
    },
    [isAuthenticated, navigate, userStorySessionId, userStoryMindName, userStoryMindId]
  );

  const handleSubmit = React.useCallback(async () => {
    console.log("🔍 handleSubmit called with userStory:", userStory);
    console.log("🔍 userStory type:", typeof userStory);
    console.log("🔍 userStory length:", userStory?.length);
    console.log("🔍 userStory truthy check:", !!userStory);
    
    if (!isAuthenticated) {
      return navigate("/login", { replace: true });
    }

    // If user story is not generated yet, execute user story mind first
    if (!userStory) {
      console.log("🔍 No user story found, executing user story mind first");
      await executeUserStoryMind(prompt);
      return;
    }

    console.log("🔍 Proceeding to build BRD with user story:", userStory);
    // Proceed to build BRD
    setLoading(true);
    if (!prompt.trim()) return;
    const name = prompt.trim();
    setBuilding(true);
    setBuildingAppName(name);
    setLogs([]);

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const mindName = `P_${pad(now.getDate())}${pad(
      now.getMonth() + 1
    )}${now.getFullYear()}_${pad(now.getHours())}${pad(now.getMinutes())}`;
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

    try {
      // Execute the mind and get job_id
      setProject(mindName);
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
            // Handle incoming stream data
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
  }, [prompt, userStory, executeUserStoryMind]);

  const handleSelectRecent = React.useCallback(
    (app: { id: string; name: string }) => {
      setPrompt(app.name);
    },
    []
  );

  const handleUserStoryEdit = React.useCallback(async () => {
    // Show regeneration options instead of directly regenerating
    setShowRegenerationOptions(true);
  }, []);

  const handleRegenerationOption = React.useCallback(async (type: "same" | "edit") => {
    setRegenerationType(type);
    
    if (type === "same") {
      // Regenerate with same prompt
      setShowRegenerationOptions(false);
      await executeUserStoryMind(prompt, userStory);
    } else if (type === "edit") {
      // Show edit prompt input
      setEditPrompt(prompt);
      setShowRegenerationOptions(false);
    }
  }, [executeUserStoryMind, prompt, userStory]);

  const handleEditPromptSubmit = React.useCallback(async () => {
    if (editPrompt.trim()) {
      // Immediately exit edit mode when regeneration starts
      setRegenerationType(null);
      setEditPrompt("");
      
      // Start the regeneration
      await executeUserStoryMind(editPrompt, userStory);
    }
  }, [executeUserStoryMind, editPrompt, userStory]);

  const handleCancelEdit = React.useCallback(() => {
    setEditPrompt("");
    setRegenerationType(null);
  }, []);

  const handleCloseRegenerationOptions = React.useCallback(() => {
    setShowRegenerationOptions(false);
  }, []);

  const handleProceedToBRD = React.useCallback(async () => {
    console.log("🔍 handleProceedToBRD called");
    console.log("🔍 Current userStory state:", userStory);
    console.log("🔍 Current showUserStory state:", showUserStory);
    
    // Proceed to BRD building
    setShowUserStory(false);
    console.log("🔍 Set showUserStory to false");
    
    // Add a small delay to ensure state updates are processed
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log("🔍 After delay - userStory state:", userStory);
    
    // This will trigger the BRD building process
    console.log("🔍 Calling handleSubmit for BRD generation");
    handleSubmit();
  }, [handleSubmit, userStory, showUserStory]);

  // Remove auto-execution - user will click button to generate story

  return (
    <div className="relative bg-white h-screen">
      {/* Animated background elements */}
      {/* <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-200 rounded-full filter blur-2xl opacity-40 animate-pulse"></div>
        <div
          className="absolute -bottom-10 -left-10 w-80 h-80 bg-purple-200 rounded-full filter blur-2xl opacity-40 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full filter blur-2xl opacity-40 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div> */}
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
        setStreamingCompleted={setStreamCompleted}
        ProjectId={project}
        // New user story props
        userStory={userStory}
        showUserStory={showUserStory}
        userStoryLoading={userStoryLoading}
        onUserStoryEdit={handleUserStoryEdit}
        onProceedToBRD={handleProceedToBRD}
        onGenerateStory={() => executeUserStoryMind(prompt)}
        // New regeneration props
        showRegenerationOptions={showRegenerationOptions}
        regenerationType={regenerationType}
        editPrompt={editPrompt}
        onRegenerationOption={handleRegenerationOption}
        onEditPromptSubmit={handleEditPromptSubmit}
        onCancelEdit={handleCancelEdit}
        onEditPromptChange={setEditPrompt}
        onCloseRegenerationOptions={handleCloseRegenerationOptions}
      />
    </div>
  );
};

export default Prompt;
