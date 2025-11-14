// components/WorkflowPage.jsx
import React, { useCallback, useEffect, useReducer } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import Node from "../components/Node";

import config from "../utils/config.json";
import workspace from "../utils/workspaceManager";
import { nodeSchemas } from "../utils/nodeSchemas";
import FloatingBar from "../components/FloatingBar";

const nodeTypes = { custom: Node };

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const createOnChange = (id) => (key, value) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === `${id}` ? { ...n, data: { ...n.data, [key]: value } } : n
      )
    );
    workspace.editNode(id, { [key]: value });
  };

  //get nodes from backend
  const _convertToFrontendNode = (node) => {
    const schema = nodeSchemas[node.type];

    // Ensure position is always an object {x, y}
    const position =
      typeof node.position?.x === "number" &&
      typeof node.position?.y === "number"
        ? node.position
        : {
            x: Array.isArray(node.position) ? node.position[0] : 100,
            y: Array.isArray(node.position) ? node.position[1] : 100,
          };

    return {
      id: `${node.id}`,
      type: "custom",
      data: {
        ...node.data,
        type: node.type,
        label: `${schema?.displayName || node.type} Node`,
        onChange: createOnChange(node.id),
      },
      position, // always {x, y}
      connections: node.connections || { inputs: [], outputs: [] }, // preserve schema
    };
  };

  const _convertToEdges = (nodes) => {
    const newEdges = [];

    nodes.forEach((node) => {
      const sourceId = `${node.id}`;
      const outputs = node.connections?.outputs || [];

      outputs.forEach((conn) => {
        newEdges.push({
          id: `${sourceId}-${conn.nodeId}-${conn.type}`, // unique edge id
          source: sourceId,
          sourceHandle: conn.type, // <-- attach to the correct output handle
          target: `${conn.nodeId}`,
          // optionally: targetHandle if your inputs have multiple handles
          label: conn.type,
          style: {
            stroke: config.ui.link.color,
            strokeWidth: config.ui.link.thickness,
          },
        });
      });
    });

    setEdges(() => newEdges);
  };

  //get changes from backend and update to frontend
  const updateSceneFromBackend = () => {
    const backendNodes = workspace.getAllNodes();
    const frontendNodes = backendNodes.map(_convertToFrontendNode);

    setNodes(frontendNodes);
    setEdges([]); // clear before rebuilding
    _convertToEdges(backendNodes);
  };

  const onConnect = useCallback((params) => {
    const { source, target, sourceHandle, targetHandle } = params;

    const sourceNode = workspace.getNode(parseInt(source));
    const targetNode = workspace.getNode(parseInt(target));

    // Look up schema metadata
    const sourceSchema = nodeSchemas[sourceNode?.type];
    const targetSchema = nodeSchemas[targetNode?.type];

    const isVariableNode = sourceSchema?.category === "Variable";

    if (isVariableNode && targetHandle) {
      onVariableConnect(params);
      return;
    }

    // Normal connection flow
    const connectionType = sourceHandle || "default";

    workspace.connectNodes(parseInt(source), parseInt(target), connectionType);

    setEdges((eds = []) =>
      addEdge(
        {
          ...params,
          id: `${source}-${target}-${connectionType}`,
          label: connectionType,
          style: {
            stroke: config.ui.link.color,
            strokeWidth: config.ui.link.thickness,
          },
        },
        eds
      )
    );
  }, []);
  function onVariableConnect(params) {
    const { source, target, sourceHandle, targetHandle } = params;

    const sourceNode = workspace.getNode(parseInt(source));
    const targetNode = workspace.getNode(parseInt(target));
    const targetSchema = nodeSchemas[targetNode?.type];
    const targetField = targetSchema?.fields.find(
      (f) => f.key === targetHandle
    );

    const typeMap = {
      string: ["text", "textarea"],
      number: ["number"],
      boolean: ["select"],
    };

    const connectionType = sourceHandle || "default";
    const isCompatible =
      targetField && typeMap[connectionType]?.includes(targetField.type);

    if (!isCompatible) return;

    // Sync to backend
    workspace.connectNodes(parseInt(source), parseInt(target), connectionType);

    // Sync variable value into target field (frontend + backend)
    const variableValue = sourceNode?.data?.value;
    if (variableValue !== undefined) {
      updateNodeFieldFrontend(target, targetField.key, variableValue);
      workspace.updateNodeField(
        parseInt(target),
        targetField.key,
        variableValue
      );
    }

    setEdges((eds = []) =>
      addEdge(
        {
          ...params,
          sourceHandle, // ensure source handle is set
          targetHandle, // ensure target handle is set
          id: `${source}-${target}-${sourceHandle}-${targetHandle}`, // unique edge id
          label: sourceHandle, // show type on edge
          style: {
            stroke: config.ui.link.color,
            strokeWidth: config.ui.link.thickness,
          },
        },
        eds
      )
    );
  }

  function updateNodeFieldFrontend(nodeId, fieldKey, newValue) {
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
  }

  // calculate position and add new node to reactflow workspace
  const handleAddNode = (type) => {
    const schema = nodeSchemas[type];

    // Build default data from schema fields
    const defaultData = Object.fromEntries(
      schema.fields.map((f) => [f.key, f.options?.[0] || ""])
    );

    // Position must be an object for React Flow
    const position = { x: Math.random() * 400, y: Math.random() * 400 };

    // Add node to backend with new schema
    const backendId = workspace.addNode(type, defaultData, position, {
      inputs: [],
      outputs: [],
    });

    // Build frontend node object consistent with React Flow
    const newNode = {
      id: `${backendId}`,
      type: "custom",
      data: {
        label: `${schema.displayName} Node`,
        type,
        ...defaultData,
        onChange: createOnChange(backendId),
      },
      position, // object {x, y}
      connections: { inputs: [], outputs: [] }, // keep consistent with JSON schema
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // const handleImport = async () => {
  //   const importedNodes = await workspace.loadMacroFromDialog();
  //   if (!importedNodes.length) return;
  //   workspace.clearWorkspace();
  //   importedNodes.forEach((n) =>
  //     workspace.addNode(n.type, n.data, n.position, n.connections)
  //   );
  //   updateSceneFromBackend();
  // };

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
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#1c1f26]"
          >
            <Background color="#3a3d45" gap={24} size={1.8} />
            <MiniMap nodeColor={() => "#00bcd4"} maskColor="#1c1f26" />
            <Controls />
          </ReactFlow>

          <FloatingBar actions={actions} />
        </div>
      </div>
    </div>
  );
}
