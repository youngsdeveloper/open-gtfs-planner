"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (message) => electron_1.ipcRenderer.send('message', message),
    importGTFS: () => electron_1.ipcRenderer.send("importGTFS"),
    addListener: (channel, listener) => electron_1.ipcRenderer.on(channel, listener),
    onLoadedGtfs: (listener) => electron_1.ipcRenderer.on("loaded-gtfs", listener),
    downloadCurrentProject: () => electron_1.ipcRenderer.send("downloadCurrentProject")
});
