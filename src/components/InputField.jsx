// components/InputField.jsx
import React from "react";
import { Handle, Position } from "reactflow";
import Field from "./Field";
import config from "../utils/config.json";

export default function InputField({ field, value, onChange }) {
  return (
    <div className="flex items-center relative">
      {/* Input handle for this field */}
      <Handle
        type="target"
        id={field.key} // use field.key as unique handle id
        position={Position.Left}
        style={{
          background: field.color || "#9ca3af",
          width: config.ui.handle.size,
          height: config.ui.handle.size,
          borderRadius: config.ui.handle.radius,
          border: config.ui.handle.border,
          left: -12,
        }}
      />

      {/* Field itself */}
      <Field field={field} value={value} onChange={onChange} />
    </div>
  );
}
