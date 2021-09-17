const fs = require('fs');
const path = require('path');
const http = require('http');
const axios = require('axios');
const bytenode = require('bytenode');
const pjson = require('./package.json');
const { spawnSync } = require('child_process');
// const { NsisUpdater } = require('electron-updater');
const { app, BrowserWindow, ipcMain, autoUpdater } = require('electron');
const isPackaged = require('electron-is-packaged').isPackaged;
const { GL_TOKEN, GL_PROJECT_ID } = require('./variables.jsc').vars
const {default: installExtensions, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
let downloadDir;

const baseUrl = `https://gitlab.com/api/v4/projects/${GL_PROJECT_ID}`
const fetch = axios.create({
  baseURL: baseUrl,
  headers: {'PRIVATE-TOKEN': GL_TOKEN}
});

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
  mainWindow.once('ready-to-show', async () => {
    mainWindow.show();
    console.log('Welcome to the Application');
  });

  
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    const filePath = `${downloadDir}/${item.getFilename()}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    item.setSavePath(filePath);

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log(item.getFilename() + ' Download is interrupted but can be resumed')

      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log(item.getFilename() + ' Download is paused')
        } else {
          console.log(`${item.getFilename()} Received bytes: ${item.getReceivedBytes()}`)
        }
      }

    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log(item.getFilename() + ' Download successfully')
        mainWindow.webContents.send('downloadComplete', { filePath })
      } else {
        console.log(`${item.getFilename()} Download failed: ${state}`)
      }
    })
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

}

app.on('ready', () => {
  // await installExtensions([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], {
  //   loadExtensionOptions: {
  //       allowFileAccess: true,
  //   },
  // })
  downloadDir = app.getPath("temp");
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
  event.sender.send('versionInfo', { version: pjson.version });
});

ipcMain.on('checkForUpdates', async () => {
  let res = await fetch.request({
    method: 'GET',
    url: '/releases',
  });
  const release = res.data[0];
  const version = release.tag_name.split('v').pop();
  console.log('Updated available', pjson.version < version, pjson.version, version);
  if (pjson.version < version) {
    const assetURLs = res.data[0].assets.links;
    mainWindow.webContents.send('gotAnUpdate', { assetURLs, GL_TOKEN });
  }
});


ipcMain.on('installUpdates', (event, arg) => {
  console.log(arg);

  spawnSync(`${arg} --update`)
})

exports.app = app;
exports.mainWindow = mainWindow;
