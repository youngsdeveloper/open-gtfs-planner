import { GtfsRouteDao } from "./GtfsRouteDao";

export class GtfsAgencyDao {

    name: string
    id: Number;
    routes: GtfsRouteDao[];

    constructor(name: string, id: Number, routes: GtfsRouteDao[]) {
        this.name = name
        this.id = id
        this.routes = routes
    }

    static fromObject(obj: any): GtfsAgencyDao {
        return new GtfsAgencyDao(obj.name,obj.id,GtfsRouteDao.fromObjectToArray(obj.routes));
    }

    static fromObjectToArray(obj: any): GtfsAgencyDao[] {
        const data: GtfsAgencyDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }
}