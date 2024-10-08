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
import sequelize from "sequelize";
import { GtfsStopTimeDao } from "../daos/GtfsStopTimeDao";
import { SimulationOptions } from "../models/simulationoptions.model";
import { ProjectDao } from "../daos/ProjectDao";
import { FusedStop } from "../models/fusedstop.model";




async function downloadProject(window, idProject) {

    const [project, created] = await Project.findOrCreate({
        where: { id: idProject, name: "Initial Project"},
        include: [
            {
                model: GtfsFile,
                include: [
                    {
                        model: GtfsAgency,
                        include: [
                            GtfsRoute
                        ],

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
            },
            {
                model: SimulationOptions,
                separate: true,
                include: [
                    {
                        model: GtfsRoute,
                    }
                ]
            },
            
            {
                model: FusedStop,
                separate: true
            }
        ]
    });

    console.log("GTFS Cargado...");

    window.webContents.send("loaded-project", ProjectDao.fromObject(project))
    window.webContents.send('end-loading');


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

            await GtfsStopTime.destroy({
                where: {
                    gtfs_file_id: gtfsFile.id,
                },
                hooks: false,
                individualHooks: false
            });

            console.log("Horarios eliminados");

            await GtfsTrip.destroy({
                where: {
                    gtfs_file_id: gtfsFile.id,

                },
                hooks: false,
                individualHooks: false

            });

            console.log("Viajes eliminados");

            
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
                model: GtfsRoute,
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


async function downloadStopByServices(window, stopId, servicesId){

    const trips = await GtfsTrip.findAll({
        attributes: ["id"],
        where: {
            service_id: {
                [Op.in]: servicesId
            }
        }
    });

    const tripsId = trips.map(t => t.id);

    const stopTimes = await GtfsStopTime.findAll({
        where: {
            trip_id: {
                [Op.in]: tripsId
            },
            stop_id: stopId
        },
        order: [
            ["arrival_time","ASC"]
        ],
        include: [
            {
                model: GtfsTrip,
                include: [
                    GtfsRoute
                ]
            },
            {
                model: GtfsStop
            }
        ]
    });

    window.webContents.send("stop_times_by_stop", GtfsStopTimeDao.fromObjectToArray(stopTimes));
}

async function downloadFusedStopByServices(window, fusedStopId, servicesId){


    const fusedStop = await FusedStop.findByPk(fusedStopId);
    if(!fusedStop){
        return;
    }

    const trips = await GtfsTrip.findAll({
        attributes: ["id"],
        where: {
            service_id: {
                [Op.in]: servicesId
            }
        }
    });

    const tripsId = trips.map(t => t.id);

    console.log(fusedStop.stop_2_id)

    const stopTimes = await GtfsStopTime.findAll({
        where: {
            trip_id: {
                [Op.in]: tripsId
            },
            stop_id: {
                [Op.in]: [fusedStop.stop_2_id, fusedStop.stop_1_id]
            }
        },
        order: [
            ["arrival_time","ASC"]
        ],
        include: [
            {
                model: GtfsTrip,
                include: [
                    GtfsRoute
                ]
            },
            {
                model: GtfsStop
            }
        ]
    });

    console.log(stopTimes.filter(st => st.stop_id != fusedStop.stop_1_id));


    stopTimes.filter(st => st.stop_id == fusedStop.stop_1_id).forEach(st => {
        if(st.trip.route.route_short_name){
            st.trip.route.route_short_name =  "1_" + st.trip.route.route_short_name;
        }else if(st.trip.route.route_long_name){
            st.trip.route.route_short_name =  "1_" + st.trip.route.route_long_name;
        }else if(st.trip.route.route_id){
            st.trip.route.route_short_name =  "1_" + st.trip.route.route_id;
        }
    });

    console.log(stopTimes.filter(st => st.stop_id == fusedStop.stop_2_id));

    stopTimes.filter(st => st.stop_id == fusedStop.stop_2_id).forEach(st => {
        if(st.trip.route.route_short_name){
            st.trip.route.route_short_name =  "2_" + st.trip.route.route_short_name;
        }else if(st.trip.route.route_long_name){
            st.trip.route.route_short_name =  "2_" + st.trip.route.route_long_name;
        }else if(st.trip.route.route_id){
            st.trip.route.route_short_name =  "2_" + st.trip.route.route_id;
        }
    });

    window.webContents.send("stop_times_by_stop", GtfsStopTimeDao.fromObjectToArray(stopTimes));
}

module.exports = {
    downloadProject,
    downloadShapesByRoute,
    deleteGTFS,
    downloadTripsByServices,
    downloadStopByServices,
    downloadFusedStopByServices
};