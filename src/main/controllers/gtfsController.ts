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




async function downloadProject(window, idProject) {

    const project = await Project.findOne({
        where: { id: idProject },
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

    for(const gtfsFile of project?.gtfsFiles!!){
        const DAO = GtfsDao.fromObject(gtfsFile);
        window.webContents.send('loaded-gtfs', DAO);
    }
}


module.exports = {
    downloadProject
};