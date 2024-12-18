"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GtfsStopDao = void 0;
const GtfsStopTimeDao_1 = require("./GtfsStopTimeDao");
class GtfsStopDao {
    constructor(id, gtfs_stop_id, stop_name, stop_lat, stop_lon, agency_id) {
        this.fusedStopDao = null;
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
    getFrecAvgByRoute(route_id) {
        if (!this.stopTimes) {
            return null;
        }
        const date = new Date();
        const stopTimesRoutes = this.stopTimes.filter(st => st.trip.route.id == route_id);
        const diffs = GtfsStopTimeDao_1.GtfsStopTimeDao.getIntervalsArray(stopTimesRoutes);
        const sumDiffs = diffs.reduce((sum, diff) => sum + diff, 0);
        const avg = sumDiffs / diffs.length;
        return avg;
    }
    median(array) {
        // Paso 1: Ordenar el arreglo
        array.sort((a, b) => a - b);
        // Paso 2: Determinar si el arreglo tiene un número impar o par de elementos
        const middle = Math.floor(array.length / 2);
        if (array.length % 2 === 0) {
            // Si el arreglo tiene un número par de elementos
            return (array[middle - 1] + array[middle]) / 2;
        }
        else {
            // Si el arreglo tiene un número impar de elementos
            return array[middle];
        }
    }
    getFrecMedianByRoute(route_name) {
        if (!this.stopTimes) {
            return null;
        }
        const stopTimesRoutes = this.stopTimes.filter(st => st.trip.route.getRouteName() == route_name);
        const diffs = GtfsStopTimeDao_1.GtfsStopTimeDao.getIntervalsArray(stopTimesRoutes);
        return this.median(diffs);
    }
    isInHourPhase(route_id) {
        const frecMedian = this.getFrecMedianByRoute(route_id);
        if (frecMedian != null) {
            return 60 % Math.round(frecMedian) == 0; // Si la frecuencia mediana entre 60 es divisible... está en fase con la hora.
        }
        else {
            return false;
        }
    }
    static fromObject(obj) {
        return new GtfsStopDao(obj.id, obj.gtfs_stop_id, obj.stop_name, obj.stop_lat, obj.stop_lon, obj.agency_id);
    }
    static fromObjectToArray(obj) {
        const data = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }
    static sort(a, b) {
        return parseInt(a.getRouteName()) - parseInt(b.getRouteName());
    }
    static unique(stops) {
        var added = [];
        var stopsAdded = [];
        stops.forEach(s => {
            if (!added.includes(s.id)) {
                added.push(s.id);
                stopsAdded.push(s);
            }
        });
        return stopsAdded;
    }
}
exports.GtfsStopDao = GtfsStopDao;
