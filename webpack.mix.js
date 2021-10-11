const fs = require('fs')
const mix = require('laravel-mix')
const nodeExternals = require('webpack-node-externals');

if (process.argv[3] && process.argv[3] == '--hot') {
    // if (!fs.existsSync('./bundle/index.html')) {
    //     fs.writeFileSync('./bundle/index.html', `
    //
    //     <!DOCTYPE html>
    //     <html lang="en">
    //         <head>
    //             <meta charset="UTF-8">
    //             <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //             <title>Zepto</title>
    //         </head>
    //         <body>
    //             <div id="root"></div>
    //             <script src="http://localhost:3000/js/index.js"></script>
    //         </body>
    //     </html>
    // `);
    // }

    // mix.browserSync({
    //     host: '127.0.0.1',
    //     proxy: 'localhost',
    //     open: false,
    //     files: [
    //         'react/src/**.js',
    //         'react/src/**.jsx',
    //         'react/src/**/*.jsx',
    //     ],
    //     watchOptions: {
    //         usePolling: true,
    //         interval: 500
    //     },
    //     localOnly: true
    // });

    // mix.options({
    //     hmrOptions: {
    //         host: "localhost",
    //         port: 3000,
    //     },
    // });

    // mix.webpackConfig({
    //     devServer: {
    //         host: "0.0.0.0",
    //         port: 3000,
    //         hot: true
    //     },
    // });

} else {
    mix.setResourceRoot('./bundle/')
}
mix.disableNotifications();

mix.webpackConfig({
  target: 'node',
  externals: [ nodeExternals() ],
  node: {
      __dirname: false,
      __filename: false
  }
})

mix.webpackConfig({
    resolve: {
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": false,
            "https": false,
            "stream": false,
            "crypto": false,
            "os": false,
            "child_process": false,
            "iconv": false,
            "crypto-browserify": require.resolve('crypto-browserify')
        },
        
    }
});
mix.setPublicPath('./bundle')
  .js('react/src/index.js', 'bundle/js')
    .react()
  .sourceMaps()
    .version();

