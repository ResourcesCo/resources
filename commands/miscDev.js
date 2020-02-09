import { getPaths, splitPath, joinPath, parseCommand } from 'vtv'

export default {
  actions: {
    get_paths: {
      params: ['data'],
      help: 'get paths in some data',
      run({ params: { data } }) {
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
      params: ['str'],
      help: 'split a path with j2ref',
      run({ params: { str } }) {
        const result = splitPath(str)
        return {
          type: 'tree',
          name: 'result',
          value: result,
        }
      },
    },
    joinPath: {
      params: ['data'],
      help: 'join a path with joinPath',
      run({ params: { data } }) {
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
    parseCommand: {
      params: ['input'],
      help: 'parse argument as a command',
      run({ params: { input } }) {
        const result = parseCommand(input)
        return {
          type: 'tree',
          name: 'result',
          value: result,
        }
      },
    },
  },
}
