const fs = require('fs');
const bytenode = require('bytenode');
const isPackaged = require('electron-is-packaged').isPackaged;

bytenode.compileFile({
    filename: './app.js',
    output: './app.jsc',
<<<<<<< HEAD
<<<<<<< HEAD
    electron: true,
=======
    electron: true
>>>>>>> parent of 0615066 (some configuration)
=======
    electron: true,
    compileAsModule: true
>>>>>>> 0615066006d43f3780f21aa2e5df6c4f34db719e
});

bytenode.compileFile({
    filename: './bundle/js/index.js',
    output: './bundle/js/index.jsc',
<<<<<<< HEAD
<<<<<<< HEAD
    electron: true,
=======
    electron: true
>>>>>>> parent of 0615066 (some configuration)
=======
    electron: true,
    compileAsModule: true
>>>>>>> 0615066006d43f3780f21aa2e5df6c4f34db719e
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
<<<<<<< HEAD
<<<<<<< HEAD
      electron: true,
=======
      electron: true
>>>>>>> parent of 0615066 (some configuration)
=======
      electron: true,
      compileAsModule: true
>>>>>>> 0615066006d43f3780f21aa2e5df6c4f34db719e
    });
}