var webpack = require('webpack')
var path = require('path')

function resolve (relativePath) {
  return path.resolve(relativePath);
}
console.log(resolve('dist'))

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path:  resolve('dist'),
    filename: '[name].min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
  ]
}
