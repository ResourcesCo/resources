import { AppSpec } from '../../app-base/App'
import clone from 'lodash/cloneDeep'
import { getPaths, splitPath, joinPath, parseCommand } from '../../../vtv-model'

const functions = { getPaths, splitPath, joinPath, parseCommand }
const functionInfo = [
  {
    name: 'getPaths',
    description: 'get the paths with data in a collection',
    category: 'analyze',
    inputType: 'json',
  },
  {
    name: 'splitPath',
    description: 'split a string like a.b.c into an array',
    category: 'paths',
    inputType: 'str',
  },
  {
    name: 'joinPath',
    description: 'join a path array into a string like a.b.c',
    category: 'paths',
    inputType: 'json',
  },
  {
    name: 'parseCommand',
    description: 'parse a command (message)',
    category: 'messages',
    inputType: 'str',
  },
]

const actions = {
  functions: {
    async get() {
      return {
        type: 'tree',
        value: {
          output: clone(functionInfo),
        },
        state: {
          _showOnly: ['output'],
        },
        rules: {
          theme: {
            sel: '/output/:index',
            inline: [
              {
                type: 'node',
                path: ['name'],
                showLabel: false,
              },
              {
                type: 'node',
                path: ['description'],
                showLabel: false,
              },
              {
                type: 'node',
                path: ['category'],
                showLabel: false,
              },
              {
                type: 'action',
                name: 'run',
                params: { name: '0/name' },
                url: '/console-dev/functions/:name',
                action: 'run',
                args: '<input>',
              },
            ],
          },
        },
      }
    },
  },
  function: {
    async run({ params: { function: name, input } }) {
      const fi = functionInfo.find(fi => fi.name === name)
      if (fi) {
        let parsedInput = input
        let output
        if (fi.inputType === 'json') {
          try {
            parsedInput = JSON.parse(input)
          } catch (e) {
            return {
              type: 'tree',
              value: {
                error: 'Error parsing input as JSON',
              },
              state: {
                _showOnly: ['error'],
              },
            }
          }
        }
        try {
          output = functions[name](parsedInput)
        } catch (e) {
          return {
            type: 'tree',
            value: {
              error: 'Error running function',
            },
            state: {
              _showOnly: ['error'],
            },
          }
        }
        return {
          type: 'tree',
          value: {
            output,
          },
          state: {
            _showOnly: ['output'],
          },
        }
      } else {
        return {
          type: 'tree',
          value: {
            error: `Function ${name} not found.`,
          },
          state: {
            _showOnly: ['error'],
          },
        }
      }
    },
  },
}

async function run({ resourceType, action, ...params }) {
  return await actions[resourceType][action](params)
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'console-dev',
    title: 'ConsoleDev',
    description: 'Resources.co console dev utilities',
    resourceTypes: {
      root: {
        routes: [{ path: '/console-dev' }],
        actions: {},
      },
      functions: {
        defaultAction: 'get',
        routes: [{ path: '/console-dev/functions' }],
        actions: {
          get: {
            params: [],
          },
        },
      },
      function: {
        routes: [{ path: '/console-dev/functions/:function' }],
        defaultAction: 'run',
        actions: {
          run: {
            params: ['input'],
          },
        },
      },
    },
    run,
  }
}
