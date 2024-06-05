import {IpcRendererEvent} from 'electron';
import { GtfsStopDao } from "../../../daos/GtfsStopDao"


/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  sendMessage: (message: string) => void,
  importGTFS: ()=>void,
  addListener: (channel:string, listener:(event: IpcRendererEvent, ...args: any[]) => void)=>void,
  onLoadedStops: (listener:(event: IpcRendererEvent, stops: GtfsStopDao[]) => void) =>void

}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
