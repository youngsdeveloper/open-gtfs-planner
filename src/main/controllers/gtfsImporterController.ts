import {dialog} from "electron";
import Papa from 'papaparse';

import {GtfsStopDao} from "../daos/GtfsStopDao";

const {DataTypes} = require("sequelize")
const {sequelize} = require('../models')

const GtfsStop = require("../models/gtfsstop")(sequelize,DataTypes);

const fs = require('fs');

function selectDirectory(window) {
    return  dialog
      .showOpenDialog(window,{
        properties: ['openDirectory'],
        title: "Selecciona una carpeta para importar GTFS"
      })
      .then(result => {
        if (!result.canceled && result.filePaths.length > 0) {

          const path = result.filePaths[0];
          
          const gtfsData = parseGTFS(path);

          window.webContents.send('nueva-capa', gtfsData.agencies[0].agency_name);


          const stopsAdded:GtfsStopDao[] = [] as GtfsStopDao[];
          gtfsData.stops.forEach(stop => {
            const gtfsStop = {...stop, gtfs_stop_id: stop.stop_id};
            GtfsStop.create(gtfsStop);
            stopsAdded.push(new GtfsStopDao(
                          stop.stop_id,
                          stop.stop_name,
                          stop.stop_lat,
                          stop.stop_lon,
                          stop.agency_id
                        ));
          });

          if(stopsAdded[0] instanceof GtfsStopDao){
            console.log("instancia!")
          }else {
            console.log("NO instancia!")
          }

          window.webContents.send('loaded-stops', stopsAdded);


        }
        })
       .catch(err => {
          dialog.showErrorBox("Error al importar GTFS", "Ha ocurrido un error al seleccionar la ruta. Error: " + err)
        });
}

function parseGTFS(path){
  return {
    agencies: parseAgency(path),
    stops: parseStops(path)
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