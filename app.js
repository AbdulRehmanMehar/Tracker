const fs = require('fs');
// const log = require('electron-log');
const bytenode = require('bytenode');
const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const { GH_TOKEN } = require(__dirname + '/variables.jsc').vars;

console.log('asd')

// autoUpdater.logger = log;
app.allowRendererProcessReuse = false;



autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'projdako',
  repo: 'zepto-desktop-releases',
  private: true,
  token: GH_TOKEN,
  releaseType: "release"
});

let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      accessibleTitle: 'Zepto', 
      webSecurity: true,
      nodeIntegration: true,
      nativeWindowOpen: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  console.log('meesage');
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('versionInfo', (event) => {
  event.sender.send('versionInfo', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('gotAnUpdate');
});

// autoUpdater.on('download-progress', (progressObj) => {
//   let log_message = "Download speed: " + progressObj.bytesPerSecond;
//   log_message = log_message + ' - Downloaded ' + Math.round(progressObj.percent) + '%';
//   log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//   sendStatusToWindow(log_message);
// });

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('downloadedTheUpdate');
});

ipcMain.on('restartToUpdate', () => {
    autoUpdater.quitAndInstall();
});


// function sendStatusToWindow(text) {
//   log.info(text);
//   mainWindow.webContents.send('downloadProgress', text);
// }

exports.app = app;
exports.mainWindow = mainWindow;
