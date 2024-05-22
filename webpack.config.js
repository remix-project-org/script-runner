const path = require('path');
const webpack = require('webpack')
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
  entry: './src/script-runner.js',
  target: ['web'],
  output: {
    filename: './script-runner.js',
    path: path.resolve(__dirname, 'build')
  },
  externals: {
    'ganache': 'var {}'
  },
  resolve: {
    fallback: {
      assert: false,
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      'process/browser': require.resolve("process/browser"),
      buffer: require.resolve("buffer"),
      fs: false,
      os: false,
      crypto: require.resolve("crypto-browserify"),
      constants: require.resolve("constants-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      zlib: false,
      'child_process': false
    },
    alias: {
      process: 'process/browser',
    }
  },
  experiments: {
    syncWebAssembly: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: 'process/browser',
    }),
    //new BundleAnalyzerPlugin()
  ]
};