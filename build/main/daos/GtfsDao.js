"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GtfsDao = void 0;
class GtfsDao {
    constructor(filename, agencies, stops) {
        this.filename = filename;
        this.agencies = agencies;
        this.stops = stops;
    }
}
exports.GtfsDao = GtfsDao;
