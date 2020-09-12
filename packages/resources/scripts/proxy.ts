import { createServer } from 'http'
import { createProxyServer } from 'http-proxy'

const proxyPort = Number(process.env.PROXY_PORT)
const targetPort = Number(process.env.PORT)

const proxy = createProxyServer({
  target: `http://localhost:${targetPort}`,
})

const corsHeaders = {
  'access-control-allow-origin': `http://localhost:${targetPort}`,
  'access-control-allow-methods':
    'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
  'access-control-allow-headers': 'Content-Type, Authorization',
}

proxy.on('proxyRes', function(proxyRes, req, res) {
  if (req.headers.origin === `http://localhost:${targetPort}`) {
    for (const key of Object.keys(corsHeaders)) {
      proxyRes.headers[key] = corsHeaders[key]
    }
  }
})

const server = createServer(function(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { ...corsHeaders })
    res.end()
  } else {
    proxy.web(req, res, {
      target: `http://localhost:${targetPort}`,
    })
  }
})

server.listen(proxyPort, '127.0.0.1', () => {
  console.info(`Proxying http://127.0.0.1:${proxyPort} to ${targetPort}...`)
})
