import workspace from "./workspaceManager"; // or wherever your logic lives

const openURL = (url) => window.open(url, "_blank");

const topBarMenu = {
  File: [
    { label: "New", action: () => workspace.clearWorkspace() },
    { label: "Open", action: () => workspace.loadMacroFromDialog() },
    { label: "Save", action: () => workspace.saveFileDialog() },
    { label: "Record new", action: () => workspace.saveFileDialog() },
    //{ label: "Save as", action: () => console.log("Export file") },
    //{ label: "Export (API)", action: () => console.log("Export via API") }
  ],
  Edit: [
    { label: "Undo", action: () => console.log("Undo") },
    { label: "Redo", action: () => console.log("Redo") },
    { label: "Clear Workflow", action: () => workspace.clearWorkspace() },
    { label: "Clipspace", action: () => console.log("Clipspace") },
    { label: "Flush", action: () => console.log("Flush state") }
  ],
  View: [
    { label: "Sidebar", action: () => console.log("Toggle sidebar") },
    { label: "Minimap", action: () => console.log("Toggle minimap") },
    { label: "Node Links", action: () => console.log("Toggle links") },
    { label: "Viewport Panel", action: () => console.log("Toggle viewport") }
  ],
  // Theme: [
  //   { label: "Dark", action: () => console.log("Set theme: dark") },
  //   { label: "Light", action: () => console.log("Set theme: light") }
  // ],
  // Settings: [],
  // Extensions: [],
  // Help: [
  //   { label: "Issues", action: () => openURL("https://github.com/yourrepo/issues") },
  //   { label: "Docs", action: () => openURL("https://yourdocs.com") },
  //   { label: "Discord", action: () => openURL("https://discord.gg/yourserver") },
  //   { label: "Contact Support", action: () => console.log("Open support modal") },
  //   { label: "Reinstall", action: () => console.log("Reinstall app") },
  //   { label: "Check for Updates", action: () => console.log("Check updates") },
  //   {
  //     label: "Open Folder",
  //     children: [
  //       { label: "Macro", action: () => console.log("Open macro folder") },
  //       { label: "Extensions", action: () => console.log("Open extensions folder") },
  //       { label: "Report", action: () => console.log("Open report folder") }
  //     ]
  //   },
  //   { label: "Dev Tools", action: () => console.log("Open dev tools") },
  //   { label: "User Guide", action: () => openURL("https://yourdocs.com/user-guide") }
  // ]
};

export default topBarMenu;
