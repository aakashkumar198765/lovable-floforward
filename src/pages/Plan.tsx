import React, { useEffect, useState } from "react";
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
import { stateMachineExampleDummyData } from "../utils/stateMachine";
import { FlowEdge, FlowNode, StateMachine, SubState } from "../types";

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

const Plan: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

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
        backgroundColor: "#eff6ff",
        border: "2px solid #3b82f6",
        borderRadius: "8px",
        padding: "10px",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#1e40af",
      },
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
          const smX = ROOT_X - 300 + stateMachineIndex * NODE_SPACING;
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
              backgroundColor: "#fef3c7",
              border: "2px solid #f59e0b",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#92400e",
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
    const stateX = startX + stateIndex * NODE_SPACING;
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
        padding: "8px",
        fontSize: "11px",
        color: "#15803d",
      },
    });

    // Add edge from parent workflow to this state (parent-child relationship only)
    edges.push({
      id: `edge-${parentId}-${stateName}`,
      source: `${parentId}-node`,
      target: stateNodeId,
      type: "smoothstep",
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
      const subStateX = startX + index * (NODE_WIDTH + 50);
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
          padding: "6px",
          fontSize: "10px",
          color: "#be185d",
        },
      });

      // Add edge from parent state to this substate (parent-child relationship)
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

  useEffect(() => {
     const { nodes, edges } = getNodesAndEdges();
     setNodes(nodes);
     setEdges(edges);
  }, []);
console.log("Nodes:", nodes);
  console.log("Edges:", edges);
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
          <h3 className="text-sm font-semibold mb-3 text-gray-800">
            Flow Legend
          </h3>
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
};

export default Plan;
