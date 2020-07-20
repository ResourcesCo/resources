import { AppSpec } from '../../app-base/App'

export const channelData = { apps: null }

const actions = {
  async clear() {
    return {
      type: 'clear',
    }
  },
  async help() {
    console.log(channelData.apps)
    const apps = {}
    for (const appName of Object.keys(channelData.apps)) {
      apps[appName] = {
        description: 'add description to apps',
        more: `:help /${appName}`,
      }
    }
    return {
      type: 'tree',
      name: 'apps',
      value: {
        intro: [
          `
            To run an action on a resource, compose a message with an action, prefixed with a colon,
            such as :get, :patch, :complete, and :comment, and an absolute or relative URL.'
          `
            .replace(/\s+/g, ' ')
            .trim(),
          `
            Relative URLs here are relative to this channel, and are defined by apps. For instance,
            /github/ResourcesCo/resources is defined by the github app.
          `
            .replace(/\s+/g, ' ')
            .trim(),
          `
            Actions can appear before or after commands. This can be convenient when running actions
            on the same URL, for instance, a :get followed by a :patch.
          `
            .replace(/\s+/g, ' ')
            .trim(),
        ],
        apps,
      },
    }
  },
}

async function run({ action }) {
  return await actions[action]()
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'request',
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
