import moment from "moment";
import { GtfsStopDao } from "../daos/GtfsStopDao";
import { GtfsStopTimeDao } from "../daos/GtfsStopTimeDao";
import { GtfsRouteDao } from "../daos/GtfsRouteDao";

class SyncScheduleHelper{
    static median(array) {
        // Paso 1: Ordenar el arreglo
        array.sort((a, b) => a - b);

    
        // Paso 2: Determinar si el arreglo tiene un número impar o par de elementos
        const middle = Math.floor(array.length / 2);

        return array[middle];

    }

    static target(diffs:number[], avg){
        var target = 0;
        diffs.forEach(d => target += Math.abs(d-avg));
        return target;
        //Math.abs(avg-this.median(diffs));
    }
    
    static syncShedules(stop:GtfsStopDao, routesSelected:Number[], routesFixed:Number[]):SyncSoluction{

        const stoptimes = stop.stopTimes
            .filter(st => routesSelected.indexOf(st.trip.route.id)!=-1)
            .sort( st => st.getArrivalTimeInDate(new Date()).getTime())
            
       
        const diffs = GtfsStopTimeDao.getIntervalsArray(stoptimes);
        const avg = diffs.reduce((sum,diff) => sum+diff, 0)/diffs.length;
        const originalTarget = this.target(diffs, avg);

        var minTarget = originalTarget;
        var minSolution = 0;
        var minStopTimes = stoptimes;
        var minRoute = 0;

        var threeshold = 0;
        for(const r of routesSelected){
            const frec = stop.getFrecMedianByRoute(r);

            if(frec>threeshold){
                threeshold = frec;
            }
        }

        threeshold = threeshold/2; // Lo ponemos a la mitad...
        
        for(const r of routesSelected.filter(r2 => !routesFixed.includes(r2) )){
            
            for (let delta = -1*threeshold; delta <= threeshold; delta++) {
            
                const stopTimesToUpdate = GtfsStopTimeDao.fromObjectToArray(stoptimes);
    
                stopTimesToUpdate.forEach((st,index) => {
    
                    if(st.trip.route.id == r){
                        const newTime = moment(st.getArrivalTimeInDate(new Date())).add(delta,"minutes");
                        st.arrival_time = newTime.format("HH:mm:ss")
                        st.departure_time = newTime.format("HH:mm:ss");
                        stopTimesToUpdate[index] = st;
                    }
                })
    
    
                let diffsMod = GtfsStopTimeDao.getIntervalsArray(stopTimesToUpdate);
                //let target = Math.abs(avg-this.median(diffsMod));
                let target = this.target(diffsMod, avg);
    
                if(target<minTarget){
                    minTarget = target;
                    minSolution = delta;
                    minStopTimes = stopTimesToUpdate;
                    minRoute = r as number;
                }
    
            }
        }
        



        return {
            lineMod: minRoute,
            delta: minSolution,
            avgFrec: avg,
            route: null,
            stopTimes: minStopTimes
        }
    }
}

class SyncSoluction{
    lineMod!: Number;
    delta!: Number;
    avgFrec!: Number;
    route!: GtfsRouteDao|null;
    stopTimes!: GtfsStopTimeDao[]
}

export {
    SyncScheduleHelper,
    SyncSoluction
}