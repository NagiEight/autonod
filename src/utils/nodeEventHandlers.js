import { nodeSchemas } from "./nodeSchemas";

/**
 * Creates a handler for adding new nodes to the workspace
 * @param {Object} workspace - Workspace manager instance
 * @param {Function} setNodes - React state setter for nodes
 * @returns {Function} Handler to add a node
 */
export const createAddNodeHandler = (workspace, setNodes, createOnChange) => {
  return (type) => {
    const schema = nodeSchemas[type];

    const defaultData = Object.fromEntries(
      schema.fields.map((f) => [f.key, f.options?.[0] || ""])
    );

    const position = { x: Math.random() * 400, y: Math.random() * 400 };

    const backendId = workspace.addNode(type, defaultData, position, {
      inputs: [],
      outputs: [],
    });

    const newNode = {
      id: `${backendId}`,
      type: "custom",
      data: {
        label: `${schema.displayName} Node`,
        type,
        ...defaultData,
        onChange: createOnChange(backendId),
      },
      position,
      connections: { inputs: [], outputs: [] },
    };

    setNodes((nds) => [...nds, newNode]);
  };
};

/**
 * Creates a handler for node position changes
 * @param {Object} workspace - Workspace manager instance
 * @returns {Function} Handler for node drag stop events
 */
export const createNodeDragStopHandler = (workspace) => {
  return (event, node) => {
    const success = workspace.editNodePosition(parseInt(node.id), node.position);
    if (success) {
      console.log(`[createOnPositionChange] Node ${node.id} moved to`, node.position);
    } else {
      console.warn(`[createOnPositionChange] Node ${node.id} not found`);
    }
  };
};
