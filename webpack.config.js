var path = require('path');
var TerserPlugin = require('terser-webpack-plugin');

function createConfig(entry, filename) {
  return {
    entry: entry,
    output: {
      path: path.resolve(__dirname),
      filename: filename,
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
        }
      ]
    },
    externals: {
      'preact': 'commonjs preact'
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    }
  }
}

module.exports = [
  createConfig('./src/index.js', 'index.js'),
  createConfig('./src/preact/index.js', 'preact.js')
];
