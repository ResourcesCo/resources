import clone from 'lodash/cloneDeep'
import { AppSpec } from '../../app-base/App'
import { ok, replaceEnv } from '../../app-base/request'
import camelCase from '../../app-base/util/string/camelCase'

const actions = {
  auth: {
    async auth({ env, params: { apiToken } }) {
      env.GITHUB_TOKEN = apiToken
      return 'API key saved to session.'
    },
    async authClear({ env }) {
      delete env.GITHUB_TOKEN
      return 'API key cleared.'
    },
  },
  issues: {
    async get({
      env: { GITHUB_TOKEN: apiToken },
      env,
      params: { owner, repo },
      params,
      request,
    }) {
      const req = {
        url: `https://api.github.com/repos/${owner}/${repo}/issues`,
        method: 'GET',
        headers: { Authorization: `token ${apiToken}` },
      }
      const response = await request(req)
      if (ok(response)) {
        return {
          type: 'tree',
          value: {
            input: { params },
            output: clone(response.body),
            request: replaceEnv(req, env),
            response,
          },
          state: { _showOnly: ['output'] },
          rules: {
            issues: {
              sel: ['/output/:index', '/response/body/:index'],
              inline: [
                {
                  type: 'node',
                  path: ['title'],
                  showLabel: false,
                  params: {
                    owner: '/input/params/owner',
                    repo: '/input/params/repo',
                    number: '0/number',
                  },
                  url: 'https://github.com/0/:owner/:repo/issues/:number',
                },
                {
                  type: 'action',
                  name: 'comment',
                  params: {
                    owner: '/input/params/owner',
                    repo: '/input/params/repo',
                    number: '0/number',
                  },
                  url: '/github/-/:owner/:repo/issues/:number',
                  action: 'comment',
                },
                {
                  type: 'action',
                  name: 'complete',
                  params: {
                    owner: '/input/params/owner',
                    repo: '/input/params/repo',
                    number: '0/number',
                  },
                  url: '/github/-/:owner/:repo/issues/:number',
                  action: 'complete',
                },
              ],
            },
          },
        }
      } else {
        return {
          type: 'tree',
          value: {
            request: replaceEnv(req, env),
            response,
            error: 'Error getting issues',
          },
          state: { _showOnly: ['error'] },
        }
      }
    },
  },
  issue: {
    async close({
      env: { GITHUB_TOKEN: apiToken },
      env,
      params: { owner, repo, number },
      request,
    }) {
      const req = {
        url: `https://api.github.com/repos/${owner}/${repo}/issues/${number}`,
        method: 'PATCH',
        headers: { Authorization: `token ${apiToken}` },
        body: JSON.stringify({ state: 'closed' }),
      }
      const response = await request(req)
      const output = ok(response) ? 'Issue closed.' : 'Error closing issue.'
      return {
        type: 'tree',
        value: { request: replaceEnv(req, env), response, output },
        state: {
          _showOnly: ['output'],
        },
      }
    },
    async comment({
      env: { GITHUB_TOKEN: apiToken },
      env,
      params: { owner, repo, number, comment },
      request,
    }) {
      const req = {
        url: `https://api.github.com/repos/${owner}/${repo}/issues/${number}/comments`,
        method: 'POST',
        headers: { Authorization: `token ${apiToken}` },
        body: JSON.stringify({ body: comment }),
      }
      const response = await request(req)
      const output = ok(response) ? 'Comment added.' : 'Error adding comment.'
      return {
        type: 'tree',
        value: { request: replaceEnv(req, env), response, output },
        state: {
          _showOnly: ['output'],
        },
      }
    },
  },
}

async function run({ resourceType, action, env, params, request }) {
  if (!['auth', 'auth-clear'].includes(action) && !env.GITHUB_TOKEN) {
    return {
      type: 'tree',
      value: [
        'A personal access token is required. Add it with:',
        '/github :auth <token>',
      ],
      state: {
        1: {
          _actions: [
            {
              name: 'go',
              title: 'Go',
              primary: true,
              action: 'pasteIntoConsole',
            },
          ],
        },
      },
    }
  }
  const handler = actions[resourceType][camelCase(action)]
  return await handler({ env, params, request })
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'GitHub',
    description: 'Collaborate on GitHub',
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
          'auth-clear': {
            params: [],
          },
        },
      },
      issues: {
        routes: [
          {
            host: 'github.com',
            path: '/:owner/:repo/issues',
          },
          { path: '/github/-/:owner/:repo/issues' },
        ],
        actions: {
          get: {
            params: [],
          },
        },
      },
      issue: {
        routes: [
          {
            host: 'github.com',
            path: '/:owner/:repo/issues/:number',
          },
          { path: '/github/-/:owner/:repo/issues/:number' },
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
