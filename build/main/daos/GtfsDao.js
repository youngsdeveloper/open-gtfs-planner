"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GtfsDao = void 0;
const GtfsAgencyDao_1 = require("./GtfsAgencyDao");
const GtfsCalendarDao_1 = require("./GtfsCalendarDao");
const GtfsCalendarDatesDao_1 = require("./GtfsCalendarDatesDao");
const GtfsStopDao_1 = require("./GtfsStopDao");
class GtfsDao {
    constructor(id, filename, agencies, stops, calendarDates, calendar) {
        this.visible = true;
        this.stopsVisible = false;
        this.simulationVisble = false;
        this.id = id;
        this.filename = filename;
        this.agencies = agencies;
        this.stops = stops;
        this.calendarDates = calendarDates;
        this.calendar = calendar;
    }
    static fromObject(obj) {
        return new GtfsDao(obj.id, obj.filename, GtfsAgencyDao_1.GtfsAgencyDao.fromObjectToArray(obj.agencies), GtfsStopDao_1.GtfsStopDao.fromObjectToArray(obj.stops), GtfsCalendarDatesDao_1.GtfsCalendarDatesDao.fromObjectToArray(obj.calendarDates), GtfsCalendarDao_1.GtfsCalendarDao.fromObjectToArray(obj.calendar));
    }
}
exports.GtfsDao = GtfsDao;
