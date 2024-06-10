"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
function createMainWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 800,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, '../preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });
    mainWindow.maximize();
    if (process.env.NODE_ENV === 'development') {
        const rendererPort = process.argv[2];
        mainWindow.loadURL(`http://localhost:${rendererPort}`);
    }
    else {
        mainWindow.loadFile((0, path_1.join)(electron_1.app.getAppPath(), 'renderer', 'index.html'));
    }
    return mainWindow;
}
module.exports = {
    createMainWindow
};
