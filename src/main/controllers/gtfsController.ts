import {dialog} from "electron";
import Papa from 'papaparse';

import {GtfsStopDao} from "../daos/GtfsStopDao";
import { GtfsDao } from "../daos/GtfsDao";
import { GtfsAgencyDao } from "../daos/GtfsAgencyDao";
import { Project } from "../models/project.model";
import { GtfsFile } from "../models/gtfsfile.model";
import { GtfsAgency } from "../models/gtfsagency.model";
import { GtfsStop } from "../models/gtfsstop.model";
import { GtfsRoute } from "../models/gtfsroute.model";
import { GtfsCalendarDates } from "../models/gtfscalendardates.model";
import { GtfsTrip } from "../models/gtfstrip.model";
import { GtfsShape } from "../models/gtfsshape.model";
import { Op } from "sequelize";
import { GtfsShapeDao } from "../daos/GtfsShapeDao";




async function downloadProject(window, idProject) {

    const [project, created] = await Project.findOrCreate({
        where: { id: idProject, name: "Initial Project"},
        include: {
            model: GtfsFile,
            include: [
                {
                    model: GtfsAgency,
                    include: [
                        GtfsRoute
                    ]
                },
                {
                    model: GtfsStop
                },
                {
                    model: GtfsCalendarDates
                }
            ]
        }
    });

    window.webContents.send('loaded-project');


    for(const gtfsFile of project?.gtfsFiles!!){
        const DAO = GtfsDao.fromObject(gtfsFile);
        window.webContents.send('loaded-gtfs', DAO);
    }
}

async function downloadShapesByRoute(window, idRoute){

    const trips = await GtfsTrip.findAll({
        attributes: ['shape_id'],
        where: {
            route_id: idRoute
        }
    });

    let shapes_ids = trips.map(t => t.shape_id);

    shapes_ids = Array.from(new Set(shapes_ids));

    const shapes = await GtfsShape.findAll({
        where: {
            shape_id: {
                [Op.in]: shapes_ids
            }
        }
    })


    window.webContents.send('loaded-shapes', GtfsShapeDao.fromObjectToArray(shapes), idRoute);

}


module.exports = {
    downloadProject,
    downloadShapesByRoute
};