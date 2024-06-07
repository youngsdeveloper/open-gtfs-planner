"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GtfsAgencyDao = void 0;
class GtfsAgencyDao {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    static fromObject(obj) {
        return new GtfsAgencyDao(obj.id, obj.name);
    }
    static fromObjectToArray(obj) {
        const data = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }
}
exports.GtfsAgencyDao = GtfsAgencyDao;
