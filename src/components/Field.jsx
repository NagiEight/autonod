// components/Field.jsx
import React from "react";

export default function Field({ field, value, onChange }) {
  const handleChange = (e) => onChange(field.key, e.target.value);

  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-400 mb-1">{field.label}</label>
      {field.type === "select" ? (
        <select
          value={value}
          onChange={handleChange}
          className="w-full bg-[#2a2d34] border border-[#3a3d45] text-sm text-gray-200 px-2 py-1 rounded"
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={handleChange}
          className="w-full bg-[#2a2d34] border border-[#3a3d45] text-sm text-gray-200 px-2 py-1 rounded"
        />
      )}
    </div>
  );
}
