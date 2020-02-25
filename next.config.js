const withCSS = require('@zeit/next-css')
const withTM = require('next-transpile-modules')(['vtv', '@resources/console'])

module.exports = withTM(
  withCSS({
    webpack: config => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: 'empty',
      }

      config.optimization.minimizer = []

      return config
    },
  })
)
