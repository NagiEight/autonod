// utils/contextMenuConfig.js
import workspace from "./workspaceManager";

const contextMenuConfig = [
  {
    label: "Delete",
    action: (id) => {
      workspace.removeNode(id);
    },
  },
];

export default contextMenuConfig;
