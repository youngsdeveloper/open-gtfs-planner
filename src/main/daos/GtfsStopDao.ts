import { GtfsStopTimeDao } from "./GtfsStopTimeDao";

export class GtfsStopDao {
    id: number;
    gtfs_stop_id: number;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
    agency_id: number;
    
    stopTimes!: GtfsStopTimeDao[];

    constructor(id:number,gtfs_stop_id: number, stop_name: string, stop_lat: number, stop_lon: number, agency_id: number) {
        this.id = id;
        this.gtfs_stop_id = gtfs_stop_id;
        this.stop_name = stop_name;
        this.stop_lat = stop_lat;
        this.stop_lon = stop_lon;
        this.agency_id = agency_id;
    }

    getStopInfo(): string {
        return `Stop ID: ${this.gtfs_stop_id}, Name: ${this.stop_name}, Location: (${this.stop_lat}, ${this.stop_lon}), Agency ID: ${this.agency_id}`;
    }

    getLatLng(): [number, number]{
        return [this.stop_lat, this.stop_lon]
    }

    static fromObject(obj: any): GtfsStopDao {
        return new GtfsStopDao(obj.id, obj.gtfs_stop_id, obj.stop_name, obj.stop_lat, obj.stop_lon, obj.agency_id);
    }

    static fromObjectToArray(obj: any): GtfsStopDao[] {
        const data:GtfsStopDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }

}