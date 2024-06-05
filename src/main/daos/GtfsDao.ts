import { GtfsAgencyDao } from "./GtfsAgencyDao";
import { GtfsStopDao } from "./GtfsStopDao";

export class GtfsDao {
    
    filename: String;
    agencies: GtfsAgencyDao[];
    stops: GtfsStopDao[];

    constructor(filename: String, agencies: GtfsAgencyDao[], stops: GtfsStopDao[]){
        this.filename = filename;
        this.agencies = agencies;
        this.stops = stops;
    }
}