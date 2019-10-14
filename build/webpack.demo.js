const path = require('path')
const baseConfig = require('./webpack.base')
const merge = require('webpack-merge')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')

const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const config = require('./config')

const { HashedModuleIdsPlugin } = require('webpack')

const isProd = process.env.NODE_ENV === 'production'
const isGithubPages = process.env.GITHUB_PAGES === 'gh-pages'

const webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: './examples/entry.js',
  output: {
    path: path.resolve(process.cwd(), './lib/'),
    publicPath: isProd && isGithubPages ? '/hd-cmps' : '/',
    filename: '[name].[chunkhash:7].js',
    chunkFilename: isProd ? '[name].[chunkhash:7].js' : '[name].js'
  },
  devServer: {
    index: 'index.html',
    host: config.devServer.host,
    port: config.devServer.port,
    noInfo: false,
    quiet: true, // necessary for FriendlyErrorsPlugin
    proxy: config.devServer.proxyTable
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: config.eslintexclude
      },
      {
        test: /\.(jsx?|babel|es6)$/,
        include: config.babelinclude,
        loader: 'babel-loader'
      },
      {
        test: /\.(scss|css)$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          },
          {
            loader: 'hd-md-loader'
          }
        ]
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new HashedModuleIdsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './examples/index.html',
      chunks: ['main']
    }),
    // copy custom static assets
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static'),
    //     to: 'static',
    //     ignore: ['.*']
    //   }
    // ]),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${config.devServer.host}:${config.devServer.port}`]
      },
      onErrors: undefined
    })
  ],
  optimization: {
    minimizer: []
  }
}

if (isProd) {
  webpackConfig.plugins.push(
    ...[
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:7].css'
      })
    ]
  )
  webpackConfig.optimization.minimizer.push(...[
    new TerserJSPlugin({}),
    new OptimizeCSSAssetsPlugin({})
  ])
}

module.exports = merge(baseConfig, webpackConfig)
