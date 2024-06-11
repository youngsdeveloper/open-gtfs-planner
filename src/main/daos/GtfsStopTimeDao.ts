export class GtfsStopTimeDao {

    id: Number;
    arrival_time: string;
    departure_time: string;
    stop_sequence: Number;
    stop_headsign: string;
    pickup_type: Number;
    drop_off_type: Number;

    constructor(
        id: Number, 
        arrival_time: string, 
        departure_time: string, 
        stop_sequence: Number, 
        stop_headsign: string, 
        pickup_type: Number, 
        drop_off_type: Number
    ) {
        this.id = id
        this.arrival_time = arrival_time
        this.departure_time = departure_time
        this.stop_sequence = stop_sequence
        this.stop_headsign = stop_headsign
        this.pickup_type = pickup_type
        this.drop_off_type = drop_off_type
    }    


    static fromObject(obj: any): GtfsStopTimeDao {
        return new GtfsStopTimeDao(obj.id, obj.arrival_time,
            obj.departure_time, obj.stop_sequence, obj.stop_headsign,
            obj.pickup_type, obj.drop_off_type
        );
    }

    static fromObjectToArray(obj: any): GtfsStopTimeDao[] {
        const data:GtfsStopTimeDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }

}