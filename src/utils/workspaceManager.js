import { invoke } from "@tauri-apps/api/core";
import { save,open } from "@tauri-apps/plugin-dialog";

let nodes = [];
let nextId = 1;

// Save workspace to a user-selected file
async function saveFileDialog() {
  try {
    const path = await save({
      defaultPath: "macros/my_flow.json",
      filters: [{ name: "JSON", extensions: ["json"] }],
    });

    if (path) {
      const content = JSON.stringify(nodes, null, 2); // frontend handles formatting
      const message = await invoke("save_macro", { path, content });
      console.log("Saved to:", path);
      console.log(message);
    }
  } catch (err) {
    console.error("Save dialog failed:", err);
  }
}

let sceneUpdater = null;

export function setSceneUpdater(fn) {
  sceneUpdater = fn;
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
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });

    if (!path) return null;

    const nodes = await invoke('load_macro', { path });

    // Optional: validate structure
    if (!Array.isArray(nodes)) throw new Error("Invalid macro format");
    return nodes;
  } catch (err) {
    console.error("Open dialog failed:", err);
    return null;
  }
}

function addNode(type, data = {}, position = { x: 100, y: 100 }, connections = { in: [], out: [] }) {
  const id = nextId++;
  const newNode = {
    id,
    type,
    data,
    position,
    connections
  };
  nodes.push(newNode);
  return id;
}


// Edit an existing node
function editNode(id, newData) {
  const node = nodes.find((n) => n.id === id);
  if (node) {
    node.data = { ...node.data, ...newData };
    return true;
  }
  return false;
}

// Remove a node and clean up connections
function removeNode(id) {
  nodes = nodes.filter((n) => n.id !== id);
  nodes.forEach((n) => {
    n.connections.in = n.connections.in.filter((conn) => conn !== id);
    n.connections.out = n.connections.out.filter((conn) => conn !== id);
  });
}

// Connect two nodes
function connectNodes(fromId, toId) {
  const from = nodes.find((n) => n.id === fromId);
  const to = nodes.find((n) => n.id === toId);
  if (from && to) {
    if (!from.connections.out.includes(toId)) from.connections.out.push(toId);
    if (!to.connections.in.includes(fromId)) to.connections.in.push(fromId);
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

export default {
  saveFileDialog,
  addNode,
  editNode,
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
  setSceneUpdater,
};
