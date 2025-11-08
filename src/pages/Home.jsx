// components/WorkflowPage.jsx
import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import Node from "../components/Node";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import { nodeSchemas } from "../utils/nodeSchemas";
import config from "../utils/config.json";
import workspaceManager from "../utils/workspaceManager";

const nodeTypes = { custom: Node };

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onNodeDragStop = (event, node) => {
    // Update backend with new position
    workspaceManager.editNodePosition(node.id, node.position);
  };

  const onConnect = useCallback((params) => {
    const { source, target } = params;

    // Backend sync
    workspaceManager.connectNodes(parseInt(source), parseInt(target));

    // Frontend update
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          style: {
            stroke: config.ui.link.color,
            strokeWidth: config.ui.link.thickness,
          },
        },
        eds
      )
    );
  }, []);

  const handleAddNode = (type) => {
    const schema = nodeSchemas[type];
    const defaultData = Object.fromEntries(
      schema.fields.map((f) => [f.key, f.options?.[0] || ""])
    );
    const position = { x: Math.random() * 400, y: Math.random() * 400 };

    // Backend first
    const backendId = workspaceManager.addNode(type, defaultData, position);

    // Frontend mirror
    const newNode = {
      id: `${backendId}`,
      type: "custom",
      data: {
        label: `${schema.displayName} Node`,
        type,
        ...defaultData,
        onChange: (key, value) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === `${backendId}`
                ? { ...n, data: { ...n.data, [key]: value } }
                : n
            )
          );
          workspaceManager.editNode(backendId, { [key]: value });
        },
      },
      position,
    };

    setNodes((nds) => [...nds, newNode]);
  };

  function updateSceneFromBackend() {
    const backendNodes = workspaceManager.getAllNodes();

    const frontendNodes = backendNodes.map((node) => {
      const schema = nodeSchemas[node.type];
      const defaultData = node.data;

      return {
        id: `${node.id}`,
        type: "custom",
        data: {
          label: `${schema.displayName} Node`,
          type: node.type,
          ...defaultData,
          onChange: (key, value) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === node.id
                  ? { ...n, data: { ...n.data, [key]: value } }
                  : n
              )
            );
            workspaceManager.editNode(node.id, { [key]: value });
          },
        },
        position: node.position || { x: 100, y: 100 }, // fallback if missing
      };
    });

    setNodes(frontendNodes);
  }
  return (
    <div className="h-screen w-screen bg-[#1c1f26] text-gray-200 font-sans flex flex-col overflow-hidden">
      <div className="h-16 bg-zinc-800 border-b border-zinc-700">
        <TopBar />
      </div>
      <div className="flex flex-1">
        <Sidebar onAddNode={handleAddNode} />
        <div className="flex-1 overflow-hidden">
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
        </div>
      </div>
    </div>
  );
}
