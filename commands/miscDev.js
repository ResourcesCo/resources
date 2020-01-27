import { getPaths, displayPath } from 'vtv'

export default {
  commands: {
    get_paths: {
      args: ['data'],
      help: 'get paths in some data',
      run({ args: { data } }) {
        const result = getPaths(JSON.parse(data)).map(displayPath)
        return {
          type: 'tree',
          name: 'result',
          value: result,
          state: {
            _expanded: true,
          },
        }
      },
    },
  },
}
