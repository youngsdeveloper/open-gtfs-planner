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
const GtfsFile = require('../models').GtfsFile;


function modelAssociationsToArray(model) {
  const result:any[] = [];

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

async function downloadProject(window, idProject) {

    console.log("assocs: ");
    console.log(sequelize.models.Project)
    //console.log(modelAssociationsToArray(sequelize));

    const project = await Project.findByPk(idProject, { 
        include: [
          { all: true, nested: true } // Include all associations recursively
        ]
      });


      
            
      
    
    console.log(project)

    //window.webContents.send('loaded-gtfs', gtfsDAO);
    
}


module.exports = {
    downloadProject
};