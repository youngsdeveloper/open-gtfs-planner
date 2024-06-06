"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GtfsStopDao = void 0;
class GtfsStopDao {
    constructor(id, gtfs_stop_id, stop_name, stop_lat, stop_lon, agency_id) {
        this.id = id;
        this.gtfs_stop_id = gtfs_stop_id;
        this.stop_name = stop_name;
        this.stop_lat = stop_lat;
        this.stop_lon = stop_lon;
        this.agency_id = agency_id;
    }
    getStopInfo() {
        return `Stop ID: ${this.gtfs_stop_id}, Name: ${this.stop_name}, Location: (${this.stop_lat}, ${this.stop_lon}), Agency ID: ${this.agency_id}`;
    }
    getLatLng() {
        return [this.stop_lat, this.stop_lon];
    }
    static fromObject(obj) {
        return new GtfsStopDao(obj.id, obj.gtfs_stop_id, obj.stop_name, obj.stop_lat, obj.stop_lon, obj.agency_id);
    }
    static fromObjectToArray(obj) {
        const data = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }
}
exports.GtfsStopDao = GtfsStopDao;
