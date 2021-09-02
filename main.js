const bytenode = require('bytenode');
const isPackaged = require('electron-is-packaged').isPackaged;
const fs = require('fs');
const v8 = require('v8');

v8.setFlagsFromString('--no-lazy');

if (!isPackaged) {
  fs.unlinkSync(__dirname + '/app.jsc')
}

if (!fs.existsSync(__dirname + '/app.jsc')) {
  bytenode.compileFile(__dirname + '/app.js', __dirname + '/app.jsc');
}

require(__dirname + '/app.jsc');