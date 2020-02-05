export default {
  actions: {
    config: {
      params: ['url', 'token'],
      help: 'configure client-gateway with a url and a token',
      run({ params: { url, token } }) {
        return [
          { type: 'env', value: { url, token } },
          { type: 'text', text: 'Saved!' },
        ]
      },
    },
  },
}
