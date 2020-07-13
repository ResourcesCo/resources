import { AppSpec } from '../../app-base/App'

async function run({ action, params: { url }, request }) {
  const response = await request({ method: 'GET', url })
  return {
    type: 'tree',
    name: 'response',
    value: response,
  }
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'requests',
    resourceTypes: {
      requests: {
        routes: [{ path: '/requests' }],
        actions: {
          get: {
            params: ['url'],
          },
        },
      },
    },
    run,
  }
}
