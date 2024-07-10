import { GtfsShapeDao } from "./GtfsShapeDao";

export class GtfsRouteDao {

    visible: boolean = false;
    id: Number;
    route_short_name: string
    route_long_name: string
    route_id: string
    agency_id: Number

    shapes: GtfsShapeDao[] = [] as GtfsShapeDao[]

    stopsVisible: boolean = false;
    simulationVisible: boolean = false;


    constructor(
        id: Number,
        route_short_name: string,
        route_long_name: string,
        route_id: string,
        agency_id: Number
    ) {
        this.id = id
        this.route_short_name = route_short_name
        this.route_long_name = route_long_name
        this.route_id = route_id
        this.agency_id = agency_id
    }
    

    getRouteName(){
        if(this.route_short_name){
            return this.route_short_name;
        }

        return this.route_id;
    }
    static fromObject(obj: any): GtfsRouteDao {
        return new GtfsRouteDao(obj.id, obj.route_short_name, obj.route_long_name, obj.route_id, obj.agency_id);
    }

    static fromObjectToArray(obj: any): GtfsRouteDao[] {
        const data: GtfsRouteDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }

    static unique(routes: GtfsRouteDao[]){
        const uniques = [] as GtfsRouteDao[];

        const routesSelected = [] as String[];
        
        for(const r of routes){

            if(!routesSelected.includes(r.getRouteName())){
                routesSelected.push(r.getRouteName())
                uniques.push(r)
            }
            
        }

        return uniques;
    }
}