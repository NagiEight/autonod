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
  },
  handleFields: [
    { id: 'true', label: 'True', color: 'blue', offset: 20 },
    { id: 'false', label: 'False', color: 'yellow', offset: 80 },
  ],
},
Start: {
  displayName: 'Start',
  category: 'System',
  fields: [
  ],
  handles: {
  },
  handleFields: [
    { id: 'done', label: 'Start', color: 'gray'},
  ],
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
  },
  handleFields: [
    { id: 'done', label: 'Done', color: 'cyan' },
  ],
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
  },
  handleFields: [
    { id: 'done', label: 'Done', color: 'cyan' },
  ],
},

KeyAction: {
  displayName: 'Key Action',
  category: 'Input',
  fields: [
    { key: 'key', label: 'Key', type: 'text' },
    { key: 'action', label: 'Action Type', type: 'select', options: ['tap', 'press', 'release'] },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'done', label: 'Done', color: 'cyan' },
  ],
},

MoveMouse: {
  displayName: 'Move Mouse',
  category: 'Input',
  fields: [
    { key: 'x', label: 'Target X', type: 'number' },
    { key: 'y', label: 'Target Y', type: 'number' },
    { key: 'smooth', label: 'Smooth Movement', type: 'checkbox' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'done', label: 'Done', color: 'cyan' },
  ],
},

Scroll: {
  displayName: 'Scroll',
  category: 'Input',
  fields: [
    { key: 'direction', label: 'Direction', type: 'select', options: ['up', 'down', 'left', 'right'] },
    { key: 'amount', label: 'Scroll Amount (px)', type: 'number' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'done', label: 'Done', color: 'cyan' },
  ],
},
IfCondition: {
  displayName: 'If Condition',
  category: 'Logic',
  fields: [
    { key: 'variable', label: 'Variable Name', type: 'text' },
    { key: 'operator', label: 'Operator', type: 'select', options: ['==', '!=', '<', '>', '<=', '>='] },
    { key: 'value', label: 'Compare To', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'true', label: 'True', color: 'blue', offset: 20 },
    { id: 'false', label: 'False', color: 'yellow', offset: 80 },
  ],
},

CheckWindow: {
  displayName: 'Check Window',
  category: 'Logic',
  fields: [
    { key: 'title', label: 'Window Title', type: 'text' },
    { key: 'state', label: 'Expected State', type: 'select', options: ['open', 'focused'] },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'true', label: 'True', color: 'blue', offset: 20 },
    { id: 'false', label: 'False', color: 'yellow', offset: 80 },
  ],
},

CheckPixelColor: {
  displayName: 'Check Pixel Color',
  category: 'Logic',
  fields: [
    { key: 'x', label: 'X Coordinate', type: 'number' },
    { key: 'y', label: 'Y Coordinate', type: 'number' },
    { key: 'color', label: 'Expected Color (hex)', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'match', label: 'Match', color: 'blue', offset: 20 },
    { id: 'noMatch', label: 'No Match', color: 'yellow', offset: 80 },
  ],
},

WaitForTask: {
  displayName: 'Wait For Task',
  category: 'Logic',
  fields: [
    { key: 'process', label: 'Process Name', type: 'text' },
    { key: 'timeout', label: 'Timeout (ms)', type: 'number' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'ready', label: 'Ready', color: 'cyan' },
    { id: 'timeout', label: 'Timeout', color: 'gray', offset: 60 },
  ],
},

Loop: {
  displayName: 'Loop',
  category: 'Logic',
  fields: [
    { key: 'count', label: 'Repeat Count', type: 'number' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'body', label: 'Loop Body', color: 'cyan', offset: 20 },
    { id: 'done', label: 'Done', color: 'gray', offset: 80 },
  ],
},

BreakLoop: {
  displayName: 'Break Loop',
  category: 'Logic',
  fields: [],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'exit', label: 'Exit Loop', color: 'gray' },
  ],
},

Delay: {
  displayName: 'Delay',
  category: 'Logic',
  fields: [
    { key: 'duration', label: 'Delay (ms)', type: 'number' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'done', label: 'Done', color: 'cyan' },
  ],
},
LaunchApp: {
  displayName: 'Launch App',
  category: 'System',
  fields: [
    { key: 'path', label: 'Application Path', type: 'text' },
    { key: 'args', label: 'Arguments', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'done', label: 'Done', color: 'cyan' },
  ],
},

CloseApp: {
  displayName: 'Close App',
  category: 'System',
  fields: [
    { key: 'process', label: 'Process Name', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'done', label: 'Done', color: 'cyan' },
  ],
},

RunCommand: {
  displayName: 'Run Command',
  category: 'System',
  fields: [
    { key: 'command', label: 'Shell Command', type: 'textarea' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'done', label: 'Done', color: 'cyan' },
    { id: 'error', label: 'Error', color: 'red', offset: 60 },
  ],
},

TakeScreenshot: {
  displayName: 'Take Screenshot',
  category: 'System',
  fields: [
    { key: 'region', label: 'Region', type: 'select', options: ['full', 'window', 'custom'] },
    { key: 'path', label: 'Save Path', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'saved', label: 'Saved', color: 'cyan' },
  ],
},

