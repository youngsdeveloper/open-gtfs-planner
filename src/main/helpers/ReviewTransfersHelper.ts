import moment from "moment";
import { GtfsStopDao } from "../daos/GtfsStopDao";
import { GtfsStopTimeDao } from "../daos/GtfsStopTimeDao";
import { GtfsRouteDao } from "../daos/GtfsRouteDao";

class ReviewTransfersHelper{
    
    static reviewTransfers(stop:GtfsStopDao, from:Number,to:Number):ReviewTransfersSoluction[]{

        const stopTimes = stop.stopTimes
            .filter(st => [from,to].includes(st.trip.route.id))
            .sort(GtfsStopTimeDao.sort)


        var transferStopTimes = [] as ReviewTransfersSoluction[];

        var lastAddedIndex = 0;

        stopTimes.forEach( (st, index) => {

            if(st.trip.route.id == to){
                //Si es destino, se puede transbordar con todos los de atras....
                transferStopTimes.push({
                    st: st,
                    previewStopTimes: stopTimes.slice(lastAddedIndex,index).filter(st => st.trip.route.id == from)
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