"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs_1 = require("fs");
const papaparse_1 = __importDefault(require("papaparse"));
function selectDirectory(window) {
    return electron_1.dialog
        .showOpenDialog(window, {
        properties: ['openDirectory'],
        title: "Selecciona una carpeta para importar GTFS"
    })
        .then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const path = result.filePaths[0];
            parseAgency(path);
        }
    })
        .catch(err => {
        electron_1.dialog.showErrorBox("Error al importar GTFS", "Ha ocurrido un error al seleccionar la ruta. Error: " + err);
    });
}
function parseAgency(path) {
    const string_output = (0, fs_1.readFileSync)(`${path}/agency.txt`, 'utf8');
    papaparse_1.default.parse(string_output, {
        header: true,
        complete: function (results) {
            console.log(results);
        }
    });
}
module.exports = {
    selectDirectory
};
