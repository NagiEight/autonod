// components/Node.jsx
import React from "react";
import { Handle, Position } from "reactflow";
import Field from "./Field";
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

  const { displayName, fields, handles, handleFields } = schema;

  const handleFieldChange = (key, newValue) => {
    data.onChange?.(key, newValue);
  };

  return (
    <div className="relative bg-[#2a2d34] border border-[#3a3d45] rounded-md shadow px-4 py-3 text-sm text-gray-200 font-medium tracking-wide w-64">
      {/* Input Handles */}
      {handles?.input?.map((h) => (
        <Handle
          key={h.id}
          type="target"
          id={h.id}
          position={positionMap[h.position]}
          style={{
            position: "absolute",
            top: h.offset !== undefined ? `${h.offset}px` : "50%",
            transform: h.offset !== undefined ? undefined : "translateY(-50%)",
            background: h.color || "#9ca3af",
            width: config.ui.handle.size,
            height: config.ui.handle.size,
            borderRadius: config.ui.handle.radius,
            border: config.ui.handle.border,
          }}
        />
      ))}

      {/* Node Title */}
      <div className="text-cyan-400 uppercase text-xs mb-2">
        {displayName} Node
      </div>

      {/* Fields */}
      <div className="space-y-3">
        {fields.map((field) => (
          <Field
            key={field.key}
            field={field}
            value={data[field.key] || ""}
            onChange={handleFieldChange}
          />
        ))}

        {/* Inline HandleFields */}
        {handleFields?.map((hf) => (
          <HandleField
            key={hf.id}
            id={hf.id}
            label={hf.label}
            position={hf.position || "right"}
            color={hf.color || "#9ca3af"}
          />
        ))}
      </div>
    </div>
  );
}
