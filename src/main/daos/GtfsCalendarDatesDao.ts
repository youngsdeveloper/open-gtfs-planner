import { GtfsRouteDao } from "./GtfsRouteDao";

export class GtfsCalendarDatesDao {

    id: Number;
    service_id: string;
    date: Date;
    exception_type: Number;
    gtfs_file_id: Number;

    constructor(
        id: Number,
        service_id: string,
        date: Date,
        exception_type: Number,
        gtfs_file_id: Number
    ) {
        this.id = id
        this.service_id = service_id
        this.date = date
        this.exception_type = exception_type
        this.gtfs_file_id = gtfs_file_id
    }
    static fromObject(obj: any): GtfsCalendarDatesDao {
        return new GtfsCalendarDatesDao(obj.id, obj.service_id, obj.date, obj.exception_type, obj.gtfs_file_id);
    }

    static fromObjectToArray(obj: any): GtfsCalendarDatesDao[] {
        const data: GtfsCalendarDatesDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }
}