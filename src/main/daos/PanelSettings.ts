import { GtfsStopDao } from "./GtfsStopDao";
import { GtfsTripDao } from "./GtfsTripDao";

export class PanelSettings{
    stopSelected!: GtfsStopDao | null
    tripSelected!: GtfsTripDao | null
}