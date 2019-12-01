const request = async ({
  path,
  env: {gateway_url, username, password},
  clientGatewayEnv: {url: clientGatewayUrl, token: clientGatewayToken},
  json = true,
  ...options,
}) => {
  const headers = {
    Authorization: `Basic ${btoa(username + ":" + password)}`,
    'x-client-gateway-server': gateway_url,
    'x-client-gateway-token': clientGatewayToken,
  }
  const res = await fetch(`${clientGatewayUrl}/proxy${path}`, {headers, ...options})
  const data = await (json ? res.json : res.text).call(res)
  return {res, data}
}

export default {
  dependencies: ['client-gateway'],
  filters: {
    before({
      command: {name},
      env: {gateway_url, username, password},
    }) {
      if (name !== 'auth' && !(gateway_url && username && password)) {
        return {type: 'error', text: 'No OpenFaaS config given. Run "help" for info.'}
      }
    },
  },
  commands: {
    auth: {
      args: ['gateway-url', 'username', 'password'],
      help: 'store config for OpenFaaS',
      run({args: {gateway_url, username, password}}) {
        return [
          {type: 'env', value: {gateway_url, username, password}},
          {type: 'text', text: 'Saved!'},
        ]
      },
    },
    functions: {
      args: [],
      help: 'show OpenFaaS functions',
      async run({env, dependencies: {client_gateway: {env: clientGatewayEnv}}}) {
        const {res, data} = await request({path: '/system/functions', env, clientGatewayEnv})
        if (Array.isArray(data)) {
          if (data.length > 0) {
            return {
              type: 'data',
              data: data,
              keyField: 'name',
              title: 'name',
            }
          } else {
            return {type: 'text', text: 'No functions found'}
          }
        } else {
          return {type: 'text', text: 'Error getting issues'}
        }
      },
    },
    call: {
      args: ['name', 'input'],
      help: 'call an OpenFaaS function',
      async run({args: {name, input}, env, dependencies: {client_gateway: {env: clientGatewayEnv}}}) {
        const {res, data} = await request({
          path: `/function/${name}`,
          env,
          clientGatewayEnv,
          method: 'post',
          body: input,
          json: false
        })
        return {type: 'code', text: data}
      },
    },
  },
}
