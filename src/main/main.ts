import {app,BrowserWindow, ipcMain, session, Menu} from 'electron';

const { buildMenu } = require('./menu');

const { createMainWindow } = require('./controllers/mainWindowController');

const { selectDirectory } = require('./controllers/gtfsImporterController');
const { downloadProject } = require('./controllers/gtfsController');

const {sequelize} = require('./models');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = createMainWindow();

  console.log(sequelize);
  
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

Menu.setApplicationMenu(buildMenu(mainWindow))

