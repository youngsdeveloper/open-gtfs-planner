import moment from "moment";
import { GtfsStopDao } from "../daos/GtfsStopDao";
import { GtfsStopTimeDao } from "../daos/GtfsStopTimeDao";
import { GtfsRouteDao } from "../daos/GtfsRouteDao";
import { GtfsTripDao } from "../daos/GtfsTripDao";
import { SimulationOptionDao } from "../daos/SimulationOptionDao";

class SimulationOptionsHelper{
    

    static middleware(simulationOptions:SimulationOptionDao[],trips: GtfsTripDao[]){
        for(const opt of simulationOptions.filter(opt => opt.active)){

            const tripsAffected = trips.filter( t => t.route.id == opt.route_id);

            for(var j=0;j<tripsAffected.length;j++){
                for(var k=0;k<tripsAffected[j].stopTimes.length;k++){
                    

                    var st = tripsAffected[j].stopTimes[k];


                    const newArrivalTime = moment(st.getArrivalTimeInDate(new Date())).add(opt.delta as number,"minutes");
                    const newDepartureTime = moment(st.getArrivalTimeInDate(new Date())).add(opt.delta as number,"minutes");

                    st.arrival_time = newArrivalTime.format("HH:mm:ss")
                    st.departure_time = newDepartureTime.format("HH:mm:ss")

                }
            }
        }
    }


    static middlewareST(simulationOptions:SimulationOptionDao[],stopTimes: GtfsStopTimeDao[]){


        for(const opt of simulationOptions.filter(opt => opt.active)){

            const stopTimesAffected = stopTimes.filter(st => st.trip.route.id == opt.route_id)

            for(var k=0;k<stopTimesAffected.length;k++){


                var st = stopTimesAffected[k];


                const newArrivalTime = moment(st.getArrivalTimeInDate(new Date())).add(opt.delta as number,"minutes");
                const newDepartureTime = moment(st.getArrivalTimeInDate(new Date())).add(opt.delta as number,"minutes");

                st.arrival_time = newArrivalTime.format("HH:mm:ss")
                st.departure_time = newDepartureTime.format("HH:mm:ss")

            }
        }
    }
}

export {
    SimulationOptionsHelper
}