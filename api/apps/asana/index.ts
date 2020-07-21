import { AppSpec } from '../../app-base/App'
import { ok } from '../../app-base/request'
import camelCase from '../../app-base/util/string/camelCase'
import { get } from 'http'

function getHeaders(apiToken, post = false) {
  return {
    Authorization: `Bearer ${apiToken}`,
    ...(post ? { 'Content-Type': 'application/json' } : {}),
  }
}

const actions = {
  auth: {
    auth({ env, params: { apiToken } }) {
      env.ASANA_TOKEN = apiToken
      return 'API key saved to session.'
    },
    authClear({ env }) {
      delete env.ASANA_TOKEN
      return 'API key cleared.'
    },
  },
  // TODO: add workspaces
  tasks: {
    // TODO: add get
    async complete({
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
    },
    async comment({
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
    },
  },
}

async function run({ resourceType, action, env, params, request }) {
  if (!['auth', 'auth-clear'].includes(action) && !env.ASANA_TOKEN) {
    return { type: 'error', text: 'An Asana token is required.' }
  }
  const handler = actions[resourceType][camelCase(action)]
  return await handler({ env, params, request })
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
      workspaces: {
        routes: [{ path: '/asana/workspaces' }],
        actions: {
          get: {
            params: [],
            request: {
              method: 'GET',
              url: 'https://app.asana.com/api/1.0/workspaces',
            },
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
          'auth-clear': {
            params: [],
          },
        },
      },
    },
    run,
  }
}
