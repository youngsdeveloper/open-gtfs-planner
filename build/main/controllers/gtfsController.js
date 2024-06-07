"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require("sequelize");
const { sequelize } = require('../models');
const GtfsAgency = require("../models/gtfsagency")(sequelize, DataTypes);
const GtfsStop = require("../models/gtfsstop")(sequelize, DataTypes);
const Project = require("../models/project")(sequelize, DataTypes);
const GtfsFile = require('../models/gtfsfile')(sequelize, DataTypes);
function downloadProject(window, idProject) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(Project.associations);
        const project = yield Project.findOne({
            where: { id: idProject },
            include: ["gtfsFiles"]
        });
        console.log(project);
        console.log(project.gtfsFiles);
        //window.webContents.send('loaded-gtfs', gtfsDAO);
    });
}
module.exports = {
    downloadProject
};
