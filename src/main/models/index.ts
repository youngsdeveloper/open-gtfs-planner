'use strict';

import { Model } from "sequelize";
import { Sequelize } from 'sequelize-typescript';
import { Project } from "./project.model";
import { GtfsFile } from "./gtfsfile.model";
import { GtfsAgency } from "./gtfsagency.model";
import { GtfsStop } from "./gtfsstop.model";
import { GtfsRoute } from "./gtfsroute.model";
import { GtfsCalendarDates } from "./gtfscalendardates.model";

const config = require('../config/config.js');

const sequelize = new Sequelize({
  database: config.database,
  username: config.username,
  password: config.password,
  dialect: config.dialect,
  storage: config.storage
});


sequelize.addModels([Project, GtfsFile, GtfsAgency,GtfsStop, GtfsRoute, GtfsCalendarDates]);

export default sequelize;
