const httpProxy = require('http-proxy')
const proxyPort = process.env.API_PORT
const targetPort = process.env.PORT
const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${targetPort}`,
})

proxy.on('proxyRes', function(proxyRes, req, res) {
  if (req.headers.origin === `http://localhost:${targetPort}`) {
    proxyRes.headers['access-control-allow-origin'] = '*'
    proxyRes.headers['access-control-allow-methods'] = '*'
  }
})

proxy.listen(proxyPort, () => {
  console.log(`Proxying port ${proxyPort} to ${targetPort}...`)
})
