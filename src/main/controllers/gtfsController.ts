import {dialog} from "electron";
import Papa from 'papaparse';

import {GtfsStopDao} from "../daos/GtfsStopDao";
import { GtfsDao } from "../daos/GtfsDao";
import { GtfsAgencyDao } from "../daos/GtfsAgencyDao";

const {DataTypes} = require("sequelize")
const {sequelize} = require('../models')

const GtfsAgency = require("../models/gtfsagency")(sequelize,DataTypes);
const GtfsStop = require("../models/gtfsstop")(sequelize,DataTypes);
const Project = require("../models/project")(sequelize,DataTypes);
const GtfsFile = require('../models/gtfsfile')(sequelize,DataTypes)



async function downloadProject(window, idProject) {

    console.log(Project.associations);


    const project = await Project.findOne({
        where: { id: idProject },
        include: ["gtfsFiles"]
    });

    console.log(project);
    console.log(project.gtfsFiles);

    //window.webContents.send('loaded-gtfs', gtfsDAO);
    
}


module.exports = {
    downloadProject
};