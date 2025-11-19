import { nodeSchemas } from "./nodeSchemas";
import config from "./config.json";

/**
 * Converts a backend node to frontend React Flow node format
 * @param {Object} node - Backend node object
 * @param {Function} createOnChange - Callback factory for field changes
 * @returns {Object} Frontend node object
 */
export const convertToFrontendNode = (node, createOnChange) => {
  const schema = nodeSchemas[node.type];

  let position;
  if (
    node.position &&
    typeof node.position.x === "number" &&
    typeof node.position.y === "number"
  ) {
    position = { x: node.position.x, y: node.position.y };
    console.log(`[convertNode] Node ${node.id} position OK:`, position);
  } else if (Array.isArray(node.position) && node.position.length === 2) {
    const x = Number(node.position[0]);
    const y = Number(node.position[1]);
    position = { x, y };
    console.log(
      `[convertNode] Node ${node.id} position converted from array:`,
      node.position,
      "→",
      position,
      `(rounded? ${x !== node.position[0] || y !== node.position[1]})`
    );
  } else {
    position = { x: 100, y: 100 };
    console.warn(
      `[convertNode] Node ${node.id} missing position, defaulting to:`,
      position
    );
  }

  return {
    id: String(node.id),
    type: "custom",
    data: {
      ...node.data,
      type: node.type,
      label: `${schema?.displayName || node.type} Node`,
      onChange: createOnChange(node.id),
    },
    position,
    connections: node.connections || { inputs: [], outputs: [] },
  };
};

/**
 * Converts backend nodes to React Flow edges format
 * @param {Array} nodes - Array of backend nodes
 * @returns {Array} Array of edge objects for React Flow
 */
export const convertToEdges = (nodes) => {
  const newEdges = [];

  nodes.forEach((node) => {
    const sourceId = `${node.id}`;
    const outputs = node.connections?.outputs || [];

    outputs.forEach((conn) => {
      newEdges.push({
        id: `${sourceId}-${conn.nodeId}-${conn.type}`,
        source: sourceId,
        sourceHandle: conn.type,
        target: `${conn.nodeId}`,
        label: conn.type,
        style: {
          stroke: config.ui.link.color,
          strokeWidth: config.ui.link.thickness,
        },
      });
    });
  });

  return newEdges;
};
