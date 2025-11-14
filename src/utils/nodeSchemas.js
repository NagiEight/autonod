export const nodeSchemas = {
  CheckTask: {
    displayName: 'Check Task',
    category: 'Logic',
    fields: [
      { key: 'process', label: 'Process Name', type: 'text' },
      { key: 'state', label: 'Expected State', type: 'select', options: ['running', 'not running'] },
    ],
    handles: {
      input: [{ id: 'in', position: 'left', color: 'gray' }],
      output: [
        { id: 'true', position: 'right', color: 'blue', offset: 20 },
        { id: 'false', position: 'right', color: 'yellow', offset: 80 },
      ],
    },
  },

  Start: {
    displayName: 'Start',
    category: 'System',
    fields: [],
    handles: {
      output: [{ id: 'done', position: 'right', color: 'gray' }],
    },
  },

  End: {
    displayName: 'End',
    category: 'System',
    fields: [],
    handles: {
      input: [{ id: 'in', position: 'left', color: 'gray' }],
    },
  },
String: {
  displayName: 'String',
  category: 'Variable',
  fields: [
    { key: 'value', label: 'String Value', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
    output: [{ id: 'string', position: 'right', color: 'cyan' }],
  },
},



  MouseAction: {
    displayName: 'Mouse Action',
    category: 'Input',
    fields: [
      { key: 'action', label: 'Action Type', type: 'select', options: ['click', 'press', 'release'] },
      { key: 'button', label: 'Mouse Button', type: 'select', options: ['left', 'right', 'middle'] },
      { key: 'x', label: 'X Coordinate', type: 'number' },
      { key: 'y', label: 'Y Coordinate', type: 'number' },
    ],
    handles: {
      input: [{ id: 'in', position: 'left', color: 'gray' }],
      output: [{ id: 'done', position: 'right', color: 'cyan' }],
    },
  },

  TypeText: {
    displayName: 'Type Text',
    category: 'Input',
    fields: [
      { key: 'text', label: 'Text to Type', type: 'textarea' },
      { key: 'delay', label: 'Delay Between Keystrokes (ms)', type: 'number' },
    ],
    handles: {
      input: [{ id: 'in', position: 'left', color: 'gray' }],
      output: [{ id: 'done', position: 'right', color: 'cyan' }],
    },
  },
};
