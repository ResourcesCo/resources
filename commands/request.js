export default {
  commands: {
    get: {
      args: ['url'],
      help: 'Make a GET request',
      async run({args: {url}}) {
        const timeout = 5000
        const controller = new AbortController()
        try {
          const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
          })
          const data = await response.json()
          return {
            type: 'tree',
            name: 'request',
            value: {
              method: 'get',
              url,
              response: {
                headers: response.headers,
                body: data
              }
            }
          }
        } catch (err) {
          return {type: 'text', text: err.toString()}
        }
        setTimeout(() => controller.abort(), timeout)
      },
    }
  }
}
