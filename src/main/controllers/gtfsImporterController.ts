import {dialog} from "electron";
import Papa from 'papaparse';

import {GtfsStopDao} from "../daos/GtfsStopDao";
import { GtfsDao } from "../daos/GtfsDao";
import { GtfsAgencyDao } from "../daos/GtfsAgencyDao";
import { Project } from "../models/project.model";
import { GtfsFile } from "../models/gtfsfile.model";
import { GtfsAgency } from "../models/gtfsagency.model";
import { GtfsStop } from "../models/gtfsstop.model";
import { GtfsRoute } from "../models/gtfsroute.model";
import { GtfsRouteDao } from "../daos/GtfsRouteDao";

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

        const routesDAO:GtfsRouteDao[] = [] as GtfsRouteDao[];
        gtfsData.routes.forEach(route => {
          routesDAO.push(GtfsRouteDao.fromObject(route));
        });

        const agenciesDAO:GtfsAgencyDao[] = [] as GtfsAgencyDao[];
        gtfsDB.agencies.forEach(a => {
            const routes_by_agency = routesDAO.filter(r => r.agency_id == a.id);
            agenciesDAO.push(new GtfsAgencyDao(a.name,a.id, routes_by_agency));
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

        

        console.log("test----")
        console.log(routesDAO);

        const gtfsDAO = new GtfsDao(gtfsDB.file.id, gtfsDB.file.filename, agenciesDAO, stospDao);

        window.webContents.send('loaded-gtfs', gtfsDAO);
      }
}

function parseGTFS(path){
  return {
    agencies: parseFile(path,"agency"),
    stops: parseFile(path,"stops"),
    routes: parseFile(path, "routes")
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
    const gtfsStop = {...stop, gtfs_stop_id: stop.stop_id, gtfs_file_id: gtfsFile.id};
    try {
      const stopInDb = await GtfsStop.create(gtfsStop);
      stops.push(stopInDb);
    } catch (error) {
    }
  }

  const routes = [] as GtfsRoute[];
  for(const route of gtfsData.routes){
    const gtfsRoute = {...route, agency_id: agencyMap[route.agency_id]}
    const routeInDb = await GtfsRoute.create(gtfsRoute);
    routes.push(routeInDb);
  }

  return {file: gtfsFile, agencies: agencies, stops: stops, routes: routes};
}

function parseFile(path, file){

  const csvData = fs.readFileSync(`${path}/${file}.txt`, 'utf8');

  // Parsea el archivo CSV usando Papa Parse
  const results = Papa.parse(csvData, {
      header: true
  });

  return results.data;
}


module.exports = {
    selectDirectory
};