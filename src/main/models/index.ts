'use strict';

import { Model } from "sequelize";
import { Sequelize } from 'sequelize-typescript';
import { Project } from "./project.model";
import { GtfsFile } from "./gtfsfile.model";
import { GtfsAgency } from "./gtfsagency.model";
import { GtfsStop } from "./gtfsstop.model";

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const config = require('../config/config.js');

const sequelize = new Sequelize({
  database: config.database,
  username: config.username,
  password: config.password,
  dialect: config.dialect,
  storage: config.storage
});


sequelize.addModels([Project, GtfsFile, GtfsAgency,GtfsStop]);

export default sequelize;
