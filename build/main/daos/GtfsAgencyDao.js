"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GtfsAgencyDao = void 0;
const GtfsRouteDao_1 = require("./GtfsRouteDao");
class GtfsAgencyDao {
    constructor(name, id, routes) {
        this.name = name;
        this.id = id;
        this.routes = routes;
    }
    static fromObject(obj) {
        return new GtfsAgencyDao(obj.name, obj.id, GtfsRouteDao_1.GtfsRouteDao.fromObjectToArray(obj.routes));
    }
    static fromObjectToArray(obj) {
        const data = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }
}
exports.GtfsAgencyDao = GtfsAgencyDao;
