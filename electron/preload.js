const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld('api', {
  // File operations
  openFile: () => ipcRenderer.invoke('open-file-dialog'),
  openFolder: () => ipcRenderer.invoke('open-folder-dialog'),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
  saveFileAs: (content) => ipcRenderer.invoke('save-file-as', content),
  listFiles: (dirPath) => ipcRenderer.invoke('list-files', dirPath),

  // Terminal/Execution
  executeCommand: (command, args, cwd) => ipcRenderer.invoke('execute-command', command, args, cwd),
  compileCpp: (filePath) => ipcRenderer.invoke('compile-cpp', filePath),
  compileJava: (filePath) => ipcRenderer.invoke('compile-java', filePath),
  stopProcess: () => ipcRenderer.invoke('stop-process'),

  // App info
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),

  // Events
  onTerminalOutput: (callback) => {
    const listener = (event, data) => callback(data);
    ipcRenderer.on('terminal-output', listener);
    return () => ipcRenderer.removeListener('terminal-output', listener);
  },

  onProcessExit: (callback) => {
    const listener = (event, data) => callback(data);
    ipcRenderer.on('process-exit', listener);
    return () => ipcRenderer.removeListener('process-exit', listener);
  },
});
