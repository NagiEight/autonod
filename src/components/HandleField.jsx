import React from "react";
import { Handle, Position } from "reactflow";
import config from "../utils/config.json"; // assuming you have this

const positionMap = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

export default function HandleField({
  id,
  label,
  position = "right",
  color = "gray",
}) {
  return (
    <div className="flex items-center justify-end text-xs text-gray-300">
      <label className="text-gray-400">{label}</label>
      <div className="relative w-6 h-6 flex items-center justify-center">
        <Handle
          type="source"
          id={id}
          position={positionMap[position]}
          style={{
            position: "absolute",
            background: color,
            width: config.ui.handle.size,
            height: config.ui.handle.size,
            borderRadius: config.ui.handle.radius,
            border: config.ui.handle.border,
          }}
        />
      </div>
    </div>
  );
}
