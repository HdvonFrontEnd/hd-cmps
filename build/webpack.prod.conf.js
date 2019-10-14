const path = require('path')
const baseConfig = require('./webpack.base')
const merge = require('webpack-merge')

const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = require('./config')

const isComponents = process.env.COMPONENTS_ENV
const components = require('../components.json')

const webpackConfig = {
  mode: 'production',
  entry: isComponents ? components : './src/index.js',
  output: {
    path: path.resolve(process.cwd(), './dist'),
    publicPath: '/dist/',
    filename: isComponents ? '[name].js' : 'index.js',
    chunkFilename: '[name].js',
    libraryTarget: isComponents ? 'commonjs2' : 'umd'
  },
  externals: config.externals,
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isComponents ? '/theme/[name].css' : '/theme/index.css',
      chunkFilename: '[name].css'
    })
  ]
}

if (!isComponents) {
  webpackConfig.output = Object.assign({}, {
    libraryExport: 'default',
    library: 'hd-cmps',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  }, webpackConfig.output)
}

module.exports = merge(baseConfig, webpackConfig)
