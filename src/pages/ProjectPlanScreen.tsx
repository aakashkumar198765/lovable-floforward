import React, { useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
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
  switch (node.type) {
    case "addableNode":
      return "#6ede87";
    case "editableNode":
      return "#6865A5";
    case "accordionNode":
      return "#6ede87";
    default:
      return "#ff0072";
  }
};

const ProjectPlanScreen: React.FC = () => {
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
    setTimeout(() => {
      const titleElement = document.getElementById(
        "react-flow__minimap-desc-1"
      );
      if (titleElement) {
        titleElement.textContent = "Minimap"; // Change the hover text
      }
    }, 5);

    return <MiniMap {...props} />;
  };

  // Layout constants - moved to component level
  const LEVEL_HEIGHT = 150;
  const NODE_WIDTH = 200;
  const NODE_SPACING = 250;
  const ROOT_X = 400;
  const ROOT_Y = 50;

  const getNodesAndEdges = (): { nodes: FlowNode[]; edges: FlowEdge[] } => {
    const data: Record<string, StateMachine> = stateMachineExampleDummyData;
    const nodes: FlowNode[] = [];
    const edges: FlowEdge[] = [];

    if (!data || Object.keys(data).length === 0) {
      return { nodes, edges };
    }

    // Add root node
    nodes.push({
      id: "project-plan-node",
      type: "default",
      data: {
        label: "Project Plan",
      },
      position: { x: ROOT_X, y: ROOT_Y },
      style: {
        backgroundColor: '#eff6ff',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#1e40af'
      }
    });

    // Track positions for each level
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

          // Calculate position for this state machine
          const smX = ROOT_X - 300 + (stateMachineIndex * NODE_SPACING);
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
              borderRadius: '8px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#92400e'
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

          // Process the StartAt state
          const startStateName = stateMachine.StartAt;
          if (startStateName && stateMachine.States[startStateName]) {
            processStateWithLayout(
              stateMachine,
              startStateName,
              stateMachine.Name,
              nodes,
              edges,
              smX,
              smY + LEVEL_HEIGHT,
              0
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

  // Helper function to process a state and its chain with layout
  const processStateWithLayout = (
    stateMachine: StateMachine,
    stateName: string,
    parentId: string,
    nodes: FlowNode[],
    edges: FlowEdge[],
    startX: number,
    startY: number,
    stateIndex: number
  ): number => {
    const state = stateMachine.States[stateName];
    if (!state) return stateIndex;

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
          startX, 
          startY, 
          stateIndex
        );
      }
      return stateIndex;
    }

    // Calculate position for this state
    const stateX = startX + (stateIndex * NODE_SPACING);
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
        padding: '8px',
        fontSize: '11px',
        color: '#15803d'
      }
    });

    // Add edge from parent workflow to this state (parent-child relationship only)
    edges.push({
      id: `edge-${parentId}-${stateName}`,
      source: `${parentId}-node`,
      target: stateNodeId,
      type: "smoothstep"
    });

    let nextStateIndex = stateIndex + 1;

    // Process substates if they exist - check for ANY state with SubStates
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
        startX, 
        startY, 
        nextStateIndex
      );
    }

    return nextStateIndex;
  };

  // Helper function to process substate chain with layout
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
      // Calculate position for this substate
      const subStateX = startX + (index * (NODE_WIDTH + 50));
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
          padding: '6px',
          fontSize: '10px',
          color: '#be185d'
        }
      });

      // Add edge from parent state to this substate (parent-child relationship)
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
  const { nodes, edges } = getNodesAndEdges();

  const renderContent = () => {
    switch (activeProjectTab) {
      case "brd":
        return <MarkdownRenderer content={testMarkdown} className="w-full" />;
      case "plan":
        return (
          <div
            className="flow-builder h-full w-full relative"
            id="reactflow-container"
            style={{ touchAction: "none", outline: "none" }}
          >
            <ReactFlow
              className="reactflow h-full w-full"
              nodes={nodes}
              edges={edges}
              fitView
              attributionPosition="bottom-left"
              proOptions={{ hideAttribution: true }}
              panOnScroll={true}
              selectionOnDrag={true}
              panOnDrag={[1, 2]}
              zoomOnScroll={true}
              zoomOnPinch={true}
              zoomOnDoubleClick={true}
            >
              <CustomMiniMap
                nodeColor={nodeColor}
                nodeStrokeWidth={3}
                zoomable
                pannable
                className="reactflow-minimap"
                position="bottom-right"
              />
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
              >
                Deploy
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
