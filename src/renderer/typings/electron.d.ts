import {IpcRendererEvent} from 'electron';
import { GtfsDao } from '../../main/daos/GtfsDao';


/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  sendMessage: (message: string) => void,
  importGTFS: ()=>void,
  addListener: (channel:string, listener:(event: IpcRendererEvent, ...args: any[]) => void)=>void,
  onLoadedGtfs: (listener:(event: IpcRendererEvent, gtfs: GtfsDao) => void) =>void
  downloadCurrentProject: ()=>void,

}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
