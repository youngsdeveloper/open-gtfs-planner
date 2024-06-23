'use strict';

import { Model } from "sequelize";
import { Sequelize } from 'sequelize-typescript';
import { Project } from "./project.model";
import { GtfsFile } from "./gtfsfile.model";
import { GtfsAgency } from "./gtfsagency.model";
import { GtfsStop } from "./gtfsstop.model";
import { GtfsRoute } from "./gtfsroute.model";
import { GtfsCalendarDates } from "./gtfscalendardates.model";
import { GtfsTrip } from "./gtfstrip.model";
import { GtfsShape } from "./gtfsshape.model";
import { GtfsStopTime } from "./gtfsstoptime.model";
import { GtfsCalendar } from "./gtfscalendar.model";
import { SimulationOptions } from "./simulationoptions.model";

const config = require('../config/config.js');

const sequelize = new Sequelize({
  database: config.database,
  username: config.username,
  password: config.password,
  dialect: config.dialect,
  storage: config.storage
});




sequelize.addModels([Project, GtfsFile, GtfsAgency,GtfsStop, GtfsRoute,
                     GtfsCalendarDates, GtfsTrip, GtfsShape, GtfsStopTime,
                     GtfsCalendar, SimulationOptions]);


// Habilitar claves foráneas
sequelize.query("PRAGMA foreign_keys = ON;").then(() => {
  console.log("Foreign Key support is enabled.");
});

export default sequelize;
