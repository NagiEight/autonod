export const nodeSchemas = {
  CheckTask: {
    displayName: "Check Task",
    category: "Logic",
    fields: [
      { key: "process", label: "Process Name", type: "text" },
      {
        key: "state",
        label: "Expected State",
        type: "select",
        options: ["running", "not running"],
      },
    ],
    handles: {
      input: [{ id: "in", position: "left", color: "gray" }],
      output: [
        { id: "true", position: "right", color: "blue", offset: 20 },
        { id: "false", position: "right", color: "yellow", offset: 80 },
      ],
    },
  },

  Start: {
    displayName: "Start",
    category: "System",
    fields: [],
    handles: {
      output: [{ id: "done", position: "right", color: "gray" }],
    },
  },

  End: {
    displayName: "End",
    category: "System",
    fields: [],
    handles: {
      input: [{ id: "in", position: "left", color: "gray" }],
    },
  },
  String: {
    displayName: "String",
    category: "Variable",
    fields: [{ key: "value", label: "String Value", type: "text" }],
    handles: {
      input: [{ id: "in", position: "left", color: "gray" }],
      output: [{ id: "string", position: "right", color: "cyan" }],
    },
  },

  MouseAction: {
    displayName: "Mouse Action",
    category: "Input",
    fields: [
      {
        key: "action",
        label: "Action Type",
        type: "select",
        options: ["click", "doubleClick", "press", "release", "move"],
      },
      {
        key: "button",
        label: "Mouse Button",
        type: "select",
        options: ["left", "right", "middle"],
      },
      {
        key: "x",
        label: "X Coordinate",
        type: "number",
      },
      {
        key: "y",
        label: "Y Coordinate",
        type: "number",
      },
      {
        key: "delay",
        label: "Delay Before Action (ms)",
        type: "number",
      },
      {
        key: "repeat",
        label: "Repeat Count",
        type: "number",
      },
    ],
    handles: {
      input: [{ id: "in", position: "left", color: "gray" }],
      output: [{ id: "done", position: "right", color: "cyan" }],
    },
  },
  TypeText: {
    displayName: "Type Text",
    category: "Input",
    fields: [
      { key: "text", label: "Text to Type", type: "textarea" },
      { key: "delay", label: "Delay Between Keystrokes (ms)", type: "number" },
    ],
    handles: {
      input: [{ id: "in", position: "left", color: "gray" }],
      output: [{ id: "done", position: "right", color: "cyan" }],
    },
  },
  WebLaunch: {
    displayName: "Web Launch",
    category: "Browser",
    fields: [
      {
        key: "url",
        label: "Website URL",
        type: "text",
      },
      {
        key: "newTab",
        label: "Open in New Tab",
        type: "checkbox",
      },
      {
        key: "browser",
        label: "Browser Choice",
        type: "select",
        options: ["default", "chrome", "firefox", "waterfox", "edge"],
      },
      {
        key: "wait",
        label: "Wait for Page Load (ms)",
        type: "number",
      },
      {
        key: "incognito",
        label: "Open in Incognito/Private Mode",
        type: "checkbox",
      },
      {
        key: "scroll",
        label: "Scroll to Position (px)",
        type: "number",
      },
    ],
    handles: {
      input: [{ id: "in", position: "left", color: "gray" }],
      output: [{ id: "done", position: "right", color: "cyan" }],
    },
  },
  Screenshot: {
    displayName: "Screenshot",
    category: "System",
    fields: [
      {
        key: "fileName",
        label: "Output File Name",
        type: "text",
      },
      {
        key: "x",
        label: "X Coordinate",
        type: "number",
      },
      {
        key: "y",
        label: "Y Coordinate",
        type: "number",
      },
      {
        key: "width",
        label: "Capture Width",
        type: "number",
      },
      {
        key: "height",
        label: "Capture Height",
        type: "number",
      },
    ],
    handles: {
      input: [{ id: "in", position: "left", color: "gray" }],
      output: [{ id: "done", position: "right", color: "cyan" }],
    },
  },
  Delay: {
    displayName: "Delay",
    category: "System",
    fields: [
      {
        key: "duration",
        label: "Delay Duration (ms)",
        type: "number",
      },
    ],
    handles: {
      input: [{ id: "in", position: "left", color: "gray" }],
      output: [{ id: "done", position: "right", color: "cyan" }],
    },
  },
};
