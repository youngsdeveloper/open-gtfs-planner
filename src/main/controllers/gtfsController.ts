import {dialog} from "electron";
import Papa from 'papaparse';

import {GtfsStopDao} from "../daos/GtfsStopDao";
import { GtfsDao } from "../daos/GtfsDao";
import { GtfsAgencyDao } from "../daos/GtfsAgencyDao";
import { Project } from "../models/project.model";
import { GtfsAgency } from "../models/gtfsagency.model";
import { GtfsStop } from "../models/gtfsstop.model";
import { GtfsRoute } from "../models/gtfsroute.model";
import { GtfsCalendarDates } from "../models/gtfscalendardates.model";
import { GtfsTrip } from "../models/gtfstrip.model";
import { GtfsShape } from "../models/gtfsshape.model";
import { Op } from "sequelize";
import { GtfsShapeDao } from "../daos/GtfsShapeDao";
import { GtfsFile } from "../models/gtfsfile.model";
import { GtfsStopTime } from "../models/gtfsstoptime.model";
import { GtfsCalendar } from "../models/gtfscalendar.model";
import { GtfsTripDao } from "../daos/GtfsTripDao";




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
                    model: GtfsStop,
                    separate: true
                },
                {
                    model: GtfsCalendarDates,
                    separate: true

                },
                {
                    model: GtfsCalendar,
                    separate: true
                }
            ]
        }
    });

    console.log("GTFS Cargado...");

    window.webContents.send('loaded-project');

    if(project?.gtfsFiles){
        for(const gtfsFile of project?.gtfsFiles!!){
            const DAO = GtfsDao.fromObject(gtfsFile);
            window.webContents.send('loaded-gtfs', DAO);
        }
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

async function deleteGTFS(window, idGtfs) {
    const gtfsFile = await GtfsFile.findByPk(idGtfs);
    if(gtfsFile){
        try {

            const stops = await GtfsStop.findAll({
                attributes: ["id"],
                where:{
                    gtfs_file_id: gtfsFile.id
                }
            });

            const stopsId = stops.map( s => s.id);

            await GtfsStopTime.destroy({
                where: {
                    stop_id: {
                        [Op.in]: stopsId
                    }
                }
            });
            
            await gtfsFile.destroy();

            console.log("GTFS FILE eliminado");

            window.webContents.send('deleted-gtfs', idGtfs);
    
        } catch (error) {
            console.error(error);
        }
    } 
}


async function downloadTripsByServices(window, servicesId){

    const trips = await GtfsTrip.findAll({
        where: {
            service_id: {
                [Op.in]: servicesId
            }
        },
        include: [
            {
                model: GtfsRoute
            },
            {
                model: GtfsStopTime,
                include: [
                    GtfsStop
                ],
                separate: true
            }
        ]
    });

    

    window.webContents.send("trips_by_service", GtfsTripDao.fromObjectToArray(trips));

}

module.exports = {
    downloadProject,
    downloadShapesByRoute,
    deleteGTFS,
    downloadTripsByServices
};