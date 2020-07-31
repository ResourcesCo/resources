import { AppSpec, RunProps } from '../../app-base/App'
import ConsoleChannel from '../../channel/ConsoleChannel'
import produce from 'immer'

function buildMessageOutput(message) {
  const treeMessages = message.messages.filter(msg => msg.type === 'tree')
  const inputMessages = message.messages.filter(msg => msg.type === 'input')
  const result: any = {
    id: message.id,
    input: inputMessages.length > 0 ? inputMessages[0] : undefined,
    tree: inputMessages.length > 0 ? treeMessages[0] : undefined,
    other: undefined,
  }
  result.other = message.messages.filter(
    msg => msg != result.input && msg != result.tree
  )
  return result
}

const actions = {
  root: {
    async clear() {
      return {
        type: 'clear',
      }
    },
    async help({ channel }) {
      const apps = {},
        appsState = { _expanded: true }
      for (const appName of Object.keys(channel.apps)) {
        apps[channel.apps[appName].name] = {
          name: channel.apps[appName].name,
          description: channel.apps[appName].description,
        }
      }
      return {
        type: 'tree',
        name: 'apps',
        value: {
          output: {
            intro: [
              `
                This is a Resources.co channel.
              `,
              `
                To run an action on a resource, compose a message with an action, prefixed with a colon,
                such as :get, :patch, :complete, and :comment, and an absolute or relative URL.
              `,
              `
                Relative URLs here are relative to this channel, and are defined by apps. For instance,
                /github/ResourcesCo/resources is defined by the github app.
              `,
              `
                Actions can appear before or after commands. This can be convenient when running actions
                on the same URL, for instance, a :get followed by a :patch.
              `,
            ].map(s => s.replace(/\s+/g, ' ').trim()),
            apps,
          },
        },
        state: {
          _showOnly: ['output'],
          output: {
            apps: {
              _expanded: true,
            },
          },
        },
        rules: {
          apps: {
            sel: '/output/apps/:index',
            inline: [
              {
                type: 'node',
                path: ['description'],
                showLabel: false,
              },
              {
                type: 'action',
                name: 'help',
                params: {
                  name: '0/name',
                },
                url: '/:name',
                action: 'help',
                args: 'app',
              },
            ],
          },
        },
      }
    },
  },
  channel: {
    async clear() {
      return {
        type: 'clear',
      }
    },
  },
  messages: {
    get({ channel }: { channel: ConsoleChannel }) {
      const { messages, messageIds } = channel
      const output = messageIds.map(id => buildMessageOutput(messages[id]))
      return {
        type: 'tree',
        value: { output },
        state: {
          _showOnly: ['output'],
        },
        rules: {
          apps: {
            sel: '/output/:index',
            inline: [
              {
                type: 'node',
                path: ['input', 'text'],
                showLabel: false,
              },
              {
                type: 'action',
                name: 'get',
                params: {
                  id: '0/id',
                },
                url: '/messages/:id',
                action: 'get',
              },
            ],
          },
        },
      }
    },
  },
  message: {
    async get({
      channel,
      params: { id },
    }: {
      channel: ConsoleChannel
      params: { [key: string]: string }
    }) {
      const message = channel.messages[id]
      if (message) {
        const output = buildMessageOutput(message)
        return {
          type: 'tree',
          value: { output },
          state: {
            _showOnly: ['output'],
          },
        }
      } else {
        return {
          type: 'tree',
          value: { error: 'message not found' },
          state: {
            _showOnly: ['error'],
          },
        }
      }
    },
  },
}

async function run({ resourceType, action, ...params }: RunProps) {
  return await actions[resourceType][action](params)
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'channel',
    description: 'Manage this channel',
    resourceTypes: {
      root: {
        routes: [{ path: '/' }],
        actions: {
          help: {
            params: [],
          },
          clear: {
            params: [],
          },
        },
      },
      channel: {
        routes: [{ path: '/channel' }],
        actions: {
          clear: {
            params: [],
          },
        },
      },
      messages: {
        routes: [{ path: '/messages' }],
        defaultAction: 'get',
        actions: {
          get: {
            params: [],
          },
          clear: {
            params: [],
          },
        },
      },
      message: {
        routes: [{ path: '/messages/:id' }],
        defaultAction: 'get',
        actions: {
          get: {
            params: ['path?'],
          },
          expand: {
            params: ['path'],
          },
          collapse: {
            params: ['path'],
          },
        },
      },
    },
    run,
  }
}
