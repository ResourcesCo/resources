let defaultPresets

// based on Material-UI config

// We release a ES version of Material-UI.
// It's something that matches the latest official supported features of JavaScript.
// Nothing more (stage-1, etc), nothing less (require, etc).
if (process.env.BABEL_ENV === 'es') {
  defaultPresets = []
} else {
  defaultPresets = [
    [
      '@babel/preset-env',
      {
        modules: ['esm', 'production-umd'].includes(process.env.BABEL_ENV)
          ? false
          : 'commonjs',
      },
    ],
  ]
}

const productionPlugins = []

module.exports = {
  presets: ['next/babel'],
  env: {
    esm: {
      plugins: [
        ...productionPlugins,
        ['@babel/plugin-transform-runtime', { useESModules: true }],
      ],
    },
    es: {
      plugins: [
        ...productionPlugins,
        ['@babel/plugin-transform-runtime', { useESModules: true }],
      ],
    },
    production: {
      plugins: [
        ...productionPlugins,
        ['@babel/plugin-transform-runtime', { useESModules: true }],
      ],
    },
    'production-umd': {
      plugins: [
        ...productionPlugins,
        ['@babel/plugin-transform-runtime', { useESModules: true }],
      ],
    },
    development: {
      plugins: [
        'module-resolver',
        {
          alias: {
            vtv: '../vtv/src',
          },
        },
      ],
    },
  },
}
