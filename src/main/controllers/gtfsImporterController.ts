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
import { GtfsCalendarDates } from "../models/gtfscalendardates.model";
import { GtfsCalendarDatesDao } from "../daos/GtfsCalendarDatesDao";
import { GtfsTrip } from "../models/gtfstrip.model";
import { GtfsShape } from "../models/gtfsshape.model";
import { GtfsStopTime } from "../models/gtfsstoptime.model";

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
        gtfsDB.routes.forEach(route => {
          routesDAO.push(GtfsRouteDao.fromObject(route));
        });


        const agenciesDAO:GtfsAgencyDao[] = [] as GtfsAgencyDao[];
        gtfsDB.agencies.forEach(a => {
            const routes_by_agency = routesDAO.filter(r => r.agency_id == a.id);
            agenciesDAO.push(new GtfsAgencyDao(a.name,a.id, routes_by_agency));
        });


        const stospDao:GtfsStopDao[] = [] as GtfsStopDao[];
        gtfsDB.stops.forEach(stop => {
          stospDao.push(GtfsStopDao.fromObject(stop));
        }); 

        const calendarDatesDao:GtfsCalendarDatesDao[] = [] as GtfsCalendarDatesDao[];
        gtfsDB.calendarDates.forEach(calendarDate => {
          calendarDatesDao.push(GtfsCalendarDatesDao.fromObject(calendarDate));
        });

        
        const gtfsDAO = new GtfsDao(gtfsDB.file.id, gtfsDB.file.filename, agenciesDAO, stospDao, calendarDatesDao);

        window.webContents.send('loaded-gtfs', gtfsDAO);
      }
}


function parseGTFS(path){
  return {
    agencies: parseFile(path,"agency"),
    stops: parseFile(path,"stops"),
    routes: parseFile(path, "routes"),
    calendarDates: parseFile(path,"calendar_dates"),
    trips: parseFile(path, "trips"),
    shapes: parseFile(path, "shapes"),
    stopTimes: parseFile(path,"stop_times")
  }
}
function parseFile(path, file){

  const csvData = fs.readFileSync(`${path}/${file}.txt`, 'utf8');

  // Parsea el archivo CSV usando Papa Parse
  const results = Papa.parse(csvData, {
      header: true
  });

  return results.data;
}


async function uploadGTFS(gtfsData, path){

  
  const [project,created] = await Project.findOrCreate({
    where: {
      name: "Initial Project"
    }
  });

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
  const stopsMap = {};

  for(const stop of gtfsData.stops){
    const gtfsStop = {...stop, gtfs_stop_id: stop.stop_id, gtfs_file_id: gtfsFile.id};
    try {
      const stopInDb = await GtfsStop.create(gtfsStop);
      stops.push(stopInDb);
      stopsMap[stopInDb.gtfs_stop_id.toString()] = stopInDb.id;
    } catch (error) {
    }
  }

  const routesMap = {};
  const routes = [] as GtfsRoute[];
  for(const route of gtfsData.routes){
    const gtfsRoute = {...route, agency_id: agencyMap[route.agency_id]}
    const routeInDb = await GtfsRoute.create(gtfsRoute);
    agencyMap[route.route_id] = routeInDb.id;

    routes.push(routeInDb);
  }

  const calendarDates = [] as GtfsCalendarDates[];
  for(const calendarDate of gtfsData.calendarDates){
    const year = calendarDate.date.substring(0, 4);
    const month = calendarDate.date.substring(4, 6) - 1; // Month is zero-based
    const day = calendarDate.date.substring(6, 8);

    const date = new Date(year, month, day);

    const gtfsCalendarDate = {service_id: calendarDate.service_id, date: date, exception_type: parseInt(calendarDate.exception_type), gtfs_file_id: gtfsFile.id};
    const calendarInDb = await GtfsCalendarDates.create(gtfsCalendarDate);
    calendarDates.push(calendarInDb);
  }

  const trips = [] as any[];
  for(const trip of gtfsData.trips){
    const gtfsTrip = {...trip,route_id: routesMap[trip.route_id]};
    trips.push(gtfsTrip);
  }

  const tripsInDb = await GtfsTrip.bulkCreate(trips);
  
  const tripsMap = {};
  
  tripsInDb.forEach(trip => tripsMap[trip.trip_id] = trip.id);

  const shapes = [] as any[];
  for(const shape of gtfsData.shapes){
    const gtfsShape = {...shape, gtfs_file_id: gtfsFile.id};
    shapes.push(gtfsShape);
  }

  await GtfsShape.bulkCreate(shapes);

  const stopTimes = [] as any[];
  for(const stopTime of gtfsData.stopTimes){
    const gtfsStopTime = {...stopTime, trip_id: tripsMap[stopTime.trip_id], stop_id: stopsMap[stopTime.stop_id]};
    stopTimes.push(gtfsStopTime);
  }

  await GtfsStopTime.bulkCreate(stopTimes);

  return {file: gtfsFile, agencies: agencies, stops: stops, routes: routes, calendarDates: calendarDates};
}




module.exports = {
    selectDirectory
};