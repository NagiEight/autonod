// workspaceManager.js

let nodes = [];
let nextId = 1; // Start from 1 and increment

// Add a new node
function addNode(type, data = {}) {
  const id = nextId++;
  const newNode = {
    id,
    type,
    data,
    connections: {
      in: [],
      out: []
    }
  };
  nodes.push(newNode);
  return id;
}

// Edit an existing node
function editNode(id, newData) {
  const node = nodes.find(n => n.id === id);
  if (node) {
    node.data = { ...node.data, ...newData };
    return true;
  }
  return false;
}

// Remove a node and clean up connections
function removeNode(id) {
  nodes = nodes.filter(n => n.id !== id);
  nodes.forEach(n => {
    n.connections.in = n.connections.in.filter(conn => conn !== id);
    n.connections.out = n.connections.out.filter(conn => conn !== id);
  });
}

// Connect two nodes
function connectNodes(fromId, toId) {
  const from = nodes.find(n => n.id === fromId);
  const to = nodes.find(n => n.id === toId);
  if (from && to) {
    if (!from.connections.out.includes(toId)) from.connections.out.push(toId);
    if (!to.connections.in.includes(fromId)) to.connections.in.push(fromId);
    return true;
  }
  return false;
}

// Disconnect two nodes
function disconnectNodes(fromId, toId) {
  const from = nodes.find(n => n.id === fromId);
  const to = nodes.find(n => n.id === toId);
  if (from && to) {
    from.connections.out = from.connections.out.filter(id => id !== toId);
    to.connections.in = to.connections.in.filter(id => id !== fromId);
    return true;
  }
  return false;
}

// Export workspace as JSON
function exportWorkspace() {
  return JSON.stringify(nodes, null, 2);
}

// Import workspace from JSON
function importWorkspace(json) {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      nodes = parsed;
      // Update nextId to avoid collisions
      const maxId = Math.max(0, ...nodes.map(n => n.id));
      nextId = maxId + 1;
      return true;
    }
  } catch (e) {
    console.error("Invalid workspace JSON:", e);
  }
  return false;
}

// Get node by ID
function getNode(id) {
  return nodes.find(n => n.id === id) || null;
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

// Export functions
module.exports = {
  addNode,
  editNode,
  removeNode,
  connectNodes,
  disconnectNodes,
  exportWorkspace,
  importWorkspace,
  getNode,
  getAllNodes,
  clearWorkspace
};
