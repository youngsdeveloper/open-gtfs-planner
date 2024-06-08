import { GtfsAgencyDao } from "./GtfsAgencyDao";
import { GtfsCalendarDatesDao } from "./GtfsCalendarDatesDao";
import { GtfsRouteDao } from "./GtfsRouteDao";
import { GtfsStopDao } from "./GtfsStopDao";

export class GtfsDao {

    id: Number;
    filename: String;
    agencies: GtfsAgencyDao[];
    stops: GtfsStopDao[];
    calendarDates: GtfsCalendarDatesDao[];
    visible: boolean = true;

    constructor(
        id: Number,
        filename: String,
        agencies: GtfsAgencyDao[],
        stops: GtfsStopDao[],
        calendarDates: GtfsCalendarDatesDao[]
    ) {
        this.id = id
        this.filename = filename
        this.agencies = agencies
        this.stops = stops
        this.calendarDates = calendarDates
    }

    static fromObject(obj: any): GtfsDao {
        return new GtfsDao(obj.id, obj.filename,
            GtfsAgencyDao.fromObjectToArray(obj.agencies),
            GtfsStopDao.fromObjectToArray(obj.stops),
            GtfsCalendarDatesDao.fromObjectToArray(obj.calendarDates));
    }
}