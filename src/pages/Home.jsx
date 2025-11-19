// components/WorkflowPage.jsx
import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import ContextMenu from "../components/ContextMenu";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import Node from "../components/Node";
import FloatingBar from "../components/FloatingBar";

import config from "../utils/config.json";
import workspace from "../utils/workspaceManager";
import { convertToFrontendNode, convertToEdges } from "../utils/nodeConversion";
import { createConnectHandler } from "../utils/connectionHandlers";
import {
  createAddNodeHandler,
  createNodeDragStopHandler,
} from "../utils/nodeEventHandlers";

const nodeTypes = { custom: Node };

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [menuState, setMenuState] = React.useState({
    visible: false,
    pos: null,
    nodeId: null,
  });

  // Debugging: draw a red dot at the cursor position
  function drawDebugDot(event) {
    const dot = document.createElement("div");
    dot.style.position = "absolute";
    dot.style.width = "8px";
    dot.style.height = "8px";
    dot.style.borderRadius = "50%";
    dot.style.background = "red";
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    dot.style.zIndex = 9999;

    document.body.appendChild(dot);

    // Optional: remove after a short delay
    setTimeout(() => dot.remove(), 1000);
  }

  // Context menu handler
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    drawDebugDot(event);
    // Get bounding box of the ReactFlow wrapper
    const bounds = event.currentTarget.getBoundingClientRect();

    // Cursor position relative to the wrapper
    const cursorX = event.clientX;
    const cursorY = event.clientY;

    console.log("x:", cursorX, "y:", cursorY);
    setMenuState({
      visible: true,
      pos: { x: cursorX, y: cursorY },
      nodeId: node.id,
    });
  }, []);

  // Close context menu
  const closeMenu = () =>
    setMenuState({ visible: false, pos: null, nodeId: null });

  // Factory for field change handlers
  const createOnChange = (id) => (key, value) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === `${id}` ? { ...n, data: { ...n.data, [key]: value } } : n
      )
    );
    workspace.editNodeData(id, { [key]: value });
  };

  // Update a specific field on a node in the frontend state
  const updateNodeFieldFrontend = (nodeId, fieldKey, newValue) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === String(nodeId)) {
          return {
            ...node,
            data: {
              ...node.data,
              [fieldKey]: newValue,
            },
          };
        }
        return node;
      })
    );
  };

  // React Flow callback when a node is dragged and released
  const onNodeDragStop = useCallback(createNodeDragStopHandler(workspace), []);

  //get changes from backend and update to frontend
  const updateSceneFromBackend = () => {
    const backendNodes = workspace.getAllNodes();
    const frontendNodes = backendNodes.map((node) =>
      convertToFrontendNode(node, createOnChange)
    );

    setNodes(frontendNodes);
    setEdges([]);
    const newEdges = convertToEdges(backendNodes);
    setEdges(newEdges);
  };

  // Connection handler with type checking
  const onConnect = useCallback(
    createConnectHandler(workspace, setEdges, updateNodeFieldFrontend),
    [setEdges]
  );

  // Node creation handler
  const handleAddNode = useCallback(
    createAddNodeHandler(workspace, setNodes, createOnChange),
    []
  );

  useEffect(() => {
    workspace.setSceneUpdater(updateSceneFromBackend);
  }, []);

  // Floating bar actions
  const actions = {
    Dequeue: () => console.log("Dequeue triggered"),
    Enqueue: () => console.log("Enqueue triggered"),
    Play: () => workspace.run_workflow_from_file(),
    Pause: () => console.log("Pause triggered"),
    Stop: () => console.log("Stop triggered"),
  };

  return (
    <div className="h-screen w-screen bg-[#1c1f26] text-gray-200 font-sans flex flex-col overflow-hidden">
      <div className="h-16 bg-zinc-800 border-b border-zinc-700">
        <TopBar />
      </div>
      <div className="flex flex-1">
        <Sidebar onAddNode={handleAddNode} />
        <div className="flex-1 overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeContextMenu={onNodeContextMenu}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#1c1f26]"
          >
            <Background color="#3a3d45" gap={24} size={1.8} />
            <MiniMap nodeColor={() => "#00bcd4"} maskColor="#1c1f26" />
            <Controls />
          </ReactFlow>
          {menuState.visible && (
            <ContextMenu
              nodeId={menuState.nodeId}
              position={menuState.pos}
              onClose={closeMenu}
              updateScene={updateSceneFromBackend}
            />
          )}

          <FloatingBar actions={actions} />
        </div>
      </div>
    </div>
  );
}
