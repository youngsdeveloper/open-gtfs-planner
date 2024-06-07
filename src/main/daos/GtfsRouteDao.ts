export class GtfsRouteDao {

    id: Number;
    route_short_name: string
    route_long_name: string
    route_id: string
    agency_id: Number

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
    
    static fromObject(obj: any): GtfsRouteDao {
        return new GtfsRouteDao(obj.id, obj.route_short_name, obj.route_long_name, obj.route_id, obj.agency_id);
    }

    static fromObjectToArray(obj: any): GtfsRouteDao[] {
        const data: GtfsRouteDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }
}