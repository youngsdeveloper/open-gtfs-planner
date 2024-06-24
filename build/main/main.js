"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const { buildMenu } = require('./menu');
const { createMainWindow } = require('./controllers/mainWindowController');
const { selectDirectory } = require('./controllers/gtfsImporterController');
const { downloadProject, downloadShapesByRoute, deleteGTFS, downloadTripsByServices, downloadStopByServices } = require('./controllers/gtfsController');
const { saveSimulationOption, updateSimulationOption } = require('./controllers/simulationOptionsController');
const models_1 = __importDefault(require("./models"));
let mainWindow;
electron_1.app.whenReady().then(() => {
    mainWindow = createMainWindow();
    models_1.default.sync().then(() => {
        console.log("DB Synced");
    });
    electron_1.session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: Object.assign(Object.assign({}, details.responseHeaders), { 'Content-Security-Policy': ['script-src \'self\''] })
        });
    });
    electron_1.app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            mainWindow = createMainWindow();
        }
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.ipcMain.on('message', (event, message) => {
    console.log(message);
});
electron_1.ipcMain.on("importGTFS", () => {
    selectDirectory(mainWindow);
});
electron_1.ipcMain.on("downloadCurrentProject", () => {
    downloadProject(mainWindow, 1);
});
electron_1.ipcMain.on("downloadShapesByRoute", (event, routeId) => {
    downloadShapesByRoute(mainWindow, routeId);
});
electron_1.ipcMain.on("deleteGTFS", (event, gtfsId) => {
    deleteGTFS(mainWindow, gtfsId);
});
electron_1.ipcMain.on("downloadTripsByServices", (event, servicesId) => {
    downloadTripsByServices(mainWindow, servicesId);
});
electron_1.ipcMain.on("downloadStopByServices", (event, stopId, servicesId) => {
    downloadStopByServices(mainWindow, stopId, servicesId);
});
electron_1.ipcMain.on("saveSimulationOption", (event, projectId, routeId, delta) => {
    saveSimulationOption(mainWindow, projectId, routeId, delta);
});
electron_1.ipcMain.on("updateSimulationOption", (event, simulationOptions) => {
    updateSimulationOption(mainWindow, simulationOptions);
});
electron_1.Menu.setApplicationMenu(buildMenu(mainWindow));
