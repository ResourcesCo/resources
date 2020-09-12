import { AppSpec } from '../../app-base/App'
import { cloneDeep as clone } from 'lodash'

const themes = [{ name: 'dark' }, { name: 'light' }]

const actions = {
  themes: {
    async get() {
      return {
        type: 'tree',
        value: {
          output: clone(themes),
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
                type: 'action',
                name: 'activate',
                params: { name: '0/name' },
                url: '/themes/-/:name',
                action: 'activate',
              },
            ],
          },
        },
      }
    },
  },
  theme: {
    async activate({ params: { theme }, onMessage }) {
      if (themes.find((t) => t.name === theme)) {
        onMessage({
          type: 'set-theme',
          theme,
        })
        return {
          type: 'tree',
          value: {
            output: `${theme} theme activated.`,
          },
          state: {
            _showOnly: ['output'],
          },
        }
      } else {
        return {
          type: 'tree',
          value: {
            error: `Theme ${theme} not found.`,
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
    name: 'themes',
    title: 'themes',
    description: 'activate theme',
    resourceTypes: {
      themes: {
        defaultAction: 'get',
        routes: [{ path: '/themes' }],
        actions: {
          get: {
            params: [],
          },
        },
      },
      theme: {
        routes: [{ path: '/themes/-/:theme' }],
        defaultAction: 'activate',
        actions: {
          activate: {
            params: [],
          },
        },
      },
    },
    run,
  }
}
