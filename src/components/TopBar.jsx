// components/TopBar.jsx
import React from "react";

export default function TopBar() {
  const menuItems = ["File", "Edit", "View", "Window", "Help"];

  return (
    <header className="bg-[#2a2d34] px-4 py-2 flex space-x-6 text-gray-300 text-sm font-medium border-b border-[#3a3d45]">
      {menuItems.map((item) => (
        <div key={item} className="hover:text-cyan-400 cursor-pointer">
          {item}
        </div>
      ))}
    </header>
  );
}
