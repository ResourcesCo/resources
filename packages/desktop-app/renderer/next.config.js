const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  webpack: config => {
    const result = Object.assign(config, {
      target: 'electron-renderer',
    })
    config.resolve.extensions.push('.jsx')
    config.plugins.push(
      new ExtraWatchWebpackPlugin({
        dirs: ['renderer/packages/vtv/src', 'renderer/packages/console/src'],
      })
    )
    return result
  },
})
