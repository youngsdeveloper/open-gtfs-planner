import { GtfsRouteDao } from "./GtfsRouteDao";

export class GtfsCalendarDatesDao {

    id: Number;
    service_id: string;
    date: Date;
    exception_type: Number;

    constructor(
        id: Number,
        service_id: string,
        date: Date,
        exception_type: Number
    ) {
        this.id = id
        this.service_id = service_id
        this.date = date
        this.exception_type = exception_type
    }

    static fromObject(obj: any): GtfsCalendarDatesDao {
        return new GtfsCalendarDatesDao(obj.id, obj.service_id, obj.date, obj.exception_type);
    }

    static fromObjectToArray(obj: any): GtfsCalendarDatesDao[] {
        const data: GtfsCalendarDatesDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }
}