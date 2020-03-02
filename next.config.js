const withCSS = require('@zeit/next-css')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')

module.exports = withCSS({
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    }

    config.resolve.extensions.push('.jsx')

    config.optimization.minimizer = []

    config.plugins.push(
      new ExtraWatchWebpackPlugin({
        dirs: ['node_modules/vtv/src', 'node_modules/@resources/console/src'],
      })
    )

    if (process.env.ELECTRON === 'true') {
      config.target = 'electron-renderer'
    }

    return config
  },
})
