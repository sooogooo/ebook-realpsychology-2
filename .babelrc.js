module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not dead']
      },
      modules: false,
      useBuiltIns: 'usage',
      corejs: 3
    }]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
    [
      'module-resolver',
      {
        root: ['./website/assets'],
        alias: {
          '@': './website/assets',
          '@js': './website/assets/js',
          '@css': './website/assets/css',
          '@svg': './website/assets/svg'
        }
      }
    ]
  ],
  env: {
    production: {
      plugins: [
        'transform-remove-console',
        'transform-remove-debugger'
      ]
    },
    development: {
      plugins: [
        '@babel/plugin-transform-react-jsx-source'
      ]
    }
  }
};