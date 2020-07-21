import { AppSpec } from '../../app-base/App'
import { ok } from '../../app-base/request'

function getHeaders(apiToken, post = false) {
  return {
    Authorization: `Bearer ${apiToken}`,
    ...(post ? { 'Content-Type': 'application/json' } : {}),
  }
}

function auth({ env, params: { apiToken } }) {
  env.ASANA_TOKEN = apiToken
  return 'API key saved to session.'
}

function authClear({ env }) {
  delete env.ASANA_TOKEN
  return 'API key cleared.'
}

async function complete({
  env: { ASANA_TOKEN: apiToken },
  params: { id },
  request,
}) {
  const response = await request({
    url: `https://app.asana.com/api/1.0/tasks/${id}`,
    method: 'PUT',
    headers: getHeaders(apiToken, true),
    body: { data: { completed: true } },
  })
  if (ok(response)) {
    return { type: 'text', text: `Task marked complete` }
  } else {
    return { type: 'text', text: `Error marking task complete` }
  }
}

async function comment({
  env: { ASANA_TOKEN: apiToken },
  params: { id, comment },
  request,
}) {
  const response = await request({
    headers: getHeaders(apiToken, true),
    url: `https://app.asana.com/api/1.0/tasks/${id}/stories`,
    method: 'POST',
    body: { data: { text: comment } },
  })
  if (ok(response)) {
    return { type: 'text', text: 'Comment added.' }
  } else {
    return { type: 'text', text: 'Error adding comment.' }
  }
}

async function run({ action, env, params, request }) {
  if (action === 'auth') {
    return auth({ env, params })
  } else if (action === 'auth/clear') {
    return authClear({ env })
  } else {
    if (env.ASANA_TOKEN) {
      if (action === 'complete') {
        return await complete({ env, params, request })
      } else if (action === 'comment') {
        return await comment({ env, params, request })
      }
    } else {
      return { type: 'error', text: 'An Asana token is required.' }
    }
  }
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'Asana',
    environmentVariables: {
      ASANA_TOKEN: {
        doc: `
          An Asana personal access token, from the
          [Asana developer console](https://app.asana.com/0/developer-console)'
        `,
      },
    },
    description: 'Manage tasks on Asana',
    resourceTypes: {
      tasks: {
        routes: [
          {
            host: 'app.asana.com',
            path: '/0/:projectId/:id{/f}?',
          },
          { path: '/asana/tasks/:id' },
        ],
        actions: {
          get: {
            params: [],
            request: {
              method: 'GET',
              url: '/tasks/:id',
            },
            docUrl: 'https://developers.asana.com/docs/get-a-task',
          },
          comment: {
            params: ['comment'],
          },
          complete: {
            params: [],
          },
        },
      },
      auth: {
        routes: [
          {
            host: 'app.asana.com',
            path: '/:any*',
          },
          { path: '/asana' },
        ],
        actions: {
          auth: { params: ['apiToken'] },
          clearAuth: {
            params: [],
          },
        },
      },
    },
    run,
  }
}
