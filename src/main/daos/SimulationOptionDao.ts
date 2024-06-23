import { GtfsRouteDao } from "./GtfsRouteDao";

export class SimulationOptionDao{

    id: Number
    route_id: Number
    route: GtfsRouteDao
    delta: Number

    constructor(
        id: Number, 
        route_id: Number, 
        route: GtfsRouteDao, 
        delta: Number
    ) {
        this.id = id
        this.route_id = route_id
        this.route = route
        this.delta = delta
    }
    
    static fromObject(obj: any): SimulationOptionDao {
        return new SimulationOptionDao(obj.id, obj.route_id,
            GtfsRouteDao.fromObject(obj.route),
            obj.delta
        );
    }

    static fromObjectToArray(obj: any): SimulationOptionDao[] {
        const data:SimulationOptionDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }
}