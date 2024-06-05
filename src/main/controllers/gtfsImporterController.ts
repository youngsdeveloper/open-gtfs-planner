import {dialog} from "electron";
import Papa from 'papaparse';

import {GtfsStopDao} from "../daos/GtfsStopDao";
import { GtfsDao } from "../daos/GtfsDao";
import { GtfsAgencyDao } from "../daos/GtfsAgencyDao";

const {DataTypes} = require("sequelize")
const {sequelize} = require('../models')

const GtfsFile = require("../models/gtfsfile")(sequelize,DataTypes);
const GtfsAgency = require("../models/gtfsagency")(sequelize,DataTypes);
const GtfsStop = require("../models/gtfsstop")(sequelize,DataTypes);

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


        await uploadGTFS(gtfsData, path);

        const agenciesDAO:GtfsAgencyDao[] = [] as GtfsAgencyDao[];
        gtfsData.agencies.forEach(a => {
            agenciesDAO.push(new GtfsAgencyDao(a.agency_name));
        });

        const stospDao:GtfsStopDao[] = [] as GtfsStopDao[];
        gtfsData.stops.forEach(stop => {
          stospDao.push(new GtfsStopDao(
                        stop.stop_id,
                        stop.stop_name,
                        stop.stop_lat,
                        stop.stop_lon,
                        stop.agency_id
                      ));
        });

        const gtfsDAO = new GtfsDao(path.split("/").at(-1), agenciesDAO, stospDao);

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
  var fileName = path.split("/").at(-1);
  const gtfsFile = await GtfsFile.create({fileName: fileName});

  const agencyMap = {};
  for(const agency of gtfsData.agencies){
    const agencyInDb = await GtfsAgency.create({name: agency.agency_name, gtfs_agency_id: agency.agency_id, gtfs_file_id: gtfsFile.id})
    agencyMap[parseInt(agency.agency_id)] = agencyInDb.id;
  }

  for(const stop of gtfsData.stops){
    console.log(stop)
    const gtfsStop = {...stop, gtfs_stop_id: stop.stop_id, gtfs_file_id: gtfsFile.id};
    try {
      await GtfsStop.create(gtfsStop);

    } catch (error) {
      console.log(error);
    }
  }

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