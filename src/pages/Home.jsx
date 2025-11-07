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
import { addNode } from "../utils/workspaceManager";

const nodeTypes = { custom: Node };

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) =>
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
      ),
    []
  );

  const handleAddNode = (type) => {
    const schema = nodeSchemas[type];
    const defaultData = Object.fromEntries(
      schema.fields.map((f) => [f.key, f.options?.[0] || ""])
    );

    const newNode = {
      id: `${nodes.length + 1}`,
      type: "custom",
      data: {
        label: `${schema.displayName} Node`,
        type,
        ...defaultData,
        onChange: (key, value) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === newNode.id
                ? { ...n, data: { ...n.data, [key]: value } }
                : n
            )
          );
        },
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    setNodes((nds) => [...nds, newNode]);
  };

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
