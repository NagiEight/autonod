import React from "react";
import menu from "../utils/topBarConfig"; // adjust path if needed
import { useState } from "react";
export default function TopBar() {
  const [openMenu, setOpenMenu] = useState(null);

  const handleClick = (item) => {
    if (item.action) {
      item.action();
      setOpenMenu(null); // close menu after action
    }
  };

  const toggleMenu = (section) => {
    setOpenMenu(openMenu === section ? null : section);
  };

  return (
    <header className="bg-[#2a2d34] px-4 py-2 flex space-x-6 text-gray-300 text-sm font-medium border-b border-[#3a3d45] relative z-50">
      {Object.entries(menu).map(([section, items]) => (
        <div key={section} className="relative">
          <div
            onClick={() => toggleMenu(section)}
            className={`cursor-pointer hover:text-cyan-400 ${
              openMenu === section ? "text-cyan-400" : ""
            }`}
          >
            {section}
          </div>

          {openMenu === section && items.length > 0 && (
            <div className="absolute left-0 top-full flex flex-col bg-[#2a2d34] border border-[#3a3d45] mt-1 rounded shadow-lg z-50 min-w-[160px] cursor-pointer">
              {items.map((item, idx) =>
                item.children ? (
                  <div key={item.label} className="relative group">
                    <div className="px-4 py-2 hover:bg-[#3a3d45] whitespace-nowrap">
                      {item.label}
                    </div>
                    <div className="absolute left-full top-0 hidden group-hover:flex flex-col bg-[#2a2d34] border border-[#3a3d45] rounded shadow-lg z-50 min-w-[140px]">
                      {item.children.map((sub, subIdx) => (
                        <div
                          key={subIdx}
                          onClick={() => handleClick(sub)}
                          className="px-4 py-2 hover:bg-[#3a3d45] whitespace-nowrap"
                        >
                          {sub.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    key={idx}
                    onClick={() => handleClick(item)}
                    className="px-4 py-2 hover:bg-[#3a3d45] whitespace-nowrap"
                  >
                    {item.label}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </header>
  );
}
