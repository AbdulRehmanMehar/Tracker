const fs = require('fs');
const bytenode = require('bytenode');
const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const { isPackaged } = require('electron-is-packaged');

if (!isPackaged && fs.existsSync(__dirname + '/variables.js') && fs.existsSync(__dirname + '/variables.jsc')) {
  fs.unlinkSync(__dirname + '/variables.js');
  fs.unlinkSync(__dirname + '/variables.jsc');
}

if (!fs.existsSync(__dirname + '/variables.jsc')) {
  fs.writeFileSync(__dirname + '/variables.js', `

    let variables = {
      GH_TOKEN: '${process.env.GH_TOKEN}'
    }
    exports.vars = variables;
  `);

  bytenode.compileFile({
    filename: __dirname + '/variables.js',
    output: __dirname + '/variables.jsc',
  });
}

const { GH_TOKEN } = require(__dirname + '/variables.jsc').vars


autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'AbdulRehmanMehar',
  repo: 'electron-auto-update-deploy',
  private: true,
  token: GH_TOKEN,
  releaseType: 'release'
})




let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
    mainWindow.webContents.send('ghtoken', GH_TOKEN);
    mainWindow.webContents.send('feedURL', autoUpdater.getFeedURL())
    console.log("Sent the token");
  });
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

}

app.on('ready', () => {
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

exports.app = app;
exports.mainWindow = mainWindow;
