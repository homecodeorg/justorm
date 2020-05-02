var path = require('path');
var TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  function createConfig(entry, filename) {
    var config = {
      entry: entry,
      output: {
        path: path.resolve(__dirname),
        filename: filename,
        libraryTarget: 'commonjs'
      },
      externals: {
        'preact': 'commonjs preact'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            exclude: /node_modules/,
          }
        ]
      }
    };

    if (isDev) {
      config.devtool = 'source-map';
    } else {
      config.optimization = {
        minimize: true,
        minimizer: [new TerserPlugin()]
      }
    }

    return config;
  }

  return [
    createConfig('./src/index.js', 'index.js'),
    createConfig('./src/preact/index.js', 'preact.js')
  ]
};
