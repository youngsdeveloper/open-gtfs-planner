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
import { GtfsCalendarDao } from "../daos/GtfsCalendarDao";
import { GtfsCalendar } from "../models/gtfscalendar.model";

const {DataTypes} = require("sequelize")


const fs = require('fs');

async function importGTFS(window,path){
        
    window.webContents.send('start-loading-gtfs');

    const gtfsData = parseGTFS(path);

    window.webContents.send('update-loading-gtfs', 10);


    const [project,created] = await Project.findOrCreate({
      where: {
        name: "Initial Project"
      }
    });

    const gtfsDB = await uploadGTFS(project, gtfsData, path, window);

    const routesDAO:GtfsRouteDao[] = [] as GtfsRouteDao[];
    gtfsDB.routes.forEach(route => {
      routesDAO.push(GtfsRouteDao.fromObject(route));
    });


    const agenciesDAO:GtfsAgencyDao[] = [] as GtfsAgencyDao[];
    gtfsDB.agencies.forEach(a => {
        const routes_by_agency = routesDAO.filter(r => r.agency_id == a.id);
        agenciesDAO.push(new GtfsAgencyDao(a.name,a.id, routes_by_agency));
    });

    window.webContents.send('update-loading-gtfs', 95);


    const stospDao:GtfsStopDao[] = [] as GtfsStopDao[];
    gtfsDB.stops.forEach(stop => {
      stospDao.push(GtfsStopDao.fromObject(stop));
    });

    const calendarDatesDao:GtfsCalendarDatesDao[] = [] as GtfsCalendarDatesDao[];
    gtfsDB.calendarDates.forEach(calendarDate => {
      calendarDatesDao.push(GtfsCalendarDatesDao.fromObject(calendarDate));
    });

    const calendarsDao:GtfsCalendarDao[] = [] as GtfsCalendarDao[];
    gtfsDB.calendars.forEach(calendar => {
      calendarsDao.push(GtfsCalendarDao.fromObject(calendar));
    });

    window.webContents.send('update-loading-gtfs', 100);

    
    const gtfsDAO = new GtfsDao(gtfsDB.file.id, gtfsDB.file.filename, agenciesDAO, stospDao, calendarDatesDao, calendarsDao);


    
    window.webContents.send('loaded-gtfs', gtfsDAO);
    window.webContents.send('end-loading-gtfs', gtfsDAO);
}

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

        importGTFS(window, path);
      }
}


function parseGTFS(path){
  return {
    agencies: parseFile(path,"agency"),
    stops: parseFile(path,"stops"),
    routes: parseFile(path, "routes"),
    calendars: parseFile(path,"calendar"),
    calendarDates: parseFile(path,"calendar_dates"),
    trips: parseFile(path, "trips"),
    shapes: parseFile(path, "shapes"),
    stopTimes: parseFile(path,"stop_times")
  }
}
function parseFile(path, file){

  try {
    const csvData = fs.readFileSync(`${path}/${file}.txt`, 'utf8');

    // Parsea el archivo CSV usando Papa Parse
    const results = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
    });

    return results.data;
  } catch (error) {
    return [];
  }

  
}


