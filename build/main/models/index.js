'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("./project.model");
const gtfsfile_model_1 = require("./gtfsfile.model");
const gtfsagency_model_1 = require("./gtfsagency.model");
const gtfsstop_model_1 = require("./gtfsstop.model");
const gtfsroute_model_1 = require("./gtfsroute.model");
const gtfscalendardates_model_1 = require("./gtfscalendardates.model");
const gtfstrip_model_1 = require("./gtfstrip.model");
const gtfsshape_model_1 = require("./gtfsshape.model");
const gtfsstoptime_model_1 = require("./gtfsstoptime.model");
const config = require('../config/config.js');
const sequelize = new sequelize_typescript_1.Sequelize({
    database: config.database,
    username: config.username,
    password: config.password,
    dialect: config.dialect,
    storage: config.storage
});
sequelize.addModels([project_model_1.Project, gtfsfile_model_1.GtfsFile, gtfsagency_model_1.GtfsAgency, gtfsstop_model_1.GtfsStop, gtfsroute_model_1.GtfsRoute,
    gtfscalendardates_model_1.GtfsCalendarDates, gtfstrip_model_1.GtfsTrip, gtfsshape_model_1.GtfsShape, gtfsstoptime_model_1.GtfsStopTime]);
exports.default = sequelize;
