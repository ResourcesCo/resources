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
        dirs: ['packages/vtv/src', 'packages/console/src'],
      })
    )

    if (process.env.ELECTRON === 'true') {
      config.target = 'electron-renderer'
    }

    return config
  },
  env: { API_BASE: process.env.API_BASE },
})
