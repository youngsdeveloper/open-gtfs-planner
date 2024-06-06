"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GtfsDao = void 0;
const GtfsStopDao_1 = require("./GtfsStopDao");
class GtfsDao {
    constructor(id, filename, agencies, stops) {
        this.visible = true;
        this.id = id,
            this.filename = filename;
        this.agencies = agencies;
        this.stops = stops;
    }
    static fromObject(obj) {
        return new GtfsDao(obj.id, obj.filename, obj.agencies, GtfsStopDao_1.GtfsStopDao.fromObjectToArray(obj.stops));
    }
}
exports.GtfsDao = GtfsDao;
