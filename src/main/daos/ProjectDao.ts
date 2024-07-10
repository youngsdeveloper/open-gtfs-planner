import { FusedStopDao } from "./FusedStopDao";
import { GtfsDao } from "./GtfsDao";
import { SimulationOptionDao } from "./SimulationOptionDao";

export class ProjectDao{

    id: Number
    name: String
    gtfsFiles: GtfsDao[]
    simulationOptions: SimulationOptionDao[]
    fusedStops: FusedStopDao[]

    constructor(
        id: Number, 
        name: String, 
        gtfsFiles: GtfsDao[], 
        simulationOptions: SimulationOptionDao[],
        fusedStops: FusedStopDao[]
    ) {
        this.id = id
        this.name = name
        this.gtfsFiles = gtfsFiles
        this.simulationOptions = simulationOptions
        this.fusedStops = fusedStops;
    }


    static fromObject(obj: any): ProjectDao {
        return new ProjectDao(obj.id, obj.name,
                    GtfsDao.fromObjectToArray(obj.gtfsFiles),
                    SimulationOptionDao.fromObjectToArray(obj.simulationOptions),
                    FusedStopDao.fromObjectToArray(obj.fusedStops)
                );
    }
}