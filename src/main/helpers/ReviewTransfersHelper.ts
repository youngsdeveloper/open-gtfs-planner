import moment from "moment";
import { GtfsStopDao } from "../daos/GtfsStopDao";
import { GtfsStopTimeDao } from "../daos/GtfsStopTimeDao";
import { GtfsRouteDao } from "../daos/GtfsRouteDao";

class ReviewTransfersHelper{
    

    static getAvgReviewTransfers(sol:ReviewTransfersSoluction[]){
        

        var intervals = [] as number[];

        sol.forEach(s => {

            s.previewStopTimes.forEach( s2 => {
                intervals.push(Math.abs(GtfsStopTimeDao.calculateIntervalInMinutes(s.st,s2)))
            })
        })

        const sumIntervals = intervals.reduce((sum,diff) => sum+diff, 0);

        return sumIntervals/intervals.length;

    }
    static reviewTransfers(stop:GtfsStopDao, from:String,to:String,min:Number, max:Number, headlinesSelected: String[]):ReviewTransfersSoluction[]{

        console.log(headlinesSelected)
        const stopTimes = stop.stopTimes
            .filter(st => [from,to].includes(st.trip.route.getRouteName()))
            .filter(st => headlinesSelected.includes(st.getHeadsign()))
            .sort(GtfsStopTimeDao.sort)


        var transferStopTimes = [] as ReviewTransfersSoluction[];

        var lastAddedIndex = 0;

        stopTimes.forEach( (st, index) => {

            if(st.trip.route.getRouteName() == to){
                //Si es destino, se puede transbordar con todos los de atras....


                transferStopTimes.push({
                    st: st,
                    previewStopTimes: stopTimes
                                                .slice(lastAddedIndex,index)
                                                .filter(st => st.trip.route.getRouteName() == from)
                                                .filter(st2 => Math.abs(GtfsStopTimeDao.calculateIntervalInMinutes(st,st2)) >= (min as number))
                                                .filter(st2 => Math.abs(GtfsStopTimeDao.calculateIntervalInMinutes(st,st2)) <= (max as number))

                })

                lastAddedIndex = index;
            }

        })

        return transferStopTimes;;
    }
}

class ReviewTransfersSoluction{
    st!: GtfsStopTimeDao;
    previewStopTimes!: GtfsStopTimeDao[]
}

export {
    ReviewTransfersHelper,
    ReviewTransfersSoluction
}