import { AppSpec } from '../../app-base/App'
import { ok } from '../../app-base/request'

async function get({ params: { url }, request }) {
  const req = { method: 'GET', url }
  const response = await request(req)
  return {
    type: 'tree',
    name: 'request',
    value: {
      ...req,
      response,
    },
    state: ok(response)
      ? {
          _showOnly: ['response', 'body'],
        }
      : {},
  }
}

async function makeNew({ action, params: { url }, request }) {
  return {
    type: 'tree',
    name: 'request',
    value: {
      method: action === 'new' ? 'POST' : action.toUpperCase(),
      url,
      ...(action !== 'delete' && { body: {} }),
    },
    state: {
      _actions: [{ name: 'send', title: 'Send', primary: true }],
      _expanded: true,
    },
  }
}

async function run({ action, params, request }) {
  if (action === 'get') {
    return await get({ params, request })
  } else {
    return await makeNew({ action, params, request })
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
          post: {
            params: ['url'],
          },
          patch: {
            params: ['url'],
          },
          put: {
            params: ['url'],
          },
          delete: {
            params: ['url'],
          },
          new: {
            params: ['url'],
          },
        },
      },
    },
    run,
  }
}
