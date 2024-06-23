import { SimulationOptions } from "../models/simulationoptions.model"

async function saveSimulationOption(projectId, routeId, delta){

    const simOption = await SimulationOptions.create({
        project_id: projectId,
        route_id: routeId,
        delta: delta,
        active: true
    });

}

module.exports = {
    saveSimulationOption
}