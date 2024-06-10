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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const papaparse_1 = __importDefault(require("papaparse"));
const GtfsStopDao_1 = require("../daos/GtfsStopDao");
const GtfsDao_1 = require("../daos/GtfsDao");
const GtfsAgencyDao_1 = require("../daos/GtfsAgencyDao");
const project_model_1 = require("../models/project.model");
const gtfsfile_model_1 = require("../models/gtfsfile.model");
const gtfsagency_model_1 = require("../models/gtfsagency.model");
const gtfsstop_model_1 = require("../models/gtfsstop.model");
const gtfsroute_model_1 = require("../models/gtfsroute.model");
const GtfsRouteDao_1 = require("../daos/GtfsRouteDao");
const gtfscalendardates_model_1 = require("../models/gtfscalendardates.model");
const GtfsCalendarDatesDao_1 = require("../daos/GtfsCalendarDatesDao");
const gtfstrip_model_1 = require("../models/gtfstrip.model");
const gtfsshape_model_1 = require("../models/gtfsshape.model");
const gtfsstoptime_model_1 = require("../models/gtfsstoptime.model");
const GtfsCalendarDao_1 = require("../daos/GtfsCalendarDao");
const gtfscalendar_model_1 = require("../models/gtfscalendar.model");
const { DataTypes } = require("sequelize");
const fs = require('fs');
function selectDirectory(window) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        try {
            result = yield electron_1.dialog
                .showOpenDialog(window, {
                properties: ['openDirectory'],
                title: "Selecciona una carpeta para importar GTFS"
            });
        }
        catch (err) {
            electron_1.dialog.showErrorBox("Error al importar GTFS", "Ha ocurrido un error al seleccionar la ruta. Error: " + err);
        }
        if (!result.canceled && result.filePaths.length > 0) {
            window.webContents.send('start-loading-gtfs');
            const path = result.filePaths[0];
            const gtfsData = parseGTFS(path);
            window.webContents.send('update-loading-gtfs', 10);
            const gtfsDB = yield uploadGTFS(gtfsData, path, window);
            const routesDAO = [];
            gtfsDB.routes.forEach(route => {
                routesDAO.push(GtfsRouteDao_1.GtfsRouteDao.fromObject(route));
            });
            const agenciesDAO = [];
            gtfsDB.agencies.forEach(a => {
                const routes_by_agency = routesDAO.filter(r => r.agency_id == a.id);
                agenciesDAO.push(new GtfsAgencyDao_1.GtfsAgencyDao(a.name, a.id, routes_by_agency));
            });
            window.webContents.send('update-loading-gtfs', 95);
            const stospDao = [];
            gtfsDB.stops.forEach(stop => {
                stospDao.push(GtfsStopDao_1.GtfsStopDao.fromObject(stop));
            });
            const calendarDatesDao = [];
            gtfsDB.calendarDates.forEach(calendarDate => {
                calendarDatesDao.push(GtfsCalendarDatesDao_1.GtfsCalendarDatesDao.fromObject(calendarDate));
            });
            const calendarsDao = [];
            gtfsDB.calendars.forEach(calendar => {
                calendarsDao.push(GtfsCalendarDao_1.GtfsCalendarDao.fromObject(calendar));
            });
            window.webContents.send('update-loading-gtfs', 100);
            const gtfsDAO = new GtfsDao_1.GtfsDao(gtfsDB.file.id, gtfsDB.file.filename, agenciesDAO, stospDao, calendarDatesDao, calendarsDao);
            window.webContents.send('loaded-gtfs', gtfsDAO);
            window.webContents.send('end-loading-gtfs', gtfsDAO);
        }
    });
}
function parseGTFS(path) {
    return {
        agencies: parseFile(path, "agency"),
        stops: parseFile(path, "stops"),
        routes: parseFile(path, "routes"),
        calendars: parseFile(path, "calendar"),
        calendarDates: parseFile(path, "calendar_dates"),
        trips: parseFile(path, "trips"),
        shapes: parseFile(path, "shapes"),
        stopTimes: parseFile(path, "stop_times")
    };
}
function parseFile(path, file) {
    try {
        const csvData = fs.readFileSync(`${path}/${file}.txt`, 'utf8');
        // Parsea el archivo CSV usando Papa Parse
        const results = papaparse_1.default.parse(csvData, {
            header: true,
            skipEmptyLines: true,
        });
        return results.data;
    }
    catch (error) {
        return [];
    }
}
function uploadGTFS(gtfsData, path, window) {
    return __awaiter(this, void 0, void 0, function* () {
        const [project, created] = yield project_model_1.Project.findOrCreate({
            where: {
                name: "Initial Project"
            }
        });
        var filename = path.split("/").at(-1);
        const gtfsFile = yield gtfsfile_model_1.GtfsFile.create({ project_id: project.id, filename: filename });
        window.webContents.send('update-loading-gtfs', 15);
        const agencies = [];
        const agencyMap = {};
        for (const agency of gtfsData.agencies) {
            const agencyInDb = yield gtfsagency_model_1.GtfsAgency.create({ name: agency.agency_name, gtfs_agency_id: agency.agency_id, gtfs_file_id: gtfsFile.id });
            agencyMap[agency.agency_id] = agencyInDb.id;
            agencies.push(agencyInDb);
        }
        window.webContents.send('update-loading-gtfs', 20);
        let stops = [];
        const stopsMap = {};
        for (const stop of gtfsData.stops) {
            const gtfsStop = Object.assign(Object.assign({}, stop), { gtfs_stop_id: stop.stop_id, gtfs_file_id: gtfsFile.id });
            try {
                stops.push(gtfsStop);
            }
            catch (error) {
            }
        }
        stops = yield gtfsstop_model_1.GtfsStop.bulkCreate(stops);
        stops.forEach(s => stopsMap[s.gtfs_stop_id.toString()] = s.id);
        window.webContents.send('update-loading-gtfs', 40);
        const routesMap = {};
        let routes = [];
        for (const route of gtfsData.routes) {
            let agency_id = agencyMap[route.agency_id];
            if (!route.agency_id) {
                agency_id = agencyMap[Object.keys(agencyMap)[0]];
            }
            const gtfsRoute = Object.assign(Object.assign({}, route), { agency_id: agency_id });
            routes.push(gtfsRoute);
        }
        routes = yield gtfsroute_model_1.GtfsRoute.bulkCreate(routes);
        routes.forEach(r => routesMap[r.route_id] = r.id);
        window.webContents.send('update-loading-gtfs', 45);
        const calendarDates = [];
        for (const calendarDate of gtfsData.calendarDates) {
            const year = calendarDate.date.substring(0, 4);
            const month = calendarDate.date.substring(4, 6) - 1; // Month is zero-based
            const day = calendarDate.date.substring(6, 8);
            const date = new Date(year, month, day);
            const gtfsCalendarDate = { service_id: calendarDate.service_id, date: date, exception_type: parseInt(calendarDate.exception_type), gtfs_file_id: gtfsFile.id };
            const calendarInDb = yield gtfscalendardates_model_1.GtfsCalendarDates.create(gtfsCalendarDate);
            calendarDates.push(calendarInDb);
        }
        const calendars = [];
        for (const calendar of gtfsData.calendars) {
            let year = calendar.start_date.substring(0, 4);
            let month = calendar.start_date.substring(4, 6) - 1;
            let day = calendar.start_date.substring(6, 8);
            const startDate = new Date(year, month, day);
            year = calendar.end_date.substring(0, 4);
            month = calendar.end_date.substring(4, 6) - 1;
            day = calendar.end_date.substring(6, 8);
            const endDate = new Date(year, month, day);
            const gtfsCalendar = Object.assign(Object.assign({}, calendar), { service_id: calendar.service_id, start_date: startDate, end_date: endDate, gtfs_file_id: gtfsFile.id });
            const calendarInDb = yield gtfscalendar_model_1.GtfsCalendar.create(gtfsCalendar);
            calendars.push(calendarInDb);
        }
        window.webContents.send('update-loading-gtfs', 50);
        const shapesMap = {};
        const shapes = [];
        for (const shape of gtfsData.shapes) {
            const gtfsShape = Object.assign(Object.assign({}, shape), { gtfs_file_id: gtfsFile.id });
            shapes.push(gtfsShape);
        }
        const shapesInDB = yield gtfsshape_model_1.GtfsShape.bulkCreate(shapes);
        window.webContents.send('update-loading-gtfs', 60);
        const trips = [];
        for (const trip of gtfsData.trips) {
            const gtfsTrip = Object.assign(Object.assign({}, trip), { route_id: routesMap[trip.route_id] });
            trips.push(gtfsTrip);
        }
        const tripsInDb = yield gtfstrip_model_1.GtfsTrip.bulkCreate(trips);
        const tripsMap = {};
        tripsInDb.forEach(trip => tripsMap[trip.trip_id] = trip.id);
        window.webContents.send('update-loading-gtfs', 80);
        const stopTimes = [];
        for (const stopTime of gtfsData.stopTimes) {
            const gtfsStopTime = Object.assign(Object.assign({}, stopTime), { trip_id: tripsMap[stopTime.trip_id], stop_id: stopsMap[stopTime.stop_id] });
            stopTimes.push(gtfsStopTime);
        }
        yield gtfsstoptime_model_1.GtfsStopTime.bulkCreate(stopTimes);
        window.webContents.send('update-loading-gtfs', 90);
        return { file: gtfsFile, agencies: agencies, stops: stops, routes: routes, calendarDates: calendarDates, calendars: calendars };
    });
}
module.exports = {
    selectDirectory
};
