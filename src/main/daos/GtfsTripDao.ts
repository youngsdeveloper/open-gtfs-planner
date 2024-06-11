import { InterpolationHelper } from "../geo/InterpolationHelper";
import { GtfsStopTimeDao } from "./GtfsStopTimeDao";

export class GtfsTripDao {

    id: number;
    service_id: string;
    trip_id: string;
    trip_headsign: string;
    direction_id: Number;
    block_id: string;
    shape_id: string;
    route_id: string

    start_datetime!: Date;
    end_datetime!: Date;

    stopTimes: GtfsStopTimeDao[];

    constructor(
        id: number, 
        service_id: string, 
        trip_id: string, 
        trip_headsign: string, 
        direction_id: Number, 
        block_id: string, 
        shape_id: string, 
        route_id: string, 
        stopTimes: GtfsStopTimeDao[]
    ) {
        this.id = id
        this.service_id = service_id
        this.trip_id = trip_id
        this.trip_headsign = trip_headsign
        this.direction_id = direction_id
        this.block_id = block_id
        this.shape_id = shape_id
        this.route_id = route_id
        this.stopTimes = stopTimes


    }

    generateDatetimes(d:Date){

        if(this.stopTimes.length<1){
            return;
        }

        const startDatetime = new Date(d.getTime());
        const endDatetime = new Date(d.getTime());

        const firstStop = this.stopTimes[0];
        const lastStop = this.stopTimes.at(-1);

        const firstStopHours = firstStop.arrival_time.split(":").map(h => parseInt(h));
        const lastStopHours = lastStop!!.arrival_time.split(":").map(h => parseInt(h));

        startDatetime.setHours(firstStopHours[0],firstStopHours[1],firstStopHours[2])
        endDatetime.setHours(lastStopHours[0],lastStopHours[1],lastStopHours[2])

        this.start_datetime = startDatetime;
        this.end_datetime = endDatetime;
    }

    getCurrentPrevNextStop(d:Date){
        let index =0;
        for(const stopTime of this.stopTimes){

            const stopTimeArrival = stopTime.getArrivalTimeInDate(d);

            if(stopTimeArrival>d){
                if(this.stopTimes.at(index+1)!=undefined){
                    return {prev: stopTime, next: this.stopTimes.at(index+1)!!}
                }else{
                    return {prev: stopTime, next: null}
                }
            }
            index++;
        }
    }

    getCurrentPosition(d:Date){

        const currentStopTimes = this.getCurrentPrevNextStop(d);

        console.log("--");

        if(!currentStopTimes?.next){
            console.log("NO NEXT");

            return currentStopTimes?.prev.stop.getLatLng();
        }


        // Calculamos fraccion

        const datePrev = currentStopTimes.prev.getArrivalTimeInDate(d);
        const dateNext = currentStopTimes.next.getArrivalTimeInDate(d);

        const timePrev = datePrev.getTime();
        const timeNext = dateNext.getTime();
        const timeCurrent = d.getTime();

        const fraction = this.getFraction(timeCurrent, timePrev, timeNext);

      
        console.log("Hola");

        return InterpolationHelper.interpolateGeodetic(currentStopTimes?.prev.stop.getLatLng(), currentStopTimes?.next.stop.getLatLng(),fraction)
    }

    getFraction(timeCurrent, timePrev, timeNext){
        if (timeCurrent <= timePrev) return 0;
        if (timeCurrent >= timeNext) return 1;
      
        return (timeCurrent - timePrev) / (timeNext - timePrev);

    }


    isActiveInThisDate(d:Date){
        if(!this.start_datetime||!this.end_datetime){
            return false; // No se han generado los datetimes
        }

        return d >= this.start_datetime && d<=this.end_datetime;
    }


    static fromObject(obj: any): GtfsTripDao {
        return new GtfsTripDao(obj.id, obj.service_id, obj.trip_id, obj.trip_headsign, obj.direction_id,
            obj.block_id, obj.shape_id, obj.route_id,
            GtfsStopTimeDao.fromObjectToArray(obj.stopTimes)
        );
    }

    static fromObjectToArray(obj: any): GtfsTripDao[] {
        const data:GtfsTripDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }

}