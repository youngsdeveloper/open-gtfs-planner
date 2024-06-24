import {app,BrowserWindow, ipcMain, session, Menu} from 'electron';

const { buildMenu } = require('./menu');

const { createMainWindow } = require('./controllers/mainWindowController');

const { selectDirectory } = require('./controllers/gtfsImporterController');
const { downloadProject, downloadShapesByRoute, deleteGTFS, downloadTripsByServices, downloadStopByServices } = require('./controllers/gtfsController');


const { saveSimulationOption, updateSimulationOption } = require('./controllers/simulationOptionsController');

import sequelize from "./models"

let mainWindow;


app.whenReady().then(() => {
  mainWindow = createMainWindow();
  
  
  sequelize.sync().then(()=>{
    console.log("DB Synced");
  })

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

ipcMain.on("importGTFS",()=>{
  selectDirectory(mainWindow);
})

ipcMain.on("downloadCurrentProject",()=>{
  downloadProject(mainWindow,1);
})

ipcMain.on("downloadShapesByRoute",(event, routeId)=>{
  downloadShapesByRoute(mainWindow, routeId);
})

ipcMain.on("deleteGTFS",(event, gtfsId)=>{
  deleteGTFS(mainWindow, gtfsId);
})


ipcMain.on("downloadTripsByServices",(event, servicesId)=>{
  downloadTripsByServices(mainWindow, servicesId)
})

ipcMain.on("downloadStopByServices",(event, stopId, servicesId)=>{
  downloadStopByServices(mainWindow, stopId, servicesId)
})


ipcMain.on("saveSimulationOption",(event, projectId, routeId, delta)=>{
  saveSimulationOption(mainWindow, projectId, routeId, delta)
})

ipcMain.on("updateSimulationOption",(event, simulationOptions)=>{
  updateSimulationOption(mainWindow, simulationOptions)
})


Menu.setApplicationMenu(buildMenu(mainWindow))

