import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';
import { GtfsDao } from './daos/GtfsDao';
import { GtfsShapeDao } from './daos/GtfsShapeDao';
import { ProjectDao } from './daos/ProjectDao';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  importGTFS: () => ipcRenderer.send("importGTFS"),
  addListener: (channel:string, listener:(event: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(channel, listener),
  onLoadedGtfs: (listener:(event: IpcRendererEvent, gtfs: GtfsDao) => void) => ipcRenderer.on("loaded-gtfs", listener),
  onLoadedProject: (listener:(event: IpcRendererEvent, project: ProjectDao) => void) => ipcRenderer.on("loaded-project", listener),

  downloadCurrentProject: () => ipcRenderer.send("downloadCurrentProject"),
  downloadShapesByRoute: (route_id:Number) => ipcRenderer.send("downloadShapesByRoute",route_id),
  onLoadedShapes: (listener:(event: IpcRendererEvent, shapes: GtfsShapeDao[], route_id: Number) => void) => ipcRenderer.on("loaded-shapes", listener),
  deleteGtfs: (gtfs_id:Number) => ipcRenderer.send("deleteGTFS",gtfs_id),
  downloadTripsByServices: (servicesId:String[]) => ipcRenderer.send("downloadTripsByServices",servicesId),
  downloadStopByServices: (stopId:number, servicesId:String[]) => ipcRenderer.send("downloadStopByServices",stopId, servicesId),

  saveSimulationOption: (projectId:Number, routeId: Number, delta: Number) => ipcRenderer.send("saveSimulationOption", projectId, routeId, delta)

})
