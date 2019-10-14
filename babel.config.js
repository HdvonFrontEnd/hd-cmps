module.exports = function(api) {
  api.cache(true)
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          'useBuiltIns': 'entry'
        }
      ]
    ],
    plugins: [
      'dynamic-import-node',
      '@babel/plugin-proposal-class-properties',
      ['@babel/plugin-proposal-decorators', { 'legacy': true }]
    ],
    env: {
      'test': {
        plugins: ['require-context-hook'],
        presets: [
          [
            '@babel/preset-env',
            {
              'targets': { 'node': 'current' }
            }
          ]
        ]
      }
    }
  }
}
