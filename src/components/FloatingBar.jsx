// components/FloatingBar.jsx
import React, { useRef, useEffect } from "react";

export default function FloatingBar({ actions }) {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      offsetX = e.clientX - bar.getBoundingClientRect().left;
      offsetY = e.clientY - bar.getBoundingClientRect().top;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      bar.style.left = `${e.clientX - offsetX}px`;
      bar.style.top = `${e.clientY - offsetY}px`;
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const dragHandle = bar.querySelector(".drag-handle");
    dragHandle.addEventListener("mousedown", handleMouseDown);

    return () => {
      dragHandle.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-6 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg p-3 flex flex-col gap-2 z-50"
      style={{ width: "fit-content", position: "fixed" }}
    >
      <div className="drag-handle cursor-move text-xs text-gray-400 px-2 py-1 border-b border-zinc-700">
        Drag here
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {Object.entries(actions).map(([label, handler]) => (
          <button
            key={label}
            onClick={handler}
            className="cursor-pointer px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-sm rounded text-white transition"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
