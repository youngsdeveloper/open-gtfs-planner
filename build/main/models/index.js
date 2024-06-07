'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("./project.model");
const gtfsfile_model_1 = require("./gtfsfile.model");
const gtfsagency_model_1 = require("./gtfsagency.model");
const gtfsstop_model_1 = require("./gtfsstop.model");
const gtfsroute_model_1 = require("./gtfsroute.model");
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const config = require('../config/config.js');
const sequelize = new sequelize_typescript_1.Sequelize({
    database: config.database,
    username: config.username,
    password: config.password,
    dialect: config.dialect,
    storage: config.storage
});
sequelize.addModels([project_model_1.Project, gtfsfile_model_1.GtfsFile, gtfsagency_model_1.GtfsAgency, gtfsstop_model_1.GtfsStop, gtfsroute_model_1.GtfsRoute]);
exports.default = sequelize;
