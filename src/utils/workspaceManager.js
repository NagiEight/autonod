import { invoke } from "@tauri-apps/api/core";
import { save,open } from "@tauri-apps/plugin-dialog";

let nodes = [];
let nextId = 1;
let sceneUpdater = null;

export function setSceneUpdater(fn) {
  sceneUpdater = fn;
}
async function run_workflow_from_file(){
      const path = await open({
      multiple: false,
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });
  const result = await invoke("run_current_workflow", {path});
}


async function saveFileDialog() {
  console.log("nodes to save:", nodes);
  try {
    const path = await save({
      defaultPath: "macros/my_flow.json",
      filters: [{ name: "JSON", extensions: ["json"] }],
    });

    if (path) {
      // Build export structure with current positions
      const exportNodes = nodes.map((n) => ({
        id: n.id,
        type: n.data.type || n.type, // keep type info
        data: n.data,
        position: { x: n.position.x, y: n.position.y }, // latest position
        connections: n.connections || { inputs: [], outputs: [] },
      }));

      console.log("Saving nodes with positions:", exportNodes);

      const content = JSON.stringify(exportNodes, null, 2);
      const message = await invoke("save_macro", { path, content });

      console.log("Saved to:", path);
      console.log(message);
    }
  } catch (err) {
    console.error("Save dialog failed:", err);
  }
}


export async function loadMacroFromDialog() {
  const nodes = await openFileDialog();
  if (!nodes?.length) return;

  clearWorkspace();
  nodes.forEach((n) => addNode(n.type, n.data, n.position, n.connections));

  if (sceneUpdater) sceneUpdater(); // update frontend
}


async function openFileDialog() {
  try {
    const path = await open({
      multiple: false,
      filters: [{ name: "JSON", extensions: ["json"] }],
    });

    if (!path) return null;

    const rawNodes = await invoke("load_macro", { path });

    if (!Array.isArray(rawNodes)) throw new Error("Invalid macro format");

    // Normalize for React Flow
    const nodes = rawNodes.map((n) => ({
      id: String(n.id),              // React Flow requires string IDs
      type: n.type,
      data: n.data || {},
      position: n.position || { x: 0, y: 0 }, // ensure position exists
      // If you want to keep connections, store them in data or custom field
      connections: n.connections || {},
    }));

    console.log("Loaded nodes with positions:", nodes);
    return nodes;
  } catch (err) {
    console.error("Open dialog failed:", err);
    return null;
  }
}


function addNode(
  type,
  data = {},
  position = [100, 100],
  connections = { inputs: [], outputs: [] }
) {
  const id = nextId++;
  const newNode = {
    id,
    type,
    data,
    position,
    connections
  };
  nodes.push(newNode);
    if (sceneUpdater) {
    sceneUpdater();
  }
  return id;
}

// Edit an existing node
function editNodeData(id, newData) {
  const node = nodes.find((n) => n.id === id);
  if (node) {
    node.data = { ...node.data, ...newData };
    return true;
  }
  return false;
}
// Edit an existing node's position
function editNodePosition(id, newPosition) {
  const node = nodes.find((n) => n.id === id);
  if (node) {
    // Ensure we preserve floats and valid structure
    node.position = {
      x: Number(newPosition.x),
      y: Number(newPosition.y),
    };
    return true;
  }
  return false;
}

// Remove a node and clean up connections
function removeNode(id) {
  id = parseInt(id);
  // Filter out the node with the given id
  nodes = nodes.filter((n) => n.id !== id);

  // If you also track edges, remove edges connected to this node
  if (typeof edges !== "undefined") {
    console.log(`Removing edges connected to node ${id}`);
    edges = edges.filter(
      (e) => e.source !== id && e.target !== id
    );
  }
    console.log(`Node ${id} removed. Remaining nodes:`, nodes);
  // Trigger frontend refresh if updater is set
  if (sceneUpdater) {
    sceneUpdater();
  }
}

// Connect two nodes
function connectNodes(fromId, toId, type = "default") {
  const from = nodes.find((n) => n.id === fromId);
  const to = nodes.find((n) => n.id === toId);

  if (from && to) {
    // Add output connection to "from" node
    if (!from.connections.outputs.some((c) => c.nodeId === toId && c.type === type)) {
      from.connections.outputs.push({ nodeId: toId, type });
    }

    // Add input connection to "to" node
    if (!to.connections.inputs.some((c) => c.nodeId === fromId && c.type === type)) {
      to.connections.inputs.push({ nodeId: fromId, type });
    }

    return true;
  }

  return false;
}


// Disconnect two nodes
function disconnectNodes(fromId, toId) {
  const from = nodes.find((n) => n.id === fromId);
  const to = nodes.find((n) => n.id === toId);
  if (from && to) {
    from.connections.out = from.connections.out.filter((id) => id !== toId);
    to.connections.in = to.connections.in.filter((id) => id !== fromId);
    return true;
  }
  return false;
}

// Export workspace as JSON string
function exportWorkspace() {
  return JSON.stringify(nodes, null, 2);
}

// Import workspace from JSON string
function importWorkspace(json) {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      nodes = parsed;
      nextId = Math.max(0, ...nodes.map((n) => n.id)) + 1;
      return true;
    }
  } catch (e) {
    console.error("Invalid workspace JSON:", e);
  }
  return false;
}

// Save workspace to disk via Tauri
async function saveMacro(path = "macros/my_flow.json") {
  try {
    const message = await invoke("save_macro", {
      path,
      nodes,
    });
    console.log(message);
  } catch (err) {
    console.error("Failed to save macro:", err);
  }
}

// Get node by ID
function getNode(id) {
  return nodes.find((n) => n.id === id) || null;
}

// Get all nodes
function getAllNodes() {
  return [...nodes];
}

// Clear workspace
function clearWorkspace() {
  nodes = [];
  nextId = 1;
}

function updateNodeField(nodeId, fieldKey, newValue) {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return;

  node.data[fieldKey] = newValue;
}

export default {
  saveFileDialog,
  addNode,
  editNodeData,
  removeNode,
  connectNodes,
  disconnectNodes,
  exportWorkspace,
  importWorkspace,
  getNode,
  getAllNodes,
  clearWorkspace,
  saveMacro,
  openFileDialog,
  loadMacroFromDialog,
  setSceneUpdater,run_workflow_from_file,updateNodeField,editNodePosition
};
