import {dialog} from "electron";
import Papa from 'papaparse';

const models = require('../models')
const GtfsStop = models.gtfs_stop

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


          gtfsData.stops.forEach(stop => {
            GtfsStop.create(stop);
          });

          console.log(gtfsData);
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