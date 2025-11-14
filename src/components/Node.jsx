// components/Node.jsx
import React from "react";
import { Handle, Position } from "reactflow";
import InputField from "./InputField";
import HandleField from "./HandleField";
import { nodeSchemas } from "../utils/nodeSchemas";
import config from "../utils/config.json";

const positionMap = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

export default function Node({ data }) {
  const schema = nodeSchemas[data.type];
  if (!schema) return null;

  const { displayName, fields, handles } = schema;

  const handleFieldChange = (key, newValue) => {
    data.onChange?.(key, newValue);
  };

  return (
    <div className="relative bg-[#2a2d34] border border-[#3a3d45] rounded-md shadow px-4 py-3 text-sm text-gray-200 font-medium tracking-wide w-64">
      {/* Title Bar */}
      <div className="text-cyan-400 uppercase text-xs mb-2">
        {displayName} Node
      </div>

      {/* Main input handles (like End node) */}
      {handles?.input?.map((h) => (
        <Handle
          key={h.id}
          type="target"
          id={h.id}
          position={positionMap[h.position]}
          style={{
            background: h.color || "#9ca3af",
            width: config.ui.handle.size,
            height: config.ui.handle.size,
            borderRadius: config.ui.handle.radius,
            border: config.ui.handle.border,
            top: h.offset !== undefined ? `${h.offset}px` : "12px",
            left: -12,
          }}
        />
      ))}

      {/* Fields with per-field input handles */}
      <div className="space-y-3 mt-2">
        {fields.map((field) => (
          <InputField
            key={field.key}
            field={field}
            value={data[field.key] || ""}
            onChange={handleFieldChange}
          />
        ))}

        {/* Output HandleFields (structured outputs) */}
        {handles?.output?.map((h) => (
          <HandleField
            key={h.id}
            id={h.id}
            label={h.label || h.id}
            position={h.position || "right"}
            color={h.color || "#9ca3af"}
            offset={h.offset}
            size={config.ui.handle.size}
          />
        ))}
      </div>
    </div>
  );
}
