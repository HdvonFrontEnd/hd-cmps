'use strict'
const DeclarationBundlerPlugin = /** @class */ (function() {
  var filterOutArr = [
    'index'
  ]
  function DeclarationBundlerPlugin(options) {
    if (options === void 0) { options = {} }
    this.out = options.out ? options.out : './build/'
    this.excludedReferences = options.excludedReferences ? options.excludedReferences : undefined
  }
  DeclarationBundlerPlugin.prototype.apply = function(compiler) {
    const _this = this
    // when the compiler is ready to emit files
    compiler.hooks.emit.tapAsync('DeclarationBundlerPlugin', function(compilation, callback) {
      // collect all generated declaration files
      // and remove them from the assets that will be emited
      const declarationFiles = {}
      for (const filename in compilation.assets) {
        if (filename.indexOf('.d.ts') !== -1) {
          // 提取文件名
          var reg = /([\w\d-\.]+)\.d\.ts$/
          var name = filename.match(reg)[1]
          name = name.split('.')[0] // 去除名字中可能有的.vue
          // 排除掉一些不希望提取的文件，例如index.d.ts
          if (!filterOutArr.includes(name)) {
            compilation.assets[_this.out + name + '.d.ts'] = compilation.assets[filename]
          }
          // 删除原来的文件
          delete compilation.assets[filename]
        }
      }
      // webpack may continue now
      callback()
    })
  }
  return DeclarationBundlerPlugin
}())
module.exports = DeclarationBundlerPlugin
