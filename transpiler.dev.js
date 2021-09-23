const fs = require('fs');
const bytenode = require('bytenode');
const isPackaged = require('electron-is-packaged').isPackaged;

bytenode.compileFile({
    filename: './app.js',
    output: './app.jsc',
<<<<<<< HEAD
    electron: true,
=======
    electron: true
>>>>>>> parent of 0615066 (some configuration)
});

bytenode.compileFile({
    filename: './bundle/js/index.js',
    output: './bundle/js/index.jsc',
<<<<<<< HEAD
    electron: true,
=======
    electron: true
>>>>>>> parent of 0615066 (some configuration)
});

if (!isPackaged && fs.existsSync('./variables.js') && fs.existsSync('./variables.jsc')) {
    fs.unlinkSync('./variables.js');
    fs.unlinkSync('./variables.jsc');
}

if (!fs.existsSync('./variables.jsc')) {
    fs.writeFileSync('./variables.js', `
      let variables = {
        GL_TOKEN: '${process.env.GL_API_READONLY_TOKEN}',
        GL_PROJECT_ID: '${process.env.GL_PROJECT_ID}',
        GH_TOKEN: '${process.env.GH_TOKEN}'
      }
      exports.vars = variables;
    `);
  
    bytenode.compileFile({
      filename: './variables.js',
      output: './variables.jsc',
<<<<<<< HEAD
      electron: true,
=======
      electron: true
>>>>>>> parent of 0615066 (some configuration)
    });
}