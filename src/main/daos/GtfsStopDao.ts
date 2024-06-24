import { GtfsStopTimeDao } from "./GtfsStopTimeDao";

export class GtfsStopDao {
    id: number;
    gtfs_stop_id: number;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
    agency_id: number;
    
    stopTimes!: GtfsStopTimeDao[];

    originalStopTimes!: GtfsStopTimeDao[];

    constructor(id:number,gtfs_stop_id: number, stop_name: string, stop_lat: number, stop_lon: number, agency_id: number) {
        this.id = id;
        this.gtfs_stop_id = gtfs_stop_id;
        this.stop_name = stop_name;
        this.stop_lat = stop_lat;
        this.stop_lon = stop_lon;
        this.agency_id = agency_id;
    }

    getStopInfo(): string {
        return `Stop ID: ${this.gtfs_stop_id}, Name: ${this.stop_name}, Location: (${this.stop_lat}, ${this.stop_lon}), Agency ID: ${this.agency_id}`;
    }

    getLatLng(): [number, number]{
        return [this.stop_lat, this.stop_lon]
    }

    getFrecAvgByRoute(route_id){
        if(!this.stopTimes){
            return null;
        }

        const date = new Date();

        const stopTimesRoutes = this.stopTimes.filter(st => st.trip.route.id == route_id);

        const diffs = GtfsStopTimeDao.getIntervalsArray(stopTimesRoutes);

        const sumDiffs = diffs.reduce((sum,diff) => sum+diff, 0);

        const avg = sumDiffs / diffs.length;

        return avg;

    }

    median(array) {
        // Paso 1: Ordenar el arreglo
        array.sort((a, b) => a - b);
    
        // Paso 2: Determinar si el arreglo tiene un número impar o par de elementos
        const middle = Math.floor(array.length / 2);
    
        if (array.length % 2 === 0) {
            // Si el arreglo tiene un número par de elementos
            return (array[middle - 1] + array[middle]) / 2;
        } else {
            // Si el arreglo tiene un número impar de elementos
            return array[middle];
        }
    }
    
    
    getFrecMedianByRoute(route_id){
        if(!this.stopTimes){
            return null;
        }

        const stopTimesRoutes = this.stopTimes.filter(st => st.trip.route.id == route_id);

        const diffs = GtfsStopTimeDao.getIntervalsArray(stopTimesRoutes);

        return this.median(diffs);
    }

    isInHourPhase(route_id){
        const frecMedian = this.getFrecMedianByRoute(route_id);
        if(frecMedian!=null){
            return 60%Math.round(frecMedian)==0; // Si la frecuencia mediana entre 60 es divisible... está en fase con la hora.
        }else{
            return false;
        }
    }

    static fromObject(obj: any): GtfsStopDao {
        return new GtfsStopDao(obj.id, obj.gtfs_stop_id, obj.stop_name, obj.stop_lat, obj.stop_lon, obj.agency_id);
    }

    static fromObjectToArray(obj: any): GtfsStopDao[] {
        const data:GtfsStopDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }


}