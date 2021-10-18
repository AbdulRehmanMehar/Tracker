const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, ipcMain } = require('electron');
const { GH_TOKEN } = require(__dirname + '/variables.jsc').vars;

autoUpdater.logger = log;
app.allowRendererProcessReuse = false

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'projdako',
  repo: 'zepto-desktop-releases',
  private: true,
  token: GH_TOKEN,
  releaseType: "release"
});

let mainWindow, loadingWindow;
function createWindow () {
    loadingWindow = new BrowserWindow({
        width:          128,
        height:         128,
        show:           false,
        icon:           'assets/icon_orignal.png',
        transparent:    (process.platform != 'linux'), // Transparency doesn't work on Linux.
        resizable:      false,
        frame:          false,
        alwaysOnTop:    true,
        hasShadow:      false,
        backgroundColor: '#ffffff',
        title:          "Loading..."
    });
    loadingWindow.loadURL('file://' + __dirname + '/assets/icon_orignal.png');

    loadingWindow.once('ready-to-show', () => {
        loadingWindow.show();
    })

    mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    backgroundColor: '#ffffff',
    icon: 'assets/icon_orignal.png',
    paintWhenInitiallyHidden: true,
    webPreferences: {
      accessibleTitle: 'Zepto', 
      webSecurity: true,
      nodeIntegration: true,
      nativeWindowOpen: true,
      contextIsolation: false,
    }
  });

  let uri = 'file://' + __dirname + '/index.html';
    console.log(process.argv)
  if (process.argv[2] == 'hot') uri = 'http://localhost:3000';
    console.log(uri)
    mainWindow.loadURL(uri);
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
  mainWindow.once('show', () => {
      loadingWindow.destroy();
  })
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}



app.on('ready', () => {
    createWindow();

    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.webContents.once('ready-to-show', function ()
    {
        mainWindow.show();
        console.log('hi from mainwindow.once')
    });
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

function sendStatusToWindow(text) {
    log.info(text);
    mainWindow.webContents.send('downloadProgress', text);
}

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + Math.round(progressObj.percent) + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('downloadedTheUpdate');
});

ipcMain.on('restartToUpdate', () => {
    autoUpdater.quitAndInstall();
});

exports.app = app;
exports.mainWindow = mainWindow;
exports.createWindow = createWindow;
