import { GtfsStopDao } from "./GtfsStopDao";

export class GtfsStopTimeDao {

    id: Number;
    arrival_time: string;
    departure_time: string;
    stop_sequence: Number;
    stop_headsign: string;
    pickup_type: Number;
    drop_off_type: Number;
    stop: GtfsStopDao

    constructor(
        id: Number, 
        arrival_time: string, 
        departure_time: string, 
        stop_sequence: Number, 
        stop_headsign: string, 
        pickup_type: Number, 
        drop_off_type: Number, 
        stop: GtfsStopDao
    ) {
        this.id = id
        this.arrival_time = arrival_time
        this.departure_time = departure_time
        this.stop_sequence = stop_sequence
        this.stop_headsign = stop_headsign
        this.pickup_type = pickup_type
        this.drop_off_type = drop_off_type
        this.stop = stop
    }


    static fromObject(obj: any): GtfsStopTimeDao {
        return new GtfsStopTimeDao(obj.id, obj.arrival_time,
            obj.departure_time, obj.stop_sequence, obj.stop_headsign,
            obj.pickup_type, obj.drop_off_type, GtfsStopDao.fromObject(obj.stop)
        );
    }

    static fromObjectToArray(obj: any): GtfsStopTimeDao[] {
        const data:GtfsStopTimeDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }

    getArrivalTimeInDate(d:Date){
        const stopTimeArrival = new Date(d);

        const stopTimeArrivalHours = this.arrival_time.split(":").map(h =>parseInt(h))
        stopTimeArrival.setHours(stopTimeArrivalHours[0],stopTimeArrivalHours[1],stopTimeArrivalHours[2])
        return stopTimeArrival;
    }


    
}