import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Select } from "../components/atoms/form";
import MarkdownRenderer from "../utils/MarkdownRenderer";
import { stateMachineExampleDummyData } from "../utils/stateMachine";
import { FlowEdge, FlowNode, StateMachine, SubState } from "../types";
import { testMarkdown } from "./sample_data/brd";
import AIConfiguration from "./AIConfiguration";
import WorkflowPreview from "./WorkflowPreview";

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

const ProjectPlanScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeProjectTab, setActiveProjectTab] = useState("brd");
  const [selectedVersion, setSelectedVersion] = useState("1.0");

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
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px'
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

  const getNodesAndEdges = (): { nodes: FlowNode[]; edges: FlowEdge[] } => {
    const data: Record<string, StateMachine> = stateMachineExampleDummyData;
    const nodes: FlowNode[] = [];
    const edges: FlowEdge[] = [];

    if (!data || Object.keys(data).length === 0) {
      return { nodes, edges };
    }

    // Calculate workflow starting positions to prevent overlaps
    const totalWorkflows = Object.values(data).length;
    const totalWidth = (totalWorkflows - 1) * NODE_SPACING_HORIZONTAL;
    const startX = Math.max(100, ROOT_X - (totalWidth / 2)); // Ensure minimum left margin

    // Add root node - centered
    nodes.push({
      id: "project-plan-node",
      type: "default",
      data: {
        label: "Project Plan",
      },
      position: { x: ROOT_X, y: ROOT_Y },
      style: {
        backgroundColor: '#eff6ff',
        border: '3px solid #3b82f6',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#1e40af',
        minWidth: '140px',
        textAlign: 'center'
      }
    });

    // Track global state positioning to prevent overlaps
    let globalStateXPosition = startX;
    let stateMachineIndex = 0;

    // Process by Index (1, 2, 3, ...)
    let currentIndex = 1;
    let foundStateMachine = true;

    while (foundStateMachine) {
      foundStateMachine = false;

      // Find the state machine with current index
      for (const [key, stateMachine] of Object.entries(data)) {
        if (stateMachine?.Index === currentIndex) {
          foundStateMachine = true;

          // Calculate centered position for this workflow
          const smX = startX + (stateMachineIndex * NODE_SPACING_HORIZONTAL);
          const smY = ROOT_Y + LEVEL_HEIGHT;

          // Create main node for this state machine
          const mainNodeId = `${stateMachine.Name}-node`;
          nodes.push({
            id: mainNodeId,
            type: "default",
            data: {
              label: stateMachine.Name,
            },
            position: { x: smX, y: smY },
            style: {
              backgroundColor: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: 'bold',
              color: '#92400e',
              minWidth: '120px',
              textAlign: 'center'
            }
          });

          // Add edge from root to state machine
          edges.push({
            id: `edge-root-${mainNodeId}`,
            source: "project-plan-node",
            target: mainNodeId,
            type: "smoothstep",
            animated: true
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
              stateMachine
            );
          }

          stateMachineIndex++;
          break;
        }
      }
      currentIndex++;
    }

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
    fullStateMachine?: StateMachine
  ): number => { // Return updated X position
    const state = stateMachine.States[stateName];
    if (!state) return currentXPosition;

    // Check schema condition
    const hasCommerceSchema = state.Schema?.includes("Commerce");
    const shouldSkip = hasCommerceSchema && state.Props?.Flip === true;

    if (shouldSkip) {
      // Process next state in the chain if this one is skipped
      if (state.NextState && stateMachine.States[state.NextState]) {
        return processStateWithLayout(
          stateMachine, 
          state.NextState, 
          parentId, 
          nodes, 
          edges, 
          currentXPosition, // Pass along current position
          startY, 
          stateIndex,
          fullStateMachine
        );
      }
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
        backgroundColor: '#dcfce7',
        border: '2px solid #16a34a',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#15803d',
        minWidth: '100px',
        textAlign: 'center'
      }
    });

    // Add edge from parent workflow to this state
    edges.push({
      id: `edge-${parentId}-${stateName}`,
      source: `${parentId}-node`,
      target: stateNodeId,
      type: "smoothstep"
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
        fullStateMachine
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
      const subStateX = startX + (index * SUBSTATE_SPACING);
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
          backgroundColor: '#fce7f3',
          border: '2px solid #ec4899',
          borderRadius: '6px',
          padding: '6px 10px',
          fontSize: '11px',
          fontWeight: '500',
          color: '#be185d',
          minWidth: '80px',
          textAlign: 'center'
        }
      });

      // Add edge from parent state to this substate
      edges.push({
        id: `edge-${parentStateId}-${currentName}`,
        source: parentStateId,
        target: subStateNodeId,
        type: "smoothstep"
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
  
  // Ref to access ReactFlow instance
  const reactFlowInstance = React.useRef<any>(null);
  const [isFlowReady, setIsFlowReady] = React.useState(false);

  const renderContent = () => {
    switch (activeProjectTab) {
      case "brd":
        return <MarkdownRenderer content={testMarkdown} className="w-full" />;
      case "plan":
        return (
          <ReactFlowProvider>
            <div className="h-full w-full relative">
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
                  transition: "opacity 0.3s ease-in-out"
                }}
              >
              <ReactFlow
                className="reactflow h-full w-full"
                nodes={flowNodes}
                edges={flowEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
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
                  <h3 className="text-sm font-semibold mb-3 text-gray-800">Flow Legend</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-50"></div>
                      <span className="text-xs text-gray-700">Project Name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-amber-500 bg-amber-50"></div>
                      <span className="text-xs text-gray-700">Workflow</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-green-600 bg-green-100"></div>
                      <span className="text-xs text-gray-700">States</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-pink-500 bg-pink-100"></div>
                      <span className="text-xs text-gray-700">Sub-States</span>
                    </div>
                  </div>
                </div>
              </ReactFlow>
              </div>
            </div>
          </ReactFlowProvider>
        );
      case "smart-ai":
        return <AIConfiguration />;
      case "preview":
        return <WorkflowPreview />;
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
            {/* Left side - Version dropdown */}
            <FlexLayout direction="row" align="center" gap="sm">
              <Select
                value={selectedVersion}
                onChange={(value) => setSelectedVersion(value as string)}
                options={[
                  { value: "1.0", label: "Version 1.0" },
                  { value: "2.0", label: "Version 2.0" },
                ]}
                size="sm"
                variant="default"
                className="text-sm font-medium border-none"
              />
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

            {/* Right side - Updated text and Deploy button */}
            <FlexLayout direction="row" align="center" gap="md">
              <span className="text-sm text-gray-500">Updated 3min ago</span>
              <Button
                variant="primary"
                size="sm"
                className="bg-gray-800 hover:bg-gray-900"
                onClick={() => navigate("/create-deploy")}
              >
                Create App
              </Button>
            </FlexLayout>
          </FlexLayout>

          {/* Rendering the tab content */}
          <div className="w-full overflow-auto p-4 h-full">{renderContent()}</div>
        </FlexLayout>
      </FlexLayout>
    </div>
  );
};

export default ProjectPlanScreen;
