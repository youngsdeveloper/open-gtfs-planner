import { GtfsAgencyDao } from "./GtfsAgencyDao";
import { GtfsStopDao } from "./GtfsStopDao";

export class GtfsDao {
    
    id: Number;
    filename: String;
    agencies: GtfsAgencyDao[];
    stops: GtfsStopDao[];
    visible: boolean = true;

    constructor(id:Number,filename: String, agencies: GtfsAgencyDao[], stops: GtfsStopDao[]){
        this.id = id,
        this.filename = filename;
        this.agencies = agencies;
        this.stops = stops;
    }

    static fromObject(obj: any): GtfsDao {
        return new GtfsDao(obj.id, obj.filename, obj.agencies, GtfsStopDao.fromObjectToArray(obj.stops));
    }
}