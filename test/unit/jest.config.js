module.exports = {
  rootDir: '../../',
  verbose: true,
  setupFiles: ['<rootDir>/test/unit/polyfill/register-context.js'],
  testRegex: 'specs/.*.js$', // 只测试specs文件夹下的
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
    'vue'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(vue-echarts|element-ui/src/utils)/)' // 为某些第三方模块做转码
  ],
  transform: {
    // process `*.vue` files with `vue-jest`
    '.*\\.(vue)$': 'vue-jest',
    // process js with `babel-jest`
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    // process `*.ts` files with `ts-jest`
    '^.+\\.tsx?$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub'
  },
  'moduleNameMapper': {
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.js',
    '^static/(.*)$': '<rootDir>/static/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^packages/(.*)$': '<rootDir>/packages/$1',
    '^node_modules/(.*)$': '<rootDir>/node_modules/$1',
    '^types/(.*)$': '<rootDir>/types/$1',
    '^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub'
  },
  'collectCoverage': true,
  'collectCoverageFrom': [
    'src/**/*.{js,jsx,vue}',
    'packages/**/*.{js,jsx,vue}'
  ],
  'coverageDirectory': '<rootDir>/test/unit/coverage/',
  'coverageReporters': ['html', 'text-summary']
}
