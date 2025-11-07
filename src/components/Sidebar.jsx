import React, { useState } from "react";
import { nodeSchemas } from "../utils/nodeSchemas";

export default function Sidebar({ onAddNode }) {
  const [search, setSearch] = useState("");
  const grouped = {};

  // Group nodes by category
  Object.entries(nodeSchemas).forEach(([key, schema]) => {
    if (!schema.displayName.toLowerCase().includes(search.toLowerCase()))
      return;
    if (!grouped[schema.category]) grouped[schema.category] = [];
    grouped[schema.category].push({ key, ...schema });
  });

  return (
    <aside className="w-64 bg-[#202225] p-4 border-r border-[#3a3d45] text-gray-300 overflow-y-auto h-screen">
      <h2 className="text-sm font-semibold mb-4 text-cyan-400">Node Library</h2>
      <input
        type="text"
        placeholder="Search nodes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-2 py-1 rounded bg-[#2a2d34] border border-[#3a3d45] text-sm text-gray-200"
      />
      {Object.entries(grouped).map(([category, nodes]) => (
        <div key={category} className="mb-4">
          <div className="text-xs uppercase text-gray-400 mb-2">{category}</div>
          <ul className="space-y-1">
            {nodes.map((node) => (
              <li
                key={node.key}
                className="bg-[#2a2d34] hover:bg-[#36393f] px-3 py-2 rounded cursor-pointer text-sm"
                onClick={() => onAddNode(node.key)}
              >
                {node.displayName}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
