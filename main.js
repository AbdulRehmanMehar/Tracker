// const bytenode = require('bytenode');
// const isPackaged = require('electron-is-packaged').isPackaged;
// const fs = require('fs');
// const v8 = require('v8');
// const path = require('path');

// v8.setFlagsFromString('--no-lazy');

// if (!isPackaged && fs.existsSync(__dirname + '/app.jsc')) {
//   fs.unlinkSync(__dirname + '/app.jsc')
// }

// if (!fs.existsSync(__dirname + '/app.jsc')) {
//   bytenode.compileFile(__dirname + '/app.js', __dirname + '/app.jsc');
// }


// if (!isPackaged) {
//   try {
//     require('electron-reload')(__dirname, { ignored: ['**.jsc'] });
//   } catch (_) { console.log('Error'); } 
// }

// require(__dirname + '/app.jsc');