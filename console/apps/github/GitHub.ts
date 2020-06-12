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

import { AppSpec } from '../../services/app/App'

export default async function app(): Promise<AppSpec> {
  return {
    name: 'GitHub',
    environmentVariables: {
      GITHUB_TOKEN: {
        doc: `
          A GitHub personal access token, from the
          [GitHub Developer Settings](https://github.com/settings/tokens)'
        `,
      },
    },
    routes: [
      {
        host: 'github.com',
        path: '/:any*',
        actions: ['auth', 'auth/clear'],
        params: ['apiToken'],
      },
      { path: '/github', actions: ['auth', 'auth/clear'], params: [] },
      {
        host: 'github.com',
        path: '/:owner/:repo/issues/:issueNumber',
        actions: ['close', 'comment'],
        params: [],
      },
      {
        path: '/issues/:owner/:repo/:issueNumber',
        actions: ['close', 'comment'],
        params: [],
      },
    ],
    run,
  }
}
