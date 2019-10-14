/**
 * 待废弃，原mocha+chai+karma组合用
 */
const path = require('path')
const baseConfig = require('./webpack.base')
const merge = require('webpack-merge')
const config = require('./config')
const webpackConfig = {
  mode: 'development',
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: path.resolve(process.cwd(), './dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: config.babelinclude,
        loader: 'babel-loader'
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader'
      }
    ]
  }
}

module.exports = merge(baseConfig, webpackConfig)
