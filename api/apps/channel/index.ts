import { AppSpec } from '../../app-base/App'

export const channelData = { apps: null }

const actions = {
  async clear() {
    return {
      type: 'clear',
    }
  },
  async help() {
    return {
      type: 'tree',
      name: 'apps',
      value: Object.keys(channelData.apps),
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
