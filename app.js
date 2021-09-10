const { app, BrowserWindow, ipcMain, session } = require('electron');
const { autoUpdater } = require('electron-updater');
const {default: installExtensions, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');



let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
        accessibleTitle: 'Zepto', 
        webSecurity: true,
        nodeIntegration: true,
        nativeWindowOpen: true,
        contextIsolation: false,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
    mainWindow.show()
    console.log('Welcome to the Application')
  });
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

}

app.on('ready', async () => {
  await installExtensions([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], {
    loadExtensionOptions: {
        allowFileAccess: true,
    },
  })
  
  app.allowRendererProcessReuse = false
  
  console.log('Starting Application')
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
autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('downloadedTheUpdate');
});

ipcMain.on('restartToUpdate', () => {
    autoUpdater.quitAndInstall();
});

console.log(process.platform)

exports.app = app;
exports.mainWindow = mainWindow;
