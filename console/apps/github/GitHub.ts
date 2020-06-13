import fetch from 'isomorphic-unfetch'

function getHeaders(apiToken, post = false) {
  return {
    Authorization: `token ${apiToken}`,
    ...(post ? { 'Content-Type': 'application/json' } : {}),
  }
}

function auth({ env, params: { apiToken } }) {
  env.GITHUB_TOKEN = apiToken
  return 'API key saved to session.'
}

function authClear({ env }) {
  delete env.GITHUB_TOKEN
  return 'API key cleared.'
}

function issueApiUrl({ owner, repo, number }: any) {
  return `https://api.github.com/repos/${owner}/${repo}/issues/${number}`
}

async function close({ env: { GITHUB_TOKEN: apiToken }, params }) {
  const res = await fetch(issueApiUrl(params), {
    method: 'PATCH',
    headers: getHeaders(apiToken, true),
    body: JSON.stringify({ state: 'closed' }),
  })
  if (res.ok) {
    return { type: 'text', text: `Issue closed` }
  } else {
    return { type: 'text', text: `Error closing issue` }
  }
}

async function comment({
  env: { GITHUB_TOKEN: apiToken },
  params: { comment, ...params },
}) {
  const res = await fetch(`${issueApiUrl(params)}/comments`, {
    method: 'POST',
    headers: getHeaders(apiToken, true),
    body: JSON.stringify({ body: comment }),
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
    if (env.GITHUB_TOKEN) {
      if (action === 'close') {
        return await close({ env, params })
      } else if (action === 'comment') {
        return await comment({ env, params })
      }
    } else {
      return {
        type: 'error',
        text: 'A GitHub personal access token is required.',
      }
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
    resourceTypes: {
      auth: {
        routes: [
          {
            host: 'github.com',
            path: '/:any*',
          },
          { path: '/github' },
        ],
        actions: {
          auth: { params: ['apiToken'] },
          clearAuth: {
            params: [],
          },
        },
      },
      issues: {
        routes: [
          {
            host: 'github.com',
            path: '/:owner/:repo/issues/:number',
          },
          { path: '/github/:issues/:owner/:repo/:number' },
        ],
        actions: {
          comment: {
            params: ['comment'],
          },
          close: {
            params: [],
          },
        },
      },
    },
    run,
  }
}
