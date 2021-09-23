const fs = require('fs');
const bytenode = require('bytenode');
const isPackaged = require('electron-is-packaged').isPackaged;

bytenode.compileFile({
    filename: './app.js',
    output: './app.jsc',
    electron: true,
    compileAsModule: true
});

bytenode.compileFile({
    filename: './bundle/js/index.js',
    output: './bundle/js/index.jsc',
    electron: true,
    compileAsModule: true
});

if (!isPackaged && fs.existsSync('./variables.js') && fs.existsSync('./variables.jsc')) {
    fs.unlinkSync('./variables.js');
    fs.unlinkSync('./variables.jsc');
}

if (!fs.existsSync('./variables.jsc')) {
    fs.writeFileSync('./variables.js', `
      let variables = {
        GH_TOKEN: '${process.env.GH_TOKEN}'
      }
      exports.vars = variables;
    `);
  
    bytenode.compileFile({
      filename: './variables.js',
      output: './variables.jsc',
      electron: true,
      compileAsModule: true
    });
}