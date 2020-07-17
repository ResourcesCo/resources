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
          response: {
            body: {
              _expanded: true,
            },
          },
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
      headers: {},
      ...(action !== 'delete' && { body: {} }),
    },
    state: {
      _actions: [{ name: 'send', title: 'Send', primary: true }],
      _expanded: true,
    },
  }
}

async function send({
  action,
  params,
  request,
  formData,
  parentMessage,
  onMessage,
}) {
  onMessage({
    type: 'message-command',
    action: 'clearErrors',
  })
  const v = parentMessage.value
  const req = {
    url: v.url,
    method: v.method,
    headers: v.headers,
    body: v.body,
  }
  if (typeof req.url === 'string' && req.url.length > 0) {
    const response = await request(req)
    return {
      type: 'message-command',
      action: 'set',
      path: ['response'],
      value: response,
    }
  } else {
    return {
      type: 'message-command',
      action: 'setError',
      path: ['url'],
      error: 'Invalid URL',
    }
  }
}

async function run({
  action,
  params,
  request,
  formData,
  parentMessage,
  onMessage,
}) {
  if (formData) {
    return await send({
      action,
      params,
      request,
      formData,
      parentMessage,
      onMessage,
    })
  } else if (action === 'get') {
    return await get({ params, request })
  } else {
    return await makeNew({ action, params, request })
  }
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'request',
    resourceTypes: {
      request: {
        routes: [{ path: '/request' }],
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
