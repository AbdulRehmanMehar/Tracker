const mix = require('laravel-mix')
const nodeExternals = require('webpack-node-externals');

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
})
  .setPublicPath('./bundle')
  .js('react/src/index.js', 'bundle/js').react()
  .sourceMaps()
  .setResourceRoot('./bundle/');