const fs = require('fs');
<<<<<<< HEAD
<<<<<<< HEAD
// const log = require('electron-log');
=======
>>>>>>> parent of 0615066 (some configuration)
=======
const log = require('electron-log');
>>>>>>> 0615066006d43f3780f21aa2e5df6c4f34db719e
const bytenode = require('bytenode');
const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const { GH_TOKEN } = require(__dirname + '/variables.jsc').vars;

<<<<<<< HEAD
<<<<<<< HEAD
console.log('asd')

// autoUpdater.logger = log;
app.allowRendererProcessReuse = false;
=======
app.allowRendererProcessReuse = false
>>>>>>> parent of 0615066 (some configuration)


=======
autoUpdater.logger = log;
app.allowRendererProcessReuse = false;
>>>>>>> 0615066006d43f3780f21aa2e5df6c4f34db719e

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
<<<<<<< HEAD
<<<<<<< HEAD

// autoUpdater.on('download-progress', (progressObj) => {
//   let log_message = "Download speed: " + progressObj.bytesPerSecond;
//   log_message = log_message + ' - Downloaded ' + Math.round(progressObj.percent) + '%';
//   log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//   sendStatusToWindow(log_message);
// });

=======
>>>>>>> parent of 0615066 (some configuration)
=======

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + Math.round(progressObj.percent) + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

>>>>>>> 0615066006d43f3780f21aa2e5df6c4f34db719e
autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('downloadedTheUpdate');
});

ipcMain.on('restartToUpdate', () => {
    autoUpdater.quitAndInstall();
});

<<<<<<< HEAD
<<<<<<< HEAD

// function sendStatusToWindow(text) {
//   log.info(text);
//   mainWindow.webContents.send('downloadProgress', text);
// }

=======
>>>>>>> parent of 0615066 (some configuration)
=======

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('downloadProgress', text);
}

>>>>>>> 0615066006d43f3780f21aa2e5df6c4f34db719e
exports.app = app;
exports.mainWindow = mainWindow;
