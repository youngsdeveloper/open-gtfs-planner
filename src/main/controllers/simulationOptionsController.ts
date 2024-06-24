import { Identifier } from "sequelize";
import { SimulationOptionDao } from "../daos/SimulationOptionDao";
import { GtfsRoute } from "../models/gtfsroute.model";
import { SimulationOptions } from "../models/simulationoptions.model"

async function saveSimulationOption(window, projectId, routeId, delta){

    const simOption = await SimulationOptions.create({
        project_id: projectId,
        route_id: routeId,
        delta: delta,
        active: true
    });

    const simInDb = await SimulationOptions.findByPk(simOption.id,{
        include: {
            model: GtfsRoute
        }
    });
    
    window.webContents.send("new_simulation_option",SimulationOptionDao.fromObject(simInDb));

}

async function updateSimulationOption(window, simulationOptions){


    const simOptions = SimulationOptionDao.fromObjectToArray(saveSimulationOption);

    for(const option of simOptions){
        const optionDB = await SimulationOptions.findByPk(option.id as Identifier);
        if(optionDB){
            if(optionDB.active!=option.active){
                optionDB.active = option.active;
                optionDB.save()
            }
        }

    }
}



module.exports = {
    saveSimulationOption,
    updateSimulationOption
}