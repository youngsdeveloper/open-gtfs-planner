import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';
import { GtfsDao } from './daos/GtfsDao';
import { GtfsShapeDao } from './daos/GtfsShapeDao';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  importGTFS: () => ipcRenderer.send("importGTFS"),
  addListener: (channel:string, listener:(event: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(channel, listener),
  onLoadedGtfs: (listener:(event: IpcRendererEvent, gtfs: GtfsDao) => void) => ipcRenderer.on("loaded-gtfs", listener),
  downloadCurrentProject: () => ipcRenderer.send("downloadCurrentProject"),
  downloadShapesByRoute: (route_id:Number) => ipcRenderer.send("downloadShapesByRoute",route_id),
  onLoadedShapes: (listener:(event: IpcRendererEvent, shapes: GtfsShapeDao[]) => void) => ipcRenderer.on("loaded-shapes", listener),

})
