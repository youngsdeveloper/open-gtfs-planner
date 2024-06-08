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
            const path = result.filePaths[0];
            const gtfsData = parseGTFS(path);
            const gtfsDB = yield uploadGTFS(gtfsData, path);
            const routesDAO = [];
            gtfsDB.routes.forEach(route => {
                routesDAO.push(GtfsRouteDao_1.GtfsRouteDao.fromObject(route));
            });
            const agenciesDAO = [];
            gtfsDB.agencies.forEach(a => {
                const routes_by_agency = routesDAO.filter(r => r.agency_id == a.id);
                agenciesDAO.push(new GtfsAgencyDao_1.GtfsAgencyDao(a.name, a.id, routes_by_agency));
            });
            const stospDao = [];
            gtfsDB.stops.forEach(stop => {
                stospDao.push(GtfsStopDao_1.GtfsStopDao.fromObject(stop));
            });
            const calendarDatesDao = [];
            gtfsDB.calendarDates.forEach(calendarDate => {
                calendarDatesDao.push(GtfsCalendarDatesDao_1.GtfsCalendarDatesDao.fromObject(calendarDate));
            });
            const gtfsDAO = new GtfsDao_1.GtfsDao(gtfsDB.file.id, gtfsDB.file.filename, agenciesDAO, stospDao, calendarDatesDao);
            window.webContents.send('loaded-gtfs', gtfsDAO);
        }
    });
}
function parseGTFS(path) {
    return {
        agencies: parseFile(path, "agency"),
        stops: parseFile(path, "stops"),
        routes: parseFile(path, "routes"),
        calendarDates: parseFile(path, "calendar_dates"),
        trips: parseFile(path, "trips")
    };
}
function uploadGTFS(gtfsData, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const [project, created] = yield project_model_1.Project.findOrCreate({
            where: {
                name: "Initial Project"
            }
        });
        var filename = path.split("/").at(-1);
        const gtfsFile = yield gtfsfile_model_1.GtfsFile.create({ project_id: project.id, filename: filename });
        const agencies = [];
        const agencyMap = {};
        for (const agency of gtfsData.agencies) {
            const agencyInDb = yield gtfsagency_model_1.GtfsAgency.create({ name: agency.agency_name, gtfs_agency_id: agency.agency_id, gtfs_file_id: gtfsFile.id });
            agencyMap[parseInt(agency.agency_id)] = agencyInDb.id;
            agencies.push(agencyInDb);
        }
        const stops = [];
        for (const stop of gtfsData.stops) {
            const gtfsStop = Object.assign(Object.assign({}, stop), { gtfs_stop_id: stop.stop_id, gtfs_file_id: gtfsFile.id });
            try {
                const stopInDb = yield gtfsstop_model_1.GtfsStop.create(gtfsStop);
                stops.push(stopInDb);
            }
            catch (error) {
            }
        }
        const routesMap = {};
        const routes = [];
        for (const route of gtfsData.routes) {
            const gtfsRoute = Object.assign(Object.assign({}, route), { agency_id: agencyMap[route.agency_id] });
            const routeInDb = yield gtfsroute_model_1.GtfsRoute.create(gtfsRoute);
            agencyMap[route.route_id] = routeInDb.id;
            routes.push(routeInDb);
        }
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
        const trips = [];
        for (const trip of gtfsData.trips) {
            const gtfsTrip = Object.assign(Object.assign({}, trip), { route_id: routesMap[trip.route_id] });
            trips.push(gtfsTrip);
        }
        gtfstrip_model_1.GtfsTrip.bulkCreate(trips);
        return { file: gtfsFile, agencies: agencies, stops: stops, routes: routes, calendarDates: calendarDates };
    });
}
function parseFile(path, file) {
    const csvData = fs.readFileSync(`${path}/${file}.txt`, 'utf8');
    // Parsea el archivo CSV usando Papa Parse
    const results = papaparse_1.default.parse(csvData, {
        header: true
    });
    return results.data;
}
module.exports = {
    selectDirectory
};
