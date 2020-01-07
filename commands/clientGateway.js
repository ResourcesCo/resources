export default {
  commands: {
    config: {
      args: ['url', 'token'],
      help: 'configure client-gateway with a url and a token',
      run({args: {url, token}}) {
        return [
          {type: 'env', value: {url, token}},
          {type: 'text', text: 'Saved!'},
        ]
      },
    },
  },
}
