import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';
import {GtfsStopDao} from "./daos/GtfsStopDao"

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  importGTFS: () => ipcRenderer.send("importGTFS"),
  addListener: (channel:string, listener:(event: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(channel, listener),
  onLoadedStops: (listener:(event: IpcRendererEvent, stops: GtfsStopDao[]) => void) => ipcRenderer.on("loaded-stops", listener),
})
