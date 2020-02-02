import { getPaths, splitPath, joinPath } from 'vtv'

export default {
  commands: {
    get_paths: {
      args: ['data'],
      help: 'get paths in some data',
      run({ args: { data } }) {
        const result = getPaths(JSON.parse(data)).map(joinPath)
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
    splitPath: {
      args: ['str'],
      help: 'split a path with j2ref',
      run({ args: { str } }) {
        const result = splitPath(str)
        return {
          type: 'tree',
          name: 'result',
          value: result,
        }
      },
    },
    joinPath: {
      args: ['data'],
      help: 'join a path with joinPath',
      run({ args: { data } }) {
        let parsedData
        try {
          parsedData = JSON.parse(data)
        } catch (err) {
          return {
            type: 'error',
            text: 'Invalid JSON',
          }
        }
        const result = joinPath(parsedData)
        return {
          type: 'tree',
          name: 'result',
          value: result,
        }
      },
    },
  },
}