async function uploadGTFS(project, gtfsData, path, window){

  

  var filename = path.split("/").at(-1);
  
  const gtfsFile = await GtfsFile.create({project_id: project.id, filename: filename});

  window.webContents.send('update-loading-gtfs', 15);

  const agencies = [] as GtfsAgency[];
  const agencyMap = {};
  for(const agency of gtfsData.agencies){
    const agencyInDb = await GtfsAgency.create({name: agency.agency_name, gtfs_agency_id: agency.agency_id, gtfs_file_id: gtfsFile.id})
    agencyMap[agency.agency_id] = agencyInDb.id;
    agencies.push(agencyInDb)
  }

  window.webContents.send('update-loading-gtfs', 20);

  let stops = [] as any[];
  const stopsMap = {};

  for(const stop of gtfsData.stops){
    const gtfsStop = {...stop, gtfs_stop_id: stop.stop_id, gtfs_file_id: gtfsFile.id};
    try {
      stops.push(gtfsStop);
    } catch (error) {
    }
  }

  stops = await GtfsStop.bulkCreate(stops);


  stops.forEach(s => stopsMap[s.gtfs_stop_id.toString()] = s.id);

  window.webContents.send('update-loading-gtfs', 40);


  const routesMap = {};
  let routes = [] as any[];
  for(const route of gtfsData.routes){
    let agency_id = agencyMap[route.agency_id];
    if(!route.agency_id){
      agency_id = agencyMap[Object.keys(agencyMap)[0]]
    }
    const gtfsRoute = {...route, agency_id: agency_id, gtfs_file_id: gtfsFile.id}
    routes.push(gtfsRoute);
  }

  routes = await GtfsRoute.bulkCreate(routes);
  routes.forEach(r => routesMap[r.route_id] = r.id);

  window.webContents.send('update-loading-gtfs', 45);


  const calendarDates = [] as any[];
  for(const calendarDate of gtfsData.calendarDates){
    const year = calendarDate.date.substring(0, 4);
    const month = calendarDate.date.substring(4, 6) - 1; // Month is zero-based
    const day = calendarDate.date.substring(6, 8);

    const date = new Date(year, month, day);

    const gtfsCalendarDate = {service_id: calendarDate.service_id, date: date, exception_type: parseInt(calendarDate.exception_type.replace(/\n|\r|\W/g, "")), gtfs_file_id: gtfsFile.id};
    calendarDates.push(gtfsCalendarDate);
    console.log(gtfsCalendarDate)
  }

  const chunkSize = 1000;
  for (let i = 0; i < calendarDates.length; i += chunkSize) {
      const chunk = calendarDates.slice(i, i + chunkSize);
      try {
        const result_chunk = await GtfsCalendarDates.bulkCreate(chunk);
      } catch (error) {
        console.error(error);
      }
  }


  const calendars = [] as any[];
  for(const calendar of gtfsData.calendars){

    console.log(calendar);
    let year = calendar.start_date.substring(0, 4);
    let month = calendar.start_date.substring(4, 6) - 1; 
    let day = calendar.start_date.substring(6, 8);

    const startDate = new Date(year, month, day);

    year = calendar.end_date.substring(0, 4);
    month = calendar.end_date.substring(4, 6) - 1; 
    day = calendar.end_date.substring(6, 8);

    const endDate = new Date(year, month, day);

    
    const gtfsCalendar = { ...calendar, service_id: calendar.service_id, start_date: startDate, end_date: endDate, gtfs_file_id: gtfsFile.id};
    calendars.push(gtfsCalendar);
  }

  await GtfsCalendar.bulkCreate(calendars);


  window.webContents.send('update-loading-gtfs', 50);


  const shapes = [] as any[];
  for(const shape of gtfsData.shapes){
    const gtfsShape = {...shape, gtfs_file_id: gtfsFile.id};
    shapes.push(gtfsShape);
  }


  await GtfsShape.bulkCreate(shapes);

  window.webContents.send('update-loading-gtfs', 60);

  console.log("-- Subiendo trips --")
  const trips = [] as any[];
  for(const trip of gtfsData.trips){
    const gtfsTrip = {...trip,route_id: routesMap[trip.route_id], gtfs_file_id: gtfsFile.id};
    trips.push(gtfsTrip);
  }


  // Chunk Size = 1000

  

  const tripsInDb = [] as GtfsTrip[];

  for (let i = 0; i < trips.length; i += chunkSize) {
      const chunk = trips.slice(i, i + chunkSize);
      const result_chunk = await GtfsTrip.bulkCreate(chunk);
      tripsInDb.push(...result_chunk);
  }
  
  const tripsMap = {};
  
  tripsInDb.forEach(trip => tripsMap[trip.trip_id] = trip.id);

  window.webContents.send('update-loading-gtfs', 80);


  console.log("-- Subiendo stop times --")

  const stopTimes = [] as any[];
  for(const stopTime of gtfsData.stopTimes){
    const gtfsStopTime = {...stopTime, trip_id: tripsMap[stopTime.trip_id], stop_id: stopsMap[stopTime.stop_id], gtfs_file_id: gtfsFile.id};
    stopTimes.push(gtfsStopTime);
  }

  for (let i = 0; i < stopTimes.length; i += chunkSize) {
      const chunk = stopTimes.slice(i, i + chunkSize);
      await GtfsStopTime.bulkCreate(chunk);
  }

  window.webContents.send('update-loading-gtfs', 90);


  return {file: gtfsFile, agencies: agencies, stops: stops, routes: routes, calendarDates: calendarDates, calendars: calendars};
}




module.exports = {
    selectDirectory,
    importGTFS
};