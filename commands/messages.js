export default {
  defaultAction: 'get',
  actions: {
    get: {
      params: [],
      help: 'get the contents of a node',
      run({ resourcePath }) {
        return {
          type: 'message-get',
          parentCommandId: resourcePath[1],
          path: resourcePath.slice(2),
        }
      },
    },
    expand: {
      params: [],
      help: 'expand a node',
      run({ resourcePath }) {
        return {
          type: 'message-command',
          parentCommandId: resourcePath[1],
          path: resourcePath.slice(2),
          state: {
            _expanded: true,
          },
        }
      },
    },
    collapse: {
      params: [],
      help: 'expand a node',
      run({ resourcePath }) {
        return {
          type: 'message-command',
          parentCommandId: resourcePath[1],
          path: resourcePath.slice(2),
          state: {
            _expanded: false,
          },
        }
      },
    },
  },
}