LogMessage: {
  displayName: 'Log Message',
  category: 'Utility',
  fields: [
    { key: 'message', label: 'Message', type: 'textarea' },
    { key: 'level', label: 'Log Level', type: 'select', options: ['info', 'warning', 'error'] },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'logged', label: 'Logged', color: 'gray' },
  ],
},

SetVariable: {
  displayName: 'Set Variable',
  category: 'Utility',
  fields: [
    { key: 'name', label: 'Variable Name', type: 'text' },
    { key: 'value', label: 'Value', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'set', label: 'Set', color: 'cyan' },
  ],
},

GetVariable: {
  displayName: 'Get Variable',
  category: 'Utility',
  fields: [
    { key: 'name', label: 'Variable Name', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'value', label: 'Value', color: 'blue' },
  ],
},

ClipboardCopy: {
  displayName: 'Clipboard Copy',
  category: 'Utility',
  fields: [
    { key: 'text', label: 'Text to Copy', type: 'textarea' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'copied', label: 'Copied', color: 'cyan' },
  ],
},

ClipboardPaste: {
  displayName: 'Clipboard Paste',
  category: 'Utility',
  fields: [],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'text', label: 'Text', color: 'blue' },
  ],
},
ReadFile: {
  displayName: 'Read File',
  category: 'Data',
  fields: [
    { key: 'path', label: 'File Path', type: 'text' },
    { key: 'encoding', label: 'Encoding', type: 'select', options: ['utf-8', 'ascii', 'base64'] },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'content', label: 'Content', color: 'blue' },
  ],
},

WriteFile: {
  displayName: 'Write File',
  category: 'Data',
  fields: [
    { key: 'path', label: 'File Path', type: 'text' },
    { key: 'content', label: 'Content to Write', type: 'textarea' },
    { key: 'encoding', label: 'Encoding', type: 'select', options: ['utf-8', 'ascii', 'base64'] },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'saved', label: 'Saved', color: 'cyan' },
  ],
},

DownloadFile: {
  displayName: 'Download File',
  category: 'Data',
  fields: [
    { key: 'url', label: 'File URL', type: 'text' },
    { key: 'path', label: 'Save Path', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'downloaded', label: 'Downloaded', color: 'cyan' },
    { id: 'error', label: 'Error', color: 'red', offset: 60 },
  ],
},

UploadFile: {
  displayName: 'Upload File',
  category: 'Data',
  fields: [
    { key: 'path', label: 'File Path', type: 'text' },
    { key: 'url', label: 'Destination URL', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'uploaded', label: 'Uploaded', color: 'cyan' },
    { id: 'error', label: 'Error', color: 'red', offset: 60 },
  ],
},

HTTPGet: {
  displayName: 'HTTP GET',
  category: 'Data',
  fields: [
    { key: 'url', label: 'Request URL', type: 'text' },
    { key: 'headers', label: 'Headers (JSON)', type: 'textarea' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'response', label: 'Response', color: 'blue' },
    { id: 'error', label: 'Error', color: 'red', offset: 60 },
  ],
},

HTTPPost: {
  displayName: 'HTTP POST',
  category: 'Data',
  fields: [
    { key: 'url', label: 'Request URL', type: 'text' },
    { key: 'headers', label: 'Headers (JSON)', type: 'textarea' },
    { key: 'body', label: 'Body (JSON)', type: 'textarea' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'response', label: 'Response', color: 'blue' },
    { id: 'error', label: 'Error', color: 'red', offset: 60 },
  ],
},

ParseJSON: {
  displayName: 'Parse JSON',
  category: 'Data',
  fields: [
    { key: 'json', label: 'JSON Input', type: 'textarea' },
    { key: 'path', label: 'Path (e.g. user.name)', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'value', label: 'Value', color: 'blue' },
  ],
},

RegexMatch: {
  displayName: 'Regex Match',
  category: 'Data',
  fields: [
    { key: 'input', label: 'Input Text', type: 'textarea' },
    { key: 'pattern', label: 'Regex Pattern', type: 'text' },
    { key: 'group', label: 'Capture Group Index', type: 'number' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'match', label: 'Match', color: 'blue' },
    { id: 'noMatch', label: 'No Match', color: 'gray', offset: 60 },
  ],
},
AssertEqual: {
  displayName: 'Assert Equal',
  category: 'Debug',
  fields: [
    { key: 'a', label: 'Value A', type: 'text' },
    { key: 'b', label: 'Value B', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'pass', label: 'Pass', color: 'blue', offset: 20 },
    { id: 'fail', label: 'Fail', color: 'red', offset: 80 },
  ],
},

CaptureOutput: {
  displayName: 'Capture Output',
  category: 'Debug',
  fields: [
    { key: 'label', label: 'Capture Label', type: 'text' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'captured', label: 'Captured', color: 'cyan' },
  ],
},

DebugPause: {
  displayName: 'Debug Pause',
  category: 'Debug',
  fields: [
    { key: 'message', label: 'Pause Message', type: 'textarea' },
  ],
  handles: {
    input: [{ id: 'in', position: 'left', color: 'gray' }],
  },
  handleFields: [
    { id: 'resume', label: 'Resume', color: 'gray' },
  ],
}




};
