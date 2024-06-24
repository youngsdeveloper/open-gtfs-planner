import { GtfsRouteDao } from "./GtfsRouteDao";

export class SimulationOptionDao{

    id: Number
    route_id: Number
    route: GtfsRouteDao
    delta: Number
    active: Boolean

    constructor(
        id: Number, 
        route_id: Number, 
        route: GtfsRouteDao, 
        delta: Number, 
        active: Boolean
    ) {
        this.id = id
        this.route_id = route_id
        this.route = route
        this.delta = delta
        this.active = active
    }
    
    static fromObject(obj: any): SimulationOptionDao {
        return new SimulationOptionDao(obj.id, obj.route_id,
            GtfsRouteDao.fromObject(obj.route),
            obj.delta,
            obj.active
        );
    }

    static fromObjectToArray(obj: any): SimulationOptionDao[] {
        const data:SimulationOptionDao[] = [];
        if(obj){
            obj.forEach(s => data.push(this.fromObject(s)));
        }
        return data;
    }
}