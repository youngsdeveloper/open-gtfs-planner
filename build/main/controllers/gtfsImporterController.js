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
const { DataTypes } = require("sequelize");
const { sequelize } = require('../models');
const GtfsFile = require("../models/gtfsfile")(sequelize, DataTypes);
const GtfsAgency = require("../models/gtfsagency")(sequelize, DataTypes);
const GtfsStop = require("../models/gtfsstop")(sequelize, DataTypes);
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
            const agenciesDAO = [];
            gtfsDB.agencies.forEach(a => {
                agenciesDAO.push(new GtfsAgencyDao_1.GtfsAgencyDao(a.id, a.name));
            });
            const stospDao = [];
            gtfsData.stops.forEach(stop => {
                stospDao.push(new GtfsStopDao_1.GtfsStopDao(stop.id, stop.stop_id, stop.stop_name, stop.stop_lat, stop.stop_lon, stop.agency_id));
            });
            const gtfsDAO = new GtfsDao_1.GtfsDao(gtfsDB.file.id, gtfsDB.file.fileName, agenciesDAO, stospDao);
            window.webContents.send('loaded-gtfs', gtfsDAO);
        }
    });
}
function parseGTFS(path) {
    return {
        agencies: parseAgency(path),
        stops: parseStops(path)
    };
}
function uploadGTFS(gtfsData, path) {
    return __awaiter(this, void 0, void 0, function* () {
        var fileName = path.split("/").at(-1);
        const gtfsFile = yield GtfsFile.create({ fileName: fileName });
        const agencies = [];
        const agencyMap = {};
        for (const agency of gtfsData.agencies) {
            const agencyInDb = yield GtfsAgency.create({ name: agency.agency_name, gtfs_agency_id: agency.agency_id, gtfs_file_id: gtfsFile.id });
            agencyMap[parseInt(agency.agency_id)] = agencyInDb.id;
            agencies.push(agencyInDb);
        }
        const stops = [];
        for (const stop of gtfsData.stops) {
            console.log(stop);
            const gtfsStop = Object.assign(Object.assign({}, stop), { gtfs_stop_id: stop.stop_id, gtfs_file_id: gtfsFile.id });
            try {
                const stopInDb = yield GtfsStop.create(gtfsStop);
                stops.push(stopInDb);
            }
            catch (error) {
                console.log(error);
            }
        }
        return { file: gtfsFile, agencies: agencies, stops: stops };
    });
}
function parseAgency(path) {
    const csvData = fs.readFileSync(`${path}/agency.txt`, 'utf8');
    // Parsea el archivo CSV usando Papa Parse
    const results = papaparse_1.default.parse(csvData, {
        header: true
    });
    return results.data;
}
function parseStops(path) {
    const csvData = fs.readFileSync(`${path}/stops.txt`, 'utf8');
    // Parsea el archivo CSV usando Papa Parse
    const results = papaparse_1.default.parse(csvData, {
        header: true
    });
    return results.data;
}
module.exports = {
    selectDirectory
};
