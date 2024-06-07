import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';
import { GtfsDao } from './daos/GtfsDao';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  importGTFS: () => ipcRenderer.send("importGTFS"),
  addListener: (channel:string, listener:(event: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(channel, listener),
  onLoadedGtfs: (listener:(event: IpcRendererEvent, gtfs: GtfsDao) => void) => ipcRenderer.on("loaded-gtfs", listener),
  downloadCurrentProject: () => ipcRenderer.send("downloadCurrentProject")
})
