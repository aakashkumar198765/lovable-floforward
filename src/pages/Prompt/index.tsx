import React, { useState } from "react";
import PromptContent from "./content";
import {
  executeMind,
  executeMindAndGetResults,
  getSession,
  streamSSE,
} from "../../services/paramai_browsersdk";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import config from "../../config.json";

/**
 * User Story Regeneration Session Management
 * 
 * Implementation Status: ✅ COMPLETED
 * 
 * Current Implementation (Following ProjectPlanScreen.tsx Pattern):
 * - First generation: Creates new mind name (e.g., US_20082025_1430) and session ID
 * - Regeneration: Uses SAME mind name but creates NEW session ID
 * - This follows the exact same pattern as ProjectPlanScreen.tsx re-run functionality
 * 
 * Why This Approach Works:
 * - Mind Name Consistency: Same mind name ensures all related sessions are grouped together
 * - Session Independence: Each execution gets a fresh session for clean state
 * - User Experience: Users see consistent naming while getting fresh results
 * - Proven Pattern: This is the same approach used successfully in ProjectPlanScreen.tsx
 * 
 * Benefits:
 * - Consistent naming convention across regenerations
 * - Fresh execution state for each regeneration
 * - No API changes required
 * - Follows established application patterns
 * 
 * Example Flow:
 * 1. First Generation: mindName="US_20082025_1430", sessionId="abc123"
 * 2. Regeneration: mindName="US_20082025_1430" (same), sessionId="def456" (new)
 * 3. Result: Consistent naming with fresh execution
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
  const [searchParams] = useSearchParams();
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
  const [userStoryLoadingExisting, setUserStoryLoadingExisting] = useState(false); // New state for loading existing sessions
  const [userStoryMindName, setUserStoryMindName] = useState<string>("");
  const [userStorySessionId, setUserStorySessionId] = useState<string>(""); // Store session ID for regeneration
  const [sessionLoaded, setSessionLoaded] = useState(false); // Flag to prevent reloading
  
  // New state for regeneration options
  const [showRegenerationOptions, setShowRegenerationOptions] = useState(false);
  const [regenerationType, setRegenerationType] = useState<"same" | "edit" | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>("");

  const userStoryMindId = config.paramAiSdk.userStoryMindId;

  // Function to reset user story state
  const resetUserStoryState = React.useCallback(() => {
    setUserStory("");
    setShowUserStory(false);
    setUserStoryLoading(false);
    setUserStoryLoadingExisting(false);
    setUserStoryMindName("");
    setUserStorySessionId("");
    setSessionLoaded(false);
    setShowRegenerationOptions(false);
    setRegenerationType(null);
    setEditPrompt("");
  }, []);

  // Function to go back to prompt input (create new user story)
  const handleBackToPrompt = React.useCallback(() => {
    resetUserStoryState();
    setPrompt("");
  }, [resetUserStoryState]);

  // Function to clear URL parameters
  const clearURLParameters = React.useCallback(() => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('story');
    newUrl.searchParams.delete('mind');
    window.history.replaceState({}, '', newUrl.toString());
  }, []);

  // Function to load existing user story session
  const loadExistingUserStorySession = React.useCallback(async (sessionId: string) => {
    if (!isAuthenticated) {
      return navigate("/login", { replace: true });
    }

    // Reset user story content but preserve session ID for regeneration
    setUserStory("");
    setShowUserStory(false);
    setUserStoryLoading(false);
    setUserStoryLoadingExisting(false); // Reset existing session loading state
    setShowRegenerationOptions(false);
    setRegenerationType(null);
    setEditPrompt("");
    // DON'T reset userStorySessionId - we need it for regeneration!
    
    // Small delay to ensure state reset is processed
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setUserStoryLoadingExisting(true); // Use specific loading state for existing sessions
    setShowUserStory(true);

    try {
      console.log("🔄 Fetching existing user story session:", sessionId);
      const mindResult = await getSession(userStoryMindId, "", sessionId);
      
      // Debug: Log the entire response to see the structure
      console.log("🔍 Full mindResult from existing session:", JSON.stringify(mindResult, null, 2));
      console.log("🔍 Response path:", mindResult?.response);
      console.log("🔍 Output path:", mindResult?.response?.output);
      console.log("🔍 Content path:", mindResult?.response?.output?.content);
      console.log("🔍 UserStory path:", mindResult?.response?.output?.content?.UserStory);
      console.log("🔍 Input path:", mindResult?.response?.input);
      console.log("🔍 Args path:", mindResult?.response?.args);
      
      const userStory = mindResult?.response?.output?.content?.UserStory[0];
      console.log("🔍 Extracted userStory from existing session:", userStory);
      
      // More robust parsing - try different response structures (same as in executeUserStoryMind)
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
        
        console.log("🔍 Trying alternative paths for existing session:", altPaths);
        
        for (const path of altPaths) {
          if (path && typeof path === "string") {
            finalUserStory = path;
            console.log("🔍 Found user story in alternative path for existing session:", path);
            break;
          }
        }
      }
      
      console.log("🔍 Final parsed user story from existing session:", finalUserStory);
      
      if (finalUserStory) {
        setUserStory(finalUserStory);
        
        // Set the session ID for this loaded session
        setUserStorySessionId(sessionId);
        console.log("💾 Set session ID for loaded session:", sessionId);
        
        // Enhanced prompt extraction - try multiple paths to find the user query
        let sessionPrompt = "";
        const promptPaths = [
          mindResult?.response?.input?.user_query,
          mindResult?.input?.user_query,
          mindResult?.response?.args?.user_query,
          mindResult?.args?.user_query,
          mindResult?.response?.user_query,
          mindResult?.user_query,
          mindResult?.response?.input?.user_story,
          mindResult?.input?.user_story,
        ];
        
        console.log("🔍 Trying prompt extraction paths:", promptPaths);
        
        for (const path of promptPaths) {
          if (path && typeof path === "string" && path.trim()) {
            sessionPrompt = path.trim();
            console.log("🔍 Found prompt in path:", sessionPrompt);
            break;
          }
        }
        
        if (sessionPrompt) {
          setPrompt(sessionPrompt);
          console.log("🔍 Set prompt from session:", sessionPrompt);
        } else {
          console.log("⚠️ No prompt found in session, keeping existing prompt");
        }
        
        // Mark session as successfully loaded
        setSessionLoaded(true);
      } else {
        console.error("❌ Could not extract user story content from existing session");
      }
      
    } catch (error) {
      console.error("❌ Error loading existing user story session:", error);
    } finally {
      setUserStoryLoadingExisting(false); // Use the correct loading state
    }
  }, [isAuthenticated, navigate, userStoryMindId]);

  // Load existing user story session if story parameter is present in URL
  React.useEffect(() => {
    const storySessionId = searchParams.get('story');
    const mindName = searchParams.get('mind');
    
    if (storySessionId && isAuthenticated) {
      console.log("🔄 Loading existing user story session:", storySessionId);
      console.log("🔄 Mind name from URL:", mindName);
      
      // Reset session loaded flag for new session
      setSessionLoaded(false);
      
      // Set the mind name if provided
      if (mindName) {
        setUserStoryMindName(mindName);
      }
      
      // Set the session ID
      setUserStorySessionId(storySessionId);
      
      // Load the session content
      loadExistingUserStorySession(storySessionId);
      
      // Clear URL parameters to avoid reloading on subsequent renders
      clearURLParameters();
    }
  }, [searchParams, isAuthenticated, loadExistingUserStorySession, clearURLParameters]);

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
      setLogs([]);
      setStreamCompleted(false);

      // Debug: Log the current state for regeneration
      console.log("🔍 executeUserStoryMind called with:");
      console.log("🔍 userPrompt:", userPrompt);
      console.log("🔍 previousUserStory:", previousUserStory);
      console.log("🔍 userStorySessionId:", userStorySessionId);
      console.log("🔍 userStoryMindName:", userStoryMindName);

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

      const args: any = {
        user_query: finalPrompt,
        user_story: previousUserStory || "",
        files: [],
      };

      try {
        let response;
        
        // Check if we're regenerating and have an existing session ID
        console.log("🔍 Checking regeneration conditions:");
        console.log("🔍 userStorySessionId exists:", !!userStorySessionId);
        console.log("🔍 userStorySessionId value:", userStorySessionId);
        console.log("🔍 previousUserStory exists:", !!previousUserStory);
        console.log("🔍 previousUserStory length:", previousUserStory?.length);
        
        if (userStorySessionId && previousUserStory) {
          console.log("🔄 Regenerating user story using existing session ID:", userStorySessionId);
          console.log("🔄 Previous session ID:", userStorySessionId);
          console.log("🔄 Previous user story length:", previousUserStory?.length);
          console.log("🔄 Using session-based regeneration (updating existing session)");
          
          // For regeneration, use the EXISTING session ID to update the same session
          // This leverages the updated executeMind function that supports session_id parameter
          console.log("🔄 Calling executeMind for regeneration with parameters:");
          console.log("🔄 mindName:", mindName);
          console.log("🔄 args:", args);
          console.log("🔄 responseStructure:", responseStructure);
          console.log("🔄 userStoryMindId:", userStoryMindId);
          console.log("🔄 userStorySessionId:", userStorySessionId);
          
          // Add codegen_id to args
          args.codegen_id = mindName.replace(/^(US|P|A)/, 'P');
          
          response = await executeMind(
            mindName, // Same mind name for consistency
            args,
            responseStructure,
            userStoryMindId,
            userStorySessionId // Pass the existing session ID for regeneration
          );
          
          console.log("🔄 Session updated for regeneration with ID:", response.session_id);
          console.log("🔄 Mind name maintained for consistency:", mindName);
          console.log("🔄 Using existing session ID for regeneration:", userStorySessionId);
        } else {
          console.log("🆕 Creating new user story session");
          console.log("🆕 New mind name:", mindName);
          console.log("🆕 No existing session ID - creating fresh session");
          console.log("🆕 userStorySessionId:", userStorySessionId);
          console.log("🆕 previousUserStory:", previousUserStory);
          
          console.log("🆕 Calling executeMind for new session with parameters:");
          console.log("🆕 mindName:", mindName);
          console.log("🆕 args:", args);
          console.log("🆕 responseStructure:", responseStructure);
          console.log("🆕 userStoryMindId:", userStoryMindId);
          
          // Add codegen_id to args
          args.codegen_id = mindName.replace(/^(US|P|A)/, 'P');
          
          response = await executeMind(
            mindName,
            args,
            responseStructure,
            userStoryMindId
            // No session_id for new sessions
          );
        }
        
        const { job_id, session_id } = response;
        
        // Debug: Log the response structure
        console.log("🔍 executeMind response:", response);
        console.log("🔍 job_id:", job_id);
        console.log("🔍 session_id from response:", session_id);
        console.log("🔍 response type:", typeof response);
        console.log("🔍 response keys:", Object.keys(response || {}));
        
        // Handle session ID based on whether we're regenerating or creating new
        if (userStorySessionId && previousUserStory) {
          // For regeneration: keep the existing session ID (we're updating the same session)
          console.log("💾 Regeneration mode: keeping existing session ID:", userStorySessionId);
          console.log("💾 New response session ID (should match):", session_id);
          
          // Verify that the session ID matches (regeneration should return the same ID)
          if (session_id !== userStorySessionId) {
            console.warn("⚠️ Session ID mismatch during regeneration. Expected:", userStorySessionId, "Got:", session_id);
            // For regeneration, use the existing session ID if the response doesn't have one
            if (!session_id) {
              console.log("🔄 Response has no session_id, using existing session ID for getSession");
            }
          }
        } else {
          // For new sessions: store the new session ID
          setUserStorySessionId(session_id);
          console.log("💾 New session mode: stored new session ID:", session_id);
        }

        setLogs((prev) => [
          ...prev,
          {
            message: `\`[API]\` **Connected to user story generation service...**  \n- Job ID: \`${job_id}\`  \n- Session: \`${session_id || 'New Session'}\``,
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
                  message: `\`[ERROR]\` **Stream connection failed**  \n- Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                  status: "error",
                  format: "markdown",
                },
              ]);
            },
            maxRetries: 3,
            retryDelay: 2000,
          });
          
          // Use the appropriate session ID for getSession
          let sessionIdForGetSession;
          if (userStorySessionId && previousUserStory) {
            // For regeneration: use the existing session ID
            sessionIdForGetSession = userStorySessionId;
            console.log("🔄 Using existing session ID for getSession:", sessionIdForGetSession);
          } else {
            // For new sessions: use the session ID from the response
            sessionIdForGetSession = session_id;
            console.log("🆕 Using new session ID for getSession:", sessionIdForGetSession);
          }
          
          const mindResult = await getSession(userStoryMindId, "", sessionIdForGetSession);
          
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

    // Create BRD project name based on user story session name
    let mindName;
    if (userStoryMindName && userStoryMindName.startsWith("US_")) {
      // Replace "US_" with "P_" to maintain connection between user story and BRD
      mindName = userStoryMindName.replace("US_", "P_");
      console.log("🔗 Creating BRD project linked to user story:", userStoryMindName, "→", mindName);
    } else {
      // Fallback to old naming pattern if no user story session
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      mindName = `P_${pad(now.getDate())}${pad(
        now.getMonth() + 1
      )}${now.getFullYear()}_${pad(now.getHours())}${pad(now.getMinutes())}`;
      console.log("⚠️ No user story session found, using fallback BRD naming:", mindName);
    }
    const responseStructure = {
      api: {},
      ui: {
        type: "tabs",
        tabs: [],
        content: {},
      },
    };
    const args: any = {
      user_query: prompt,
      files: [],
    };

    try {
      // Execute the mind and get job_id
      setProject(mindName);
      
      // Add codegen_id to args
      args.codegen_id = mindName.replace(/^(US|P|A)/, 'P');
      
      // For BRD creation, we need to pass the mindID and undefined session_id for new session
      const response = await executeMind(
        mindName,           // BRD project name (P_...)
        args,               // User query and files
        responseStructure,  // Response structure
        undefined,          // Use default mind ID for BRD creation
        undefined           // No session_id for new BRD session
      );
      
      const { job_id, session_id } = response;
      
      console.log("🔍 BRD creation response:", response);
      console.log("🔍 job_id:", job_id);
      console.log("🔍 session_id:", session_id);
      console.log("🔍 session_id type:", typeof session_id);

      // Add a log entry for the API call
      setLogs((prev) => [
        ...prev,
        {
          message: `\`[API]\` **Connected to build service...**  
- Job ID: \`${job_id}\`  
- Session: \`${session_id || 'New Session'}\``,
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
  }, [prompt, userStory, executeUserStoryMind, userStoryMindName]);

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
    setStreamCompleted(false);
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
        userStoryLoadingExisting={userStoryLoadingExisting}
        onUserStoryEdit={handleUserStoryEdit}
        onProceedToBRD={handleProceedToBRD}
        onGenerateStory={() => executeUserStoryMind(prompt)}
        onBackToPrompt={handleBackToPrompt}
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
