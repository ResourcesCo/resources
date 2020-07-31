import { AppSpec } from '../../app-base/App'

const actions = {
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
}

async function run({ action, channel }) {
  return await actions[action]({ channel })
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'channel',
    description: 'Manage this channel',
    resourceTypes: {
      root: {
        routes: [{ path: '/' }],
        actions: {
          clear: {
            params: [],
          },
          help: {
            params: [],
          },
        },
      },
    },
    run,
  }
}
