import { GtfsDao } from "./GtfsDao";
import { SimulationOptionDao } from "./SimulationOptionDao";

export class ProjectDao{

    id: Number
    name: String
    gtfsFiles: GtfsDao[]
    simulationOptions: SimulationOptionDao[]

    constructor(
        id: Number, 
        name: String, 
        gtfsFiles: GtfsDao[], 
        simulationOptions: SimulationOptionDao[]
    ) {
        this.id = id
        this.name = name
        this.gtfsFiles = gtfsFiles
        this.simulationOptions = simulationOptions
    }


    static fromObject(obj: any): ProjectDao {
        return new ProjectDao(obj.id, obj.name,
                    GtfsDao.fromObjectToArray(obj.gtfsFiles),
                    SimulationOptionDao.fromObjectToArray(obj.simulationOptions)
                );
    }
}