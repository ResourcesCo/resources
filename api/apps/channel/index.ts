import { AppSpec } from '../../app-base/App'

const actions = {
  async clear() {
    return {
      type: 'clear',
    }
  },
  async help({ channel }) {
    const apps = {}
    for (const appName of Object.keys(channel.apps)) {
      apps[appName] = {
        description: channel.apps[appName].description,
        more: `:help /${appName}`,
      }
    }
    return {
      type: 'tree',
      name: 'apps',
      value: {
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
    }
  },
}

async function run({ action, channel }) {
  return await actions[action]({ channel })
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'request',
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
