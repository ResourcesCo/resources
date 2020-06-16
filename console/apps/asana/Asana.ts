import { AppSpec } from '../../services/app/App'
import fetch from 'isomorphic-unfetch'

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

async function complete({ env: { ASANA_TOKEN: apiToken }, params: { id } }) {
  const headers = getHeaders(apiToken, true)
  const url = `https://app.asana.com/api/1.0/tasks/${id}`
  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: { completed: true } }),
  })
  if (res.ok) {
    return { type: 'text', text: `Task marked complete` }
  } else {
    return { type: 'text', text: `Error marking task complete` }
  }
}

async function comment({
  env: { ASANA_TOKEN: apiToken },
  params: { id, comment },
}) {
  const headers = getHeaders(apiToken, true)
  const url = `https://app.asana.com/api/1.0/tasks/${id}/stories`
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: { text: comment } }),
  })
  if (res.ok) {
    return { type: 'text', text: 'Comment added.' }
  } else {
    return { type: 'text', text: 'Error adding comment.' }
  }
}

async function run({ action, env, params }) {
  if (action === 'auth') {
    return auth({ env, params })
  } else if (action === 'auth/clear') {
    return authClear({ env })
  } else {
    if (env.ASANA_TOKEN) {
      if (action === 'complete') {
        return await complete({ env, params })
      } else if (action === 'comment') {
        return await comment({ env, params })
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
    resourceTypes: {
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
      tasks: {
        routes: [
          {
            host: 'app.asana.com',
            path: '/0/:projectId/:id{/f}?',
          },
          { path: '/asana/tasks/:id' },
        ],
        actions: {
          comment: {
            params: ['comment'],
          },
          complete: {
            params: [],
          },
        },
      },
    },
    run,
  }
}
