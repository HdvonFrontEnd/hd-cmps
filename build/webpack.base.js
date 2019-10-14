const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const DeclarationBundlerPlugin = require('./plugin/bundleDTs.js')

const config = require('./config')

const isProd = process.env.NODE_ENV === 'production'

const webpackConfig = {
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
    alias: config.alias,
    modules: ['node_modules']
  },
  performance: {
    hints: false
  },
  stats: {
    children: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin()
  ]
}

if (isProd) {
  // 关闭自动生成d.ts的功能
  // 最好还是检查一下，现在对子组件的处理不太好
  // webpackConfig.plugins.push(
  //   new DeclarationBundlerPlugin({
  //     out: '../types/'
  //   })
  // )
}

module.exports = webpackConfig
