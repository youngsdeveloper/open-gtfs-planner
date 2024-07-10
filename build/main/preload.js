"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (message) => electron_1.ipcRenderer.send('message', message),
    importGTFS: () => electron_1.ipcRenderer.send("importGTFS"),
    addListener: (channel, listener) => electron_1.ipcRenderer.on(channel, listener),
    onLoadedGtfs: (listener) => electron_1.ipcRenderer.on("loaded-gtfs", listener),
    onLoadedProject: (listener) => electron_1.ipcRenderer.on("loaded-project", listener),
    downloadCurrentProject: () => electron_1.ipcRenderer.send("downloadCurrentProject"),
    downloadShapesByRoute: (route_id) => electron_1.ipcRenderer.send("downloadShapesByRoute", route_id),
    onLoadedShapes: (listener) => electron_1.ipcRenderer.on("loaded-shapes", listener),
    deleteGtfs: (gtfs_id) => electron_1.ipcRenderer.send("deleteGTFS", gtfs_id),
    downloadTripsByServices: (servicesId) => electron_1.ipcRenderer.send("downloadTripsByServices", servicesId),
    downloadStopByServices: (stopId, servicesId) => electron_1.ipcRenderer.send("downloadStopByServices", stopId, servicesId),
    saveSimulationOption: (projectId, routeId, delta, direction_id) => electron_1.ipcRenderer.send("saveSimulationOption", projectId, routeId, delta, direction_id),
    updateSimulationOption: (simulationOptions) => electron_1.ipcRenderer.send("updateSimulationOption", simulationOptions),
    downloadGTFSListNap: () => electron_1.ipcRenderer.send("downloadGTFSListNap"),
    downloadGTFSNap: (name, fileId) => electron_1.ipcRenderer.send("downloadGTFSNap", name, fileId),
    downloadGTFSNearStops: (lat, lng) => electron_1.ipcRenderer.send("downloadGTFSNearStops", lat, lng),
    saveFusedStop: (projectId, stop_1_id, stop_2_id) => electron_1.ipcRenderer.send("saveFusedStop", projectId, stop_1_id, stop_2_id),
    downloadStopFusedByServices: (stoFusedpId, servicesId) => electron_1.ipcRenderer.send("downloadStopFusedByServices", stoFusedpId, servicesId)
});
