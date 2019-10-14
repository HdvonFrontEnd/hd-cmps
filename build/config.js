const path = require('path')
const nodeExternals = require('webpack-node-externals')

// 路径别名
exports.alias = {
  static: path.resolve(__dirname, '../static'),
  src: path.resolve(__dirname, '../src'),
  packages: path.resolve(__dirname, '../packages'),
  examples: path.resolve(__dirname, '../examples'),
  node_modules: path.resolve(__dirname, '../node_modules'),
  'hd-cmps': path.resolve(__dirname, '../'),
  types: path.resolve(__dirname, '../types')
}

// externals配置
exports.externals = [{ vue: 'vue' }, { 'element-ui': 'element-ui' }, nodeExternals()]

// babel 排除
exports.babelexclude = /node_modules/

// babel 包含
exports.babelinclude = [
  path.resolve(__dirname, '../src'),
  path.resolve(__dirname, '../packages'),
  path.resolve(__dirname, '../examples'),
  path.resolve(__dirname, '../test'),
  path.resolve(__dirname, '../node_modules/vue-picture-input'),
  path.resolve(__dirname, '../node_modules/element-ui/src'),
  path.resolve(__dirname, '../node_modules/vue-echarts'),
  path.resolve(__dirname, '../node_modules/resize-detector'),
  path.resolve(__dirname, '../node_modules/element-ui/packages')
]
// eslint 排除
exports.eslintexclude = /node_modules/

// dev server proxy table
const proxyTable = {
  '/gis': {
    target: 'http://this.is.a.fake.url:83',
    changeOrigin: true,
    pathRewrite: {
      '^/gis': ''
    }
  }
}

// dev server
exports.devServer = {
  host: '0.0.0.0',
  port: 8920,
  proxyTable
}
