import { GtfsCalendarDatesDao } from "./GtfsCalendarDatesDao";

export class GtfsServiceDao {

    service_id: string;
    gtfs_file_id: Number;
    gtfs_file_name: String;

    constructor(service_id: string, gtfs_file_id: Number, gtfs_file_name: String) {
        this.service_id = service_id
        this.gtfs_file_id = gtfs_file_id
        this.gtfs_file_name = gtfs_file_name
    }
    static fromObject(obj: any): GtfsServiceDao {
        return new GtfsServiceDao(obj.service_id, obj.gtfs_file_id, obj.gtfs_file_name);
    }

    static fromObjectToArray(obj: any): GtfsServiceDao[] {
        const data: GtfsServiceDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }
}