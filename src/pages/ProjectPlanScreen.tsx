import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ChatPage from "./Chatpage";
import { FlexLayout } from "../components/atoms/layouts";
import { Tab } from "../components/atoms/navigation";
import { Button } from "../components/atoms/form";
import MarkdownRenderer from "../utils/MarkdownRenderer";
import { testMarkdown } from "./sample_data/brd";
import AIConfiguration from "./AIConfiguration";
import WorkflowPreview from "./WorkflowPreview";
import JsonPreview from "./JsonPreview";
import { FlowEdge, FlowNode, StateMachine, SubState } from "../types";
import { stateMachineExampleDummyData } from "../utils/stateMachine";
import stateMachinesJson from "../pages/sample_data/statemachines.json";
import {
  executeMind,
  getSession,
  streamSSE,
} from "../services/paramai_browsersdk";
import ValidUtils from "../utils/ValidUtils";
import { LoadingState, Spinner, Icon } from "../components";
import config from "../config.json";

const nodeColor = (node: any) => {
  // First check if node has style with backgroundColor
  if (node.style?.backgroundColor) {
    return node.style.backgroundColor;
  }

  // Fallback based on node ID patterns to match the actual flow structure
  if (node.id === "project-plan-node") {
    return "#3b82f6"; // Blue for project plan root
  }

  if (node.id.includes("-node") && !node.id.includes("project-plan")) {
    return "#f59e0b"; // Yellow/amber for workflow nodes
  }

  if (node.id.includes("-") && !node.id.includes("-node")) {
    // Check if it's a substate (has multiple dashes indicating deeper nesting)
    const parts = node.id.split("-");
    if (parts.length > 2) {
      return "#ec4899"; // Pink for substates
    } else {
      return "#16a34a"; // Green for states
    }
  }

  // Default fallback
  return "#f1f5f9";
};

// Use config for mind IDs instead of hardcoded values
const mindsConfig = {
  schemaAnalysis: config.paramAiSdk.schemaMindId,
  jsonOutput: config.paramAiSdk.stateMachineMindId,
  syntheticData: config.paramAiSdk.syntheticDataMindId,
};

const ProjectPlanScreen: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, projectName } = useParams<{
    projectId: string;
    projectName: string;
  }>();
  const [activeProjectTab, setActiveProjectTab] = useState("brd");
  const [selectedVersion, setSelectedVersion] = useState("1.0");
  const [loading, setLoading] = useState(false);
  const [Brd, setBrd]: any = useState({});
  const [schemaWorkflow, setSchemaWorkflow]: any = useState({});
  const [plan, setPlan]: any = useState({});
  const [preview, setPreview]: any = useState({});
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showSchemaPanel, setShowSchemaPanel] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const mindSessions = await getSession();
        const session = mindSessions?.response?.find(
          (el: any) => el?.name === projectId
        );
        const brdResponse = await getSession("", "", session?._id);
        console.log(brdResponse);

        setBrd(brdResponse?.response || {});
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [projectId]);

  useEffect(() => {
    const getPlan = async () => {
      try {
        setLoading(true);
        const mindName = projectId;

        // check sessions already exists for schema and minds
        const stateMachineSessions = await getSession(mindsConfig?.jsonOutput);
        const stateMachineSession = stateMachineSessions?.response?.find(
          (el: any) => el?.name === projectId
        );
        if (stateMachineSession) {
          // fetch with session id
          const stateMachineDetails = await getSession(
            mindsConfig?.jsonOutput,
            "",
            stateMachineSession?._id
          );
          setPlan(stateMachineDetails?.response);
        }

        const schemaSessions = await getSession(mindsConfig?.schemaAnalysis);
        const schemaSession = schemaSessions?.response?.find(
          (el: any) => el?.name === projectId
        );
        if (schemaSession) {
          // fetch with session id
          const schemaSessionDetails = await getSession(
            mindsConfig?.schemaAnalysis,
            "",
            schemaSession?._id
          );
          setSchemaWorkflow(schemaSessionDetails?.response);
        }

        if (stateMachineSession && schemaSession) return;

        // If sessions don't exist
        const responseStructure = {
          api: {},
          ui: {
            type: "tabs",
            tabs: [],
            content: {},
          },
        };
        const args = {
          workflow_tree: getBrdContent(),
          files: [],
        };
        const schemaWorkflowExecute = await executeMind(
          mindName,
          args,
          responseStructure,
          mindsConfig?.schemaAnalysis
        );
        const { job_id, session_id } = schemaWorkflowExecute;
        // show logs using job_id
        await streamSSE(job_id);
        // once logs are completed then fetch and save schemaWorkflow details using session_id
        const schemaWorkflowResponse = await getSession(
          mindsConfig?.schemaAnalysis,
          "",
          session_id
        );
        setSchemaWorkflow(schemaWorkflowResponse?.response);

        // next just take schemaWorkflow details and brd details to run plans
        const planArgs = {
          csv_input: getWorkflowSchemaCsv(schemaWorkflowResponse?.response),
          workflow_tree: getBrdContent(),
          files: [],
        };

        const planExecution = await executeMind(
          mindName,
          planArgs,
          responseStructure,
          mindsConfig?.jsonOutput
        );

        const planJobId = planExecution?.job_id;
        const planSessionId = planExecution?.session_id;

        // show logs for plans using session id and then fetch plan details
        await streamSSE(planJobId);
        const planDetails = await getSession(
          mindsConfig?.jsonOutput,
          "",
          planSessionId
        );
        setPlan(planDetails);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const getPreview = async () => {
      try {
        setLoading(true);

        const previewSessions = await getSession(mindsConfig?.syntheticData);
        const previewSession = previewSessions?.response?.find(
          (el: any) => el?.name === projectId
        );
        if (previewSession) {
          // fetch with session id
          const previewSessionDetails = await getSession(
            mindsConfig?.syntheticData,
            "",
            previewSession?._id
          );
          setPreview(previewSessionDetails?.response);
          return;
        }

        const mindName = projectId;
        const responseStructure = {
          api: {},
          ui: {
            type: "tabs",
            tabs: [],
            content: {},
          },
        };
        const args = {
          prompts: getBrdContent(),
          csv_file: getWorkflowSchemaCsv(schemaWorkflow),
          n_instances: 1,
        };
        const previewExecute = await executeMind(
          mindName,
          args,
          responseStructure,
          mindsConfig?.syntheticData
        );
        console.log(previewExecute);
        const { job_id, session_id } = previewExecute;
        await streamSSE(job_id);
        const previewResponse = await getSession(
          mindsConfig?.syntheticData,
          "",
          session_id
        );
        console.log(previewResponse);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (activeProjectTab !== "brd") {
      if (activeProjectTab === "plan" && ValidUtils.isEmptyObj(plan)) {
        getPlan();
      } else if (
        activeProjectTab === "preview" &&
        ValidUtils.isEmptyObj(preview)
      ) {
        getPreview();
      }
    }
  }, [activeProjectTab]);

  const projectTabItems = [
    {
      id: "brd",
      label: "BRD",
    },
    {
      id: "plan",
      label: "Plan",
    },
    {
      id: "smart-ai",
      label: "Smart AI",
    },
    {
      id: "preview",
      label: "Preview",
    },
  ];

  const CustomMiniMap = (props: any) => {
    React.useEffect(() => {
      const timer = setTimeout(() => {
        const titleElement = document.getElementById(
          "react-flow__minimap-desc-1"
        );
        if (titleElement) {
          titleElement.textContent = "Minimap";
        }
      }, 100);

      return () => clearTimeout(timer);
    }, []);

    return (
      <MiniMap
        nodeColor={nodeColor}
        nodeStrokeWidth={2}
        nodeBorderRadius={6}
        zoomable
        pannable
        className="reactflow-minimap"
        position="bottom-right"
        style={{
          height: 120,
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
        {...props}
      />
    );
  };

  // Enhanced layout constants for better hierarchy and alignment
  const LEVEL_HEIGHT = 220; // Further increased for better vertical spacing
  const NODE_WIDTH = 160;
  const NODE_SPACING_HORIZONTAL = 350; // Further increased horizontal spacing between workflows
  const STATE_SPACING = 220; // Further increased spacing between states
  const SUBSTATE_SPACING = 180; // Further increased spacing between substates
  const ROOT_X = 800; // Move root further to accommodate more workflows
  const ROOT_Y = 100;

  const parseJsonString = (jsonString: string): any | null => {
    try {
      // Remove Markdown code block markers if present
      const cleanedString = jsonString.replace(/^```json\n|```$/g, "");
      return JSON.parse(cleanedString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  const getStateMachines = (param: any) => {
    if (param) {
      if (ValidUtils.isEmptyObj(param)) return "";
      const stateMachineResponse =
        param?.output?.content?.["WorkflowResponse"][0];
      if (stateMachineResponse?.type === "markdown") {
        const workflowResponse = parseJsonString(stateMachineResponse?.content);
        return workflowResponse?.consolidated_state_machines;
      }
      return [];
    }
    if (ValidUtils.isEmptyObj(plan)) return "";
    const stateMachineResponse = plan?.output?.content?.["WorkflowResponse"][0];
    if (stateMachineResponse?.type === "markdown") {
      const workflowResponse = parseJsonString(stateMachineResponse?.content);
      return workflowResponse?.consolidated_state_machines;
    }
    return [];
  };

  // Helper function to parse CSV schema data into structured format
  const parseSchemaCSV = (csvContent: string) => {
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

        if (values.length < 10) continue; // Need at least 10 fields

        const workflow = values[0];
        const state = values[1];
        const subSchema = values[2];
        const subSchemaType = values[3];
        const keyProperty = values[4];
        const propertyTitle = values[5];
        const description = values[6];
        const propertyType = values[7];
        const format = values[8];
        const required = values[9] === "true";
        const options = values[10] || "";

        // Create unique schema key combining workflow and state
        const schemaKey = `${workflow}-${state}`
          .toLowerCase()
          .replace(/\s+/g, "");

        if (!schemaData[schemaKey]) {
          schemaData[schemaKey] = {
            _id: `public:${workflow}-${state}`,
            title: `${workflow} - ${state}`,
            type: "object",
            properties: {},
            order: [],
            workflow: workflow,
            state: state,
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

        // Add property to subSchema
        if (keyProperty && propertyTitle) {
          // Generate a simple index based on position (for compatibility with existing logic)
          const currentIndex = Object.keys(
            schemaData[schemaKey].properties[subSchema].properties
          ).length;
          const index = currentIndex > 3 ? 100 + currentIndex : currentIndex; // Ensure some fields have index > 99

          // Parse options safely
          let enumValues = undefined;
          if (options && options.length > 0) {
            try {
              // Handle the double-quoted strings in the options
              if (options.startsWith("[") && options.endsWith("]")) {
                // Replace double quotes with single quotes for JSON parsing
                const cleanOptions = options.replace(/\"\"/g, '"');
                enumValues = JSON.parse(cleanOptions);
              }
            } catch (e) {
              console.warn(
                "Failed to parse options for",
                keyProperty,
                ":",
                options,
                e
              );
              enumValues = undefined;
            }
          }

          schemaData[schemaKey].properties[subSchema].properties[keyProperty] =
            {
              type: propertyType,
              title: propertyTitle,
              description: description,
              format: format || undefined,
              required: required,
              index: index,
              enum: enumValues,
            };

          if (
            !schemaData[schemaKey].properties[subSchema].order.includes(
              keyProperty
            )
          ) {
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

  const getSchemas = (param: any) => {
    if (param) {
      if (ValidUtils.isEmptyObj(param)) return {};
      const schemaResponse = param?.output?.content?.["SchemaAnalyst__001"][0];
      if (schemaResponse?.type === "markdown") {
        console.log(
          "📊 Schema CSV content preview:",
          schemaResponse?.content?.substring(0, 200)
        );
        const parsedSchemas = parseSchemaCSV(schemaResponse?.content);
        console.log(
          "📊 Parsed schemas from param:",
          Object.keys(parsedSchemas)
        );
        return parsedSchemas;
      }
      return {};
    }
    if (ValidUtils.isEmptyObj(schemaWorkflow)) return {};
    const schemaResponse =
      schemaWorkflow?.output?.content?.["SchemaAnalyst__001"][0];
    if (schemaResponse?.type === "markdown") {
      console.log(
        "📊 Schema CSV content preview:",
        schemaResponse?.content?.substring(0, 200)
      );
      const parsedSchemas = parseSchemaCSV(schemaResponse?.content);
      console.log(
        "📊 Parsed schemas from schemaWorkflow:",
        Object.keys(parsedSchemas)
      );
      return parsedSchemas;
    }
    return {};
  };

  const getPreviewData = (param: any) => {
    if (param) {
      if (ValidUtils.isEmptyObj(param)) return [];
      const previewResponse = param?.output?.content?.["response"]?.[0];
      if (previewResponse?.type === "markdown") {
        const previewContent = parseJsonString(previewResponse?.content);
        console.log("📊 Preview data from param:", previewContent);
        return previewContent?.synthetic_data || [];
      }
      return [];
    }
    if (ValidUtils.isEmptyObj(preview)) return [];
    const previewResponse = (preview as any)?.output?.content?.[
      "response"
    ]?.[0];
    if (previewResponse?.type === "markdown") {
      const previewContent = parseJsonString(previewResponse?.content);
      console.log("📊 Preview data from preview state:", previewContent);
      return previewContent?.synthetic_data || [];
    }
    return [];
  };

  const getNodesAndEdges = (): { nodes: FlowNode[]; edges: FlowEdge[] } => {
    let stateMachines = getStateMachines(null);
    console.log("🔄 State machines data:", stateMachines);
    console.log("🔄 Type of stateMachines:", typeof stateMachines);
    console.log("🔄 Is array:", Array.isArray(stateMachines));
    console.log(
      "🔄 Keys:",
      stateMachines ? Object.keys(stateMachines) : "null/undefined"
    );

    const data: Record<string, any> = stateMachines;
    const nodes: FlowNode[] = [];
    const edges: FlowEdge[] = [];

    if (!data || Object.keys(data).length === 0) {
      console.log("❌ No data found - returning empty nodes/edges");
      return { nodes, edges };
    }

    console.log("✅ Data found, processing state machines...");

    // Calculate workflow starting positions to prevent overlaps
    const totalWorkflows = Object.values(data).length;
    const totalWidth = (totalWorkflows - 1) * NODE_SPACING_HORIZONTAL;
    const startX = Math.max(100, ROOT_X - totalWidth / 2); // Ensure minimum left margin

    // Add root node - centered
    nodes.push({
      id: "project-plan-node",
      type: "default",
      data: {
        label: "Workflow Plan",
      },
      position: { x: ROOT_X, y: ROOT_Y },
      style: {
        backgroundColor: "#eff6ff",
        border: "3px solid #3b82f6",
        borderRadius: "12px",
        padding: "12px 16px",
        fontSize: "16px",
        fontWeight: "bold",
        color: "#1e40af",
        minWidth: "140px",
        textAlign: "center",
      },
    });

    // Track global state positioning to prevent overlaps
    let globalStateXPosition = startX;
    let stateMachineIndex = 0;

    // Process by Index (1, 2, 3, ...) if available, otherwise process in order of appearance
    let currentIndex = 1;
    let foundStateMachine = true;
    let processedKeys = new Set<string>();

    // First pass: try to process by Index if available
    while (foundStateMachine) {
      foundStateMachine = false;

      // Find the state machine with current index
      for (const [key, stateMachine] of Object.entries(data)) {
        const sm = stateMachine as any;
        if (sm?.Index === currentIndex && !processedKeys.has(key)) {
          foundStateMachine = true;
          processedKeys.add(key);

          // Calculate centered position for this workflow
          const smX = startX + stateMachineIndex * NODE_SPACING_HORIZONTAL;
          const smY = ROOT_Y + LEVEL_HEIGHT;

          // Create main node for this state machine
          const mainNodeId = `${sm.Name}-node`;
          nodes.push({
            id: mainNodeId,
            type: "default",
            data: {
              label: sm.Name,
            },
            position: { x: smX, y: smY },
            style: {
              backgroundColor: "#fef3c7",
              border: "2px solid #f59e0b",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#92400e",
              minWidth: "120px",
              textAlign: "center",
            },
          });

          // Add edge from root to state machine
          edges.push({
            id: `edge-root-${mainNodeId}`,
            source: "project-plan-node",
            target: mainNodeId,
            type: "smoothstep",
            animated: true,
          });

          // Process the StartAt state with global positioning
          const startStateName = stateMachine.StartAt;
          if (startStateName && stateMachine.States[startStateName]) {
            globalStateXPosition = processStateWithLayout(
              stateMachine,
              startStateName,
              stateMachine.Name,
              nodes,
              edges,
              globalStateXPosition, // Use global X position
              smY + LEVEL_HEIGHT,
              0,
              stateMachine,
              true // This is the StartAt state - should always be added
            );
          }

          stateMachineIndex++;
          break;
        }
      }
      currentIndex++;
    }

    // Second pass: process any remaining state machines without Index (in order of appearance)
    for (const [key, stateMachine] of Object.entries(data)) {
      const sm = stateMachine as any;
      if (!processedKeys.has(key)) {
        processedKeys.add(key);

        // Calculate centered position for this workflow
        const smX = startX + stateMachineIndex * NODE_SPACING_HORIZONTAL;
        const smY = ROOT_Y + LEVEL_HEIGHT;

        // Create main node for this state machine
        const mainNodeId = `${sm.Name}-node`;
        nodes.push({
          id: mainNodeId,
          type: "default",
          data: {
            label: sm.Name,
          },
          position: { x: smX, y: smY },
          style: {
            backgroundColor: "#fef3c7",
            border: "2px solid #f59e0b",
            borderRadius: "10px",
            padding: "10px 14px",
            fontSize: "13px",
            fontWeight: "bold",
            color: "#92400e",
            minWidth: "120px",
            textAlign: "center",
          },
        });

        // Add edge from root to state machine
        edges.push({
          id: `edge-root-${mainNodeId}`,
          source: "project-plan-node",
          target: mainNodeId,
          type: "smoothstep",
          animated: true,
        });

        // Process the StartAt state with global positioning
        const startStateName = sm.StartAt;
        console.log(
          `🚀 Processing StartAt state: ${startStateName} for ${sm.Name}`
        );
        if (startStateName && sm.States[startStateName]) {
          console.log(
            `📍 StartAt state exists, calling processStateWithLayout...`
          );
          globalStateXPosition = processStateWithLayout(
            sm,
            startStateName,
            sm.Name,
            nodes,
            edges,
            globalStateXPosition, // Use global X position
            smY + LEVEL_HEIGHT,
            0,
            sm,
            true // This is the StartAt state - should always be added
          );
          console.log(
            `✅ Finished processing StartAt state, globalStateXPosition: ${globalStateXPosition}`
          );
        } else {
          console.log(`❌ StartAt state ${startStateName} not found in States`);
        }

        stateMachineIndex++;
      }
    }

    console.log(
      "Final nodes:",
      nodes.map((n) => n.id)
    );
    console.log(
      "Final edges:",
      edges.map((e) => `${e.source} -> ${e.target}`)
    );
    return { nodes, edges };
  };

  // Enhanced helper function to process a state and its chain with improved layout
  const processStateWithLayout = (
    stateMachine: StateMachine,
    stateName: string,
    parentId: string,
    nodes: FlowNode[],
    edges: FlowEdge[],
    currentXPosition: number, // Global X position tracker
    startY: number,
    stateIndex: number,
    fullStateMachine?: StateMachine,
    isStartAtState: boolean = false
  ): number => {
    // Return updated X position
    const state = stateMachine.States[stateName];
    if (!state) return currentXPosition;

    // Check termination condition for the chain
    // States with Commerce schema AND Flip is false (or missing - treat as false) should STOP the chain (and NOT be added)
    // BUT this should not apply to the StartAt state
    const hasCommerceSchema = state.Schema?.includes("Commerce");
    const flipValue = state.Props?.Flip ?? false; // Treat missing Flip as false
    const shouldTerminateChain =
      !isStartAtState && hasCommerceSchema && flipValue === false;

    console.log(`🔍 Processing state: ${stateName}`);
    console.log(`   - isStartAt: ${isStartAtState}`);
    console.log(`   - Schema: ${state.Schema}`);
    console.log(`   - hasCommerce: ${hasCommerceSchema}`);
    console.log(`   - Props:`, state.Props);
    console.log(`   - Flip: ${state.Props?.Flip} (treated as: ${flipValue})`);
    console.log(`   - shouldTerminate: ${shouldTerminateChain}`);

    // If chain should terminate, don't add this state and stop processing
    if (shouldTerminateChain) {
      console.log(
        `Chain terminated BEFORE adding state: ${stateName} (Commerce + Flip≠true)`
      );
      return currentXPosition;
    }

    // Use current global X position for this state
    const stateX = currentXPosition;
    const stateY = startY;

    // Create state node with unique ID based on parent workflow
    const stateNodeId = `${parentId}-${stateName}`;
    nodes.push({
      id: stateNodeId,
      type: "default",
      data: {
        label: stateName,
      },
      position: { x: stateX, y: stateY },
      style: {
        backgroundColor: "#dcfce7",
        border: "2px solid #16a34a",
        borderRadius: "8px",
        padding: "8px 12px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#15803d",
        minWidth: "100px",
        textAlign: "center",
      },
    });

    // Add edge from parent workflow to this state
    edges.push({
      id: `edge-${parentId}-${stateName}`,
      source: `${parentId}-node`,
      target: stateNodeId,
      type: "smoothstep",
    });

    // Update global X position for next state
    const nextXPosition = currentXPosition + STATE_SPACING;

    // Process substates if they exist
    if (state.SubStates && Object.keys(state.SubStates).length > 0) {
      // Find the starting substate
      for (const [subStateName, subState] of Object.entries(state.SubStates)) {
        if (subState.Start) {
          processSubStateChainWithLayout(
            state.SubStates,
            subStateName,
            stateNodeId,
            nodes,
            edges,
            stateX,
            stateY + LEVEL_HEIGHT,
            0
          );
          break;
        }
      }
    }

    // Only process next state if current state is not an End state
    if (!state.End && state.NextState && stateMachine.States[state.NextState]) {
      return processStateWithLayout(
        stateMachine,
        state.NextState,
        parentId,
        nodes,
        edges,
        nextXPosition, // Pass updated X position
        startY,
        stateIndex + 1,
        fullStateMachine,
        false // Subsequent states are not StartAt states
      );
    }

    return nextXPosition; // Return the updated position for next workflow
  };

  // Enhanced helper function to process substate chain with better layout
  const processSubStateChainWithLayout = (
    subStates: Record<string, SubState>,
    currentSubStateName: string,
    parentStateId: string,
    nodes: FlowNode[],
    edges: FlowEdge[],
    startX: number,
    startY: number,
    subStateIndex: number
  ): void => {
    let currentSubState = subStates[currentSubStateName];
    let currentName = currentSubStateName;
    let index = subStateIndex;

    while (currentSubState && currentName) {
      // Calculate position for this substate with better spacing
      const subStateX = startX + index * SUBSTATE_SPACING;
      const subStateY = startY;

      // Create substate node with unique ID based on parent state
      const subStateNodeId = `${parentStateId}-${currentName}`;
      nodes.push({
        id: subStateNodeId,
        type: "default",
        data: {
          label: currentName,
        },
        position: { x: subStateX, y: subStateY },
        style: {
          backgroundColor: "#fce7f3",
          border: "2px solid #ec4899",
          borderRadius: "6px",
          padding: "6px 10px",
          fontSize: "11px",
          fontWeight: "500",
          color: "#be185d",
          minWidth: "80px",
          textAlign: "center",
        },
      });

      // Add edge from parent state to this substate
      edges.push({
        id: `edge-${parentStateId}-${currentName}`,
        source: parentStateId,
        target: subStateNodeId,
        type: "smoothstep",
      });

      // Stop if this is an end state
      if (currentSubState.End) {
        break;
      }

      // Move to next substate
      const nextSubStateName = currentSubState.NextState;
      if (nextSubStateName && subStates[nextSubStateName]) {
        currentName = nextSubStateName;
        currentSubState = subStates[nextSubStateName];
        index++;
      } else {
        break;
      }
    }
  };

  // Get initial nodes and edges and set up state management
  const initialData = getNodesAndEdges();
  const [flowNodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);

  // Update nodes and edges when plan data changes
  useEffect(() => {
    console.log("🔄 Plan data changed, regenerating nodes and edges...");
    const newData = getNodesAndEdges();
    console.log("🔄 New nodes count:", newData.nodes.length);
    console.log("🔄 New edges count:", newData.edges.length);
    setNodes(newData.nodes);
    setEdges(newData.edges);
  }, [plan, schemaWorkflow]); // Re-run when plan or schemaWorkflow changes

  // Ref to access ReactFlow instance
  const reactFlowInstance = React.useRef<any>(null);
  const [isFlowReady, setIsFlowReady] = React.useState(false);

  // Helper function to get current state machines data for components
  const getCurrentStateMachines = () => {
    const stateMachines = getStateMachines(null);
    return stateMachines || {};
  };

  // Helper function to get current schemas data for components
  const getCurrentSchemas = () => {
    const schemas = getSchemas(null);
    return schemas || {};
  };

  // Helper function to get current preview data for components
  const getCurrentPreviewData = () => {
    const previewData = getPreviewData(null);
    return previewData || [];
  };

  const getBrdContent = () => {
    if (!ValidUtils.isEmptyObj(Brd)) {
      const brdObj = Brd?.output?.content?.["Ba__001"][0];
      if (brdObj?.type === "markdown") return brdObj?.content;
      return "";
    }
    return testMarkdown;
  };

  // Helper function to get schema from node ID
  const getSchemaFromNodeId = (nodeId: string) => {
    if (!nodeId || !schemas) return null;

    // Skip root node and workflow nodes
    if (nodeId === "project-plan-node" || nodeId.endsWith("-node")) {
      return null;
    }

    // Parse node ID to extract workflow and state information
    // Format: "WorkflowName-StateName" or "WorkflowName-StateName-SubStateName"
    const parts = nodeId.split("-");
    if (parts.length < 2) return null;

    // Get workflow name and state name
    const workflowName = parts[0];
    const stateName = parts[1];

    // Create schema key
    const schemaKey = `${workflowName}-${stateName}`
      .toLowerCase()
      .replace(/\s+/g, "");

    return schemas[schemaKey] || null;
  };

  // Helper function to get state machine data from node ID
  const getStateMachineDataFromNodeId = (nodeId: string) => {
    if (!nodeId) return null;

    const stateMachines = getStateMachines(null);
    if (!stateMachines) return null;

    // For workflow nodes, return the entire state machine
    if (nodeId.endsWith("-node") && !nodeId.includes("project-plan")) {
      const workflowName = nodeId.replace("-node", "");
      return (
        Object.values(stateMachines).find(
          (sm: any) => sm.Name === workflowName
        ) || null
      );
    }

    // For state nodes, return the specific state
    const parts = nodeId.split("-");
    if (parts.length >= 2) {
      const workflowName = parts[0];
      const stateName = parts[1];

      const stateMachine = Object.values(stateMachines).find(
        (sm: any) => sm.Name === workflowName
      );
      if (stateMachine && (stateMachine as any).States?.[stateName]) {
        return {
          workflowName,
          stateName,
          stateData: (stateMachine as any).States[stateName],
          fullStateMachine: stateMachine,
        };
      }
    }

    return null;
  };

  // Handle node click
  const handleNodeClick = (event: any, node: any) => {
    console.log("Node clicked:", node.id);
    setSelectedNode(node.id);
    setShowSchemaPanel(true);
  };

  const schemas = getCurrentSchemas();

  const getWorkflowSchemaCsv = (paramSchema: any) => {
    if (paramSchema) {
      if (ValidUtils.isEmptyObj(paramSchema)) return "";
      const schema = paramSchema?.output?.content?.["SchemaAnalyst__001"][0];
      if (schema?.type === "markdown") return schema?.content;
      return "";
    } else {
      if (ValidUtils.isEmptyObj(schemaWorkflow)) return "";
      const schema = schemaWorkflow?.output?.content?.["SchemaAnalyst__001"][0];
      if (schema?.type === "markdown") return schema?.content;
      return "";
    }
  };

  const handleReRun = async () => {
    try {
      setLoading(true);
      const mindName = projectId;
      const responseStructure = {
        api: {},
        ui: {
          type: "tabs",
          tabs: [],
          content: {},
        },
      };

      let sessionId = "";
      let args = {};
      let mindId = "";

      // Determine the mind to rerun based on active tab
      switch (activeProjectTab) {
        case "brd":
          sessionId = Brd?._id;
          args = { ...Brd?.args };
          mindId = ""; // BRD doesn't use a specific mindId
          break;

        case "plan":
          sessionId = plan?._id;
          args = {
            csv_input: getWorkflowSchemaCsv(schemaWorkflow),
            workflow_tree: getBrdContent(),
            files: [],
          };
          mindId = mindsConfig?.jsonOutput;
          break;

        case "preview":
          sessionId = preview?._id;
          args = {
            prompts: getBrdContent(),
            csv_file: getWorkflowSchemaCsv(schemaWorkflow),
            n_instances: 1,
          };
          mindId = mindsConfig?.syntheticData;
          break;

        case "smart-ai":
          sessionId = schemaWorkflow?._id;
          args = {
            workflow_tree: getBrdContent(),
            files: [],
          };
          mindId = mindsConfig?.schemaAnalysis;
          break;

        default:
          throw new Error("Invalid active tab for rerun");
      }

      // Execute the mind with the appropriate parameters
      const execution = await executeMind(
        mindName,
        args,
        responseStructure,
        mindId
      );

      const { job_id, session_id } = execution;

      // Wait for the SSE stream to complete
      await streamSSE(job_id);

      // Fetch the updated response
      const response = await getSession(mindId, "", session_id);

      // Update the appropriate state based on the tab
      switch (activeProjectTab) {
        case "brd":
          setBrd(response?.response || {});
          break;
        case "plan":
          setPlan(response?.response || {});
          break;
        case "preview":
          setPreview(response?.response || {});
          break;
        case "smart-ai":
          setSchemaWorkflow(response?.response || {});
          break;
      }
    } catch (error) {
      console.error("❌ Error in handleReRun:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeProjectTab) {
      case "brd":
        return (
          <MarkdownRenderer content={getBrdContent()} className="w-full p-4" />
        );
      case "plan":
        return (
          <ReactFlowProvider>
            <div className="h-full w-full flex relative">
              {/* ReactFlow Container */}
              <div
                className={`transition-all duration-300 ${
                  showSchemaPanel ? "w-2/3" : "w-full"
                } relative`}
              >
                {!isFlowReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
                    <div className="text-gray-500">Loading flow diagram...</div>
                  </div>
                )}
                <div
                  className="flow-builder h-full w-full relative"
                  id="reactflow-container"
                  style={{
                    touchAction: "none",
                    outline: "none",
                    opacity: isFlowReady ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                >
                  <ReactFlow
                    className="reactflow h-full w-full"
                    nodes={flowNodes}
                    edges={flowEdges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={handleNodeClick}
                    onInit={(instance) => {
                      reactFlowInstance.current = instance;
                      // Just set ready state without fitting
                      requestAnimationFrame(() => {
                        setIsFlowReady(true);
                      });
                    }}
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    attributionPosition="bottom-left"
                    proOptions={{ hideAttribution: true }}
                    panOnScroll={true}
                    selectionOnDrag={true}
                    panOnDrag={[1, 2]}
                    zoomOnScroll={true}
                    zoomOnPinch={true}
                    zoomOnDoubleClick={true}
                    minZoom={0.3}
                    maxZoom={2}
                  >
                    <CustomMiniMap />
                    <Controls position="bottom-left" />
                    <Background color={"#f1f5f9"} gap={20} />

                    {/* Legend Card */}
                    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border p-4 z-10 min-w-[200px]">
                      <h3 className="text-sm font-semibold mb-3 text-gray-800">
                        Flow Legend
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-50"></div>
                          <span className="text-xs text-gray-700">
                            Project Name
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border-2 border-amber-500 bg-amber-50"></div>
                          <span className="text-xs text-gray-700">
                            Workflow
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border-2 border-green-600 bg-green-100"></div>
                          <span className="text-xs text-gray-700">States</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border-2 border-pink-500 bg-pink-100"></div>
                          <span className="text-xs text-gray-700">
                            Sub-States
                          </span>
                        </div>
                      </div>
                    </div>
                  </ReactFlow>
                </div>
              </div>

              {/* Schema Panel */}
              {showSchemaPanel && selectedNode && (
                <div className="w-1/3 border-l border-gray-300 bg-gray-50 flex flex-col shadow-lg">
                  {/* Panel Content - Direct rendering without wrapper */}
                  <div className="flex-1 overflow-hidden">
                    {(() => {
                      const schema = getSchemaFromNodeId(selectedNode);
                      const nodeData =
                        getStateMachineDataFromNodeId(selectedNode);

                      // Show schema if available
                      if (schema) {
                        const parts = selectedNode.split("-");
                        const stateName =
                          parts.length >= 2
                            ? parts.slice(0, 2).join("-")
                            : selectedNode;

                        return (
                          <JsonPreview
                            schema={schema}
                            stateName={stateName}
                            title="Schema Details"
                            onClose={() => {
                              setShowSchemaPanel(false);
                              setSelectedNode(null);
                            }}
                          />
                        );
                      }

                      // Show state machine data for workflow nodes or state nodes without schema
                      if (nodeData) {
                        return (
                          <JsonPreview
                            data={
                              Object.keys(nodeData).length > 0 ? nodeData : null
                            }
                            stateName={selectedNode}
                            title="State Machine Data"
                            onClose={() => {
                              setShowSchemaPanel(false);
                              setSelectedNode(null);
                            }}
                          />
                        );
                      }

                      // Direct rendering for root node or other nodes
                      return (
                        <JsonPreview
                          stateName={selectedNode}
                          title="Node Information"
                          data={
                            selectedNode === "project-plan-node"
                              ? {
                                  projectData: getCurrentStateMachines(),
                                  schemas: getCurrentSchemas(),
                                }
                              : null
                          }
                          onClose={() => {
                            setShowSchemaPanel(false);
                            setSelectedNode(null);
                          }}
                        />
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </ReactFlowProvider>
        );
      case "smart-ai":
        return <AIConfiguration />;
      case "preview":
        return (
          <WorkflowPreview
            stateMachines={getCurrentStateMachines()}
            schemas={getCurrentSchemas()}
            previewData={getCurrentPreviewData()}
          />
        );
      default:
        return <MarkdownRenderer content={testMarkdown} className="w-full" />;
    }
  };

  return (
    <div className="flex w-full">
      <FlexLayout
        direction="row"
        gap="none"
        background="gray"
        padding="none"
        rounded="lg"
        border="default"
        className="w-full h-screen p-0"
        childrenWidths={["20%", "80%"]}
      >
        <ChatPage />

        {/* Project plan content */}
        <FlexLayout
          direction="col"
          className="h-full p-0 rounded-none bg-white w-full border-l border-gray-300 gap-0"
        >
          {/* Navbar */}
          <FlexLayout
            direction="row"
            justify="between"
            align="center"
            padding="sm"
            className="border-b bg-white w-full rounded-none"
          >
            {/* Left side - Empty placeholder to maintain layout */}
            <FlexLayout direction="row" align="center" gap="sm">
              <div className="w-32"></div>
            </FlexLayout>

            {/* Center - Tabs */}
            <Tab
              items={projectTabItems}
              activeTab={activeProjectTab}
              onChange={setActiveProjectTab}
              variant="bordered"
              size="sm"
              className="w-fit"
            />

            {/* Right side - Deploy button */}
            <FlexLayout direction="row" align="center" gap="md">
              <Button
                variant="primary"
                size="sm"
                className="bg-transparent text-gray-800 hover:text-white"
                onClick={() => handleReRun()}
              >
                Re-run
              </Button>
              <Button
                variant="primary"
                size="sm"
                className=""
                onClick={() =>
                  navigate(
                    `/create-deploy/${projectId || "default-id"}/${
                      projectName || "default-project"
                    }`
                  )
                }
              >
                Build App
              </Button>
            </FlexLayout>
          </FlexLayout>

          {/* Rendering the tab content */}
          <div className="w-full overflow-auto p-4 h-full">
            {loading ? <Spinner className="h-100" /> : renderContent()}
          </div>
        </FlexLayout>
      </FlexLayout>
    </div>
  );
};

export default ProjectPlanScreen;
