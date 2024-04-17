"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const { buildMenu } = require('./menu');
const { createMainWindow } = require('./controllers/mainWindowController');
const { selectDirectory } = require('./controllers/gtfsImporterController');
let mainWindow;
electron_1.app.whenReady().then(() => {
    mainWindow = createMainWindow();
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
electron_1.Menu.setApplicationMenu(buildMenu(mainWindow));
