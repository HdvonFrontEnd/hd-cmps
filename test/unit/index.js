// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// 排除nav-list.js，因为nav-list.js里面会引入md文件
const srcContext = require.context('../../src', true, /^\.\/(?!nav-list(\.js)?$)/)
srcContext.keys().forEach(srcContext)
