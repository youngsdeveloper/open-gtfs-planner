import { GtfsAgencyDao } from "./GtfsAgencyDao";
import { GtfsCalendarDao } from "./GtfsCalendarDao";
import { GtfsCalendarDatesDao } from "./GtfsCalendarDatesDao";
import { GtfsRouteDao } from "./GtfsRouteDao";
import { GtfsStopDao } from "./GtfsStopDao";

export class GtfsDao {

    id: Number;
    filename: String;
    agencies: GtfsAgencyDao[];
    stops: GtfsStopDao[];
    calendarDates: GtfsCalendarDatesDao[];
    calendar: GtfsCalendarDao[];
    visible: boolean = true;
    stopsVisible: boolean = false;
    simulationVisible: boolean = false;

    constructor(
        id: Number,
        filename: String,
        agencies: GtfsAgencyDao[],
        stops: GtfsStopDao[],
        calendarDates: GtfsCalendarDatesDao[],
        calendar: GtfsCalendarDao[]
    ) {
        this.id = id
        this.filename = filename
        this.agencies = agencies
        this.stops = stops
        this.calendarDates = calendarDates
        this.calendar = calendar
    }

    static fromObject(obj: any): GtfsDao {
        return new GtfsDao(obj.id, obj.filename,
            GtfsAgencyDao.fromObjectToArray(obj.agencies),
            GtfsStopDao.fromObjectToArray(obj.stops),
            GtfsCalendarDatesDao.fromObjectToArray(obj.calendarDates),
            GtfsCalendarDao.fromObjectToArray(obj.calendar)
        );
    }
}