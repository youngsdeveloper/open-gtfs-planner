import {dialog} from "electron";
import Papa from 'papaparse';

import {GtfsStopDao} from "../daos/GtfsStopDao";
import { GtfsDao } from "../daos/GtfsDao";
import { GtfsAgencyDao } from "../daos/GtfsAgencyDao";
import { Project } from "../models/project.model";
import { GtfsFile } from "../models/gtfsfile.model";
import { GtfsAgency } from "../models/gtfsagency.model";
import { GtfsStop } from "../models/gtfsstop.model";

const {DataTypes} = require("sequelize")


const fs = require('fs');

async function selectDirectory(window) {

      let result;

      try {
         result = await dialog
                              .showOpenDialog(window,{
                                properties: ['openDirectory'],
                                title: "Selecciona una carpeta para importar GTFS"
                              });
      } catch (err) {
        dialog.showErrorBox("Error al importar GTFS", "Ha ocurrido un error al seleccionar la ruta. Error: " + err)
      }

      if (!result.canceled && result.filePaths.length > 0) {

        const path = result.filePaths[0];
        
        const gtfsData = parseGTFS(path);


        const gtfsDB = await uploadGTFS(gtfsData, path);

        const agenciesDAO:GtfsAgencyDao[] = [] as GtfsAgencyDao[];
        gtfsDB.agencies.forEach(a => {
            agenciesDAO.push(new GtfsAgencyDao(a.id, a.name));
        });

        const stospDao:GtfsStopDao[] = [] as GtfsStopDao[];
        gtfsData.stops.forEach(stop => {
          stospDao.push(new GtfsStopDao(
                        stop.id,
                        stop.stop_id,
                        stop.stop_name,
                        stop.stop_lat,
                        stop.stop_lon,
                        stop.agency_id
                      ));
        });

        const gtfsDAO = new GtfsDao(gtfsDB.file.id, gtfsDB.file.filename, agenciesDAO, stospDao);

        window.webContents.send('loaded-gtfs', gtfsDAO);
      }
}

function parseGTFS(path){
  return {
    agencies: parseAgency(path),
    stops: parseStops(path)
  }
}

async function uploadGTFS(gtfsData, path){

  
  const [project,created] = await Project.findOrCreate({
    where: {
      name: "Initial Project"
    }
  });

  console.log(project);

  var filename = path.split("/").at(-1);
  
  const gtfsFile = await GtfsFile.create({project_id: project.id, filename: filename});

  const agencies = [] as GtfsAgency[];
  const agencyMap = {};
  for(const agency of gtfsData.agencies){
    const agencyInDb = await GtfsAgency.create({name: agency.agency_name, gtfs_agency_id: agency.agency_id, gtfs_file_id: gtfsFile.id})
    agencyMap[parseInt(agency.agency_id)] = agencyInDb.id;
    agencies.push(agencyInDb)
  }

  const stops = [] as GtfsStop[];
  for(const stop of gtfsData.stops){
    console.log(stop)
    const gtfsStop = {...stop, gtfs_stop_id: stop.stop_id, gtfs_file_id: gtfsFile.id};
    try {
      const stopInDb = await GtfsStop.create(gtfsStop);
      stops.push(stopInDb);
    } catch (error) {
      console.log(error);
    }
  }

  return {file: gtfsFile, agencies: agencies, stops: stops};
}


function parseAgency(path){

  const csvData = fs.readFileSync(`${path}/agency.txt`, 'utf8');

  // Parsea el archivo CSV usando Papa Parse
  const results = Papa.parse(csvData, {
      header: true
  });

  return results.data;
}

function parseStops(path){

  const csvData = fs.readFileSync(`${path}/stops.txt`, 'utf8');

  // Parsea el archivo CSV usando Papa Parse
  const results = Papa.parse(csvData, {
      header: true
  });

  return results.data;
}

module.exports = {
    selectDirectory
};