
import {app, BrowserWindow} from 'electron';
import {join} from 'path';


function createMainWindow () {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../preload.js'),
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
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
  return mainWindow;
}

module.exports = {
    createMainWindow
};