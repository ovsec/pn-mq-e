// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('mq', {
    put: () => ipcRenderer.invoke('mq:put'),
    logs: (callback) => ipcRenderer.on('update-logs', (_event, value) => callback(value))
})
contextBridge.exposeInMainWorld('input', {
    drop: (arr) => ipcRenderer.invoke('input:drop', arr),
    
})

