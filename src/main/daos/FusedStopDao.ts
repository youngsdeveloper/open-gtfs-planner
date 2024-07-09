import { GtfsStopDao } from "./GtfsStopDao";

export class FusedStopDao {
    id: number;
    project_id: number;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;

    stop1!: GtfsStopDao
    stop2!: GtfsStopDao

    constructor(
        id: number, 
        project_id: number, 
        stop_name: string, 
        stop_lat: number, 
        stop_lon: number
    ) {
        this.id = id
        this.project_id = project_id
        this.stop_name = stop_name
        this.stop_lat = stop_lat
        this.stop_lon = stop_lon
    }    

    getLatLng(): [number, number]{
        return [this.stop_lat, this.stop_lon]
    }

    static fromObject(obj: any): FusedStopDao {
        return new FusedStopDao(obj.id, obj.project_id, obj.stop_name, obj.stop_lat, obj.stop_lon);
    }

    static fromObjectToArray(obj: any): FusedStopDao[] {
        const data:FusedStopDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }


}