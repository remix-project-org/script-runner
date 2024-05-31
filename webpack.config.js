const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/script-runner.ts', // Update the entry point to your TypeScript file
  target: ['web'],
  output: {
    filename: './script-runner.js',
    path: path.resolve(__dirname, 'build')
  },
  externals: {
    'ganache': 'var {}'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'], // Add '.ts' and '.tsx' as resolvable extensions
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
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Use a regex to test for .ts and .tsx files
        use: 'ts-loader', // Use ts-loader to transpile TypeScript files
        exclude: /node_modules/,
      },
    ],
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
