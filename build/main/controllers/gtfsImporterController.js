"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const papaparse_1 = __importDefault(require("papaparse"));
const models = require('../models');
const GtfsStop = models.gtfs_stop;
const fs = require('fs');
function selectDirectory(window) {
    return electron_1.dialog
        .showOpenDialog(window, {
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
        electron_1.dialog.showErrorBox("Error al importar GTFS", "Ha ocurrido un error al seleccionar la ruta. Error: " + err);
    });
}
function parseGTFS(path) {
    return {
        agencies: parseAgency(path),
        stops: parseStops(path)
    };
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
