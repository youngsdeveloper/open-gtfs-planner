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
const GtfsFile = require('../models').GtfsFile;
function modelAssociationsToArray(model) {
    const result = [];
    if (typeof model !== 'object' || typeof model.associations !== 'object') {
        throw new Error("Model should be an object with the 'associations' property.");
    }
    Object.keys(model.associations).forEach((key) => {
        const association = {};
        // all needed information in the 'options' object
        if (model.associations[key].hasOwnProperty('options')) {
            association[key] = model.associations[key].options;
        }
        result.push(association);
    });
    return result;
}
function downloadProject(window, idProject) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("assocs: ");
        console.log(sequelize.models.Project);
        //console.log(modelAssociationsToArray(sequelize));
        const project = yield Project.findByPk(idProject, {
            include: [
                { all: true, nested: true } // Include all associations recursively
            ]
        });
        console.log(project);
        //window.webContents.send('loaded-gtfs', gtfsDAO);
    });
}
module.exports = {
    downloadProject
};
