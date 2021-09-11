const bytenode = require('bytenode')

bytenode.compileFile({
    filename: './app.js',
    output: './app.jsc',
    electron: true
});

bytenode.compileFile({
    filename: './bundle/js/index.js',
    output: './bundle/js/index.jsc',
    electron: true
});