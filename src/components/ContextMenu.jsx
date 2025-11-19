// components/ContextMenu.jsx
import React from "react";
import contextMenuConfig from "../utils/contextMenuConfig";

export default function ContextMenu({
  nodeId,
  position,
  onClose,
  updateScene,
}) {
  if (!position) return null;

  const style = {
    position: "absolute",
    top: `${position.y - 35}px`,
    left: `${position.x - 250}px`,
    background: "#2d2f36",
    border: "1px solid #444",
    borderRadius: "4px",
    padding: "4px 0",
    zIndex: 1000,
    minWidth: "140px",
  };

  return (
    <div style={style} onMouseLeave={onClose}>
      {contextMenuConfig.map((item) => (
        <div
          key={item.label}
          className="px-3 py-2 hover:bg-[#3a3d45] cursor-pointer text-sm text-gray-200"
          onClick={() => {
            item.action(nodeId);
            updateScene(); // <-- call the prop
            onClose();
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
