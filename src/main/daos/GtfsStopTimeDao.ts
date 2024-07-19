import { GtfsStopDao } from "./GtfsStopDao";
import { GtfsTripDao } from "./GtfsTripDao";

export class GtfsStopTimeDao {

    id: Number;
    arrival_time: string;
    departure_time: string;
    stop_sequence: Number;
    stop_headsign: string;
    pickup_type: Number;
    drop_off_type: Number;
    stop: GtfsStopDao;

    trip!: GtfsTripDao;


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
        const gtfsStopTimeDao =  new GtfsStopTimeDao(obj.id, obj.arrival_time,
            obj.departure_time, obj.stop_sequence, obj.stop_headsign,
            obj.pickup_type, obj.drop_off_type, GtfsStopDao.fromObject(obj.stop)
        );

        if(obj.trip){
            gtfsStopTimeDao.trip = GtfsTripDao.fromObject(obj.trip);
        }

        

        return gtfsStopTimeDao;
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

    getArrivalTimeInHoursMins(){
        const stopTimeArrivalHours = this.arrival_time.split(":")
        return `${stopTimeArrivalHours[0]}:${stopTimeArrivalHours[1]}`;
    }

    getHeadsign(){

        if(this.stop_headsign){
            return this.stop_headsign
        }

        if(this.trip.trip_headsign){
            return this.trip.trip_headsign;
        }

        return "-";
    }

    static getIntervalsArray(stopTimes:GtfsStopTimeDao[]){


        const stopTimesSorted = stopTimes.sort(GtfsStopTimeDao.sort);
        const diffs = [] as number[];

        for (let i = 1; i < stopTimesSorted.length; i++) {
            const diff = stopTimesSorted[i].getArrivalTimeInDate(new Date()).getTime() - stopTimesSorted[i - 1].getArrivalTimeInDate(new Date()).getTime();
            diffs.push(diff/1000/60);
        }

        return diffs; // Intervalos en minutos
    }

    static calculateIntervalInMinutes(s1:GtfsStopTimeDao, s2:GtfsStopTimeDao){
        return Math.round((s1.getArrivalTimeInDate(new Date()).getTime() - s2.getArrivalTimeInDate(new Date()).getTime())/1000/60)
    }


    static getStopTimesByHour(stopTimes: GtfsStopTimeDao[]){

        const stopTimesByHour = {};

        stopTimes.forEach(st => {
            const stopTimeArrivalHours =st.arrival_time.split(":")

            const hour = parseInt(stopTimeArrivalHours[0])

            if(hour in stopTimesByHour){
                stopTimesByHour[hour] = stopTimesByHour[hour] + 1
            }else{
                stopTimesByHour[hour] = 1
            }
        })

        return stopTimesByHour;
    }

    static sort(a:GtfsStopTimeDao,b:GtfsStopTimeDao){
        return a.getArrivalTimeInDate(new Date()).getTime()-b.getArrivalTimeInDate(new Date()).getTime();
    }

    

    
}