const bytenode = require('bytenode');
const fs = require('fs');
const v8 = require('v8');

v8.setFlagsFromString('--no-lazy');

if (!fs.existsSync(__dirname + '/app.jsc')) {
  bytenode.compileFile(__dirname + '/app.js', __dirname + '/app.jsc');
}

require(__dirname + '/app.jsc');