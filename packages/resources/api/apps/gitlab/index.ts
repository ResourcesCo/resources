import { cloneDeep as clone } from 'lodash'
import { AppSpec } from '../../app-base/App'
import { ok, replaceEnv } from '../../app-base/request'
import camelCase from '../../app-base/util/string/camelCase'

const actions = {
  auth: {
    async auth({ env, params: { apiToken } }) {
      env.GITLAB_TOKEN = apiToken
      return 'API key saved to session.'
    },
    async authClear({ env }) {
      delete env.GITLAB_TOKEN
      return 'API key cleared.'
    },
  },
  issues: {
    async get({
      env: { GITLAB_TOKEN: apiToken },
      env,
      params: { owner, repo },
      params,
      request,
    }) {
      const projectId = encodeURIComponent(`${owner}/${repo}`)
      const req = {
        url: `https://gitlab.com/api/v4/projects/${projectId}/issues`,
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
                    iid: '0/iid',
                  },
                  url: 'https://gitlab.com/:owner/:repo/issues/:iid',
                }
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
}

async function run({ resourceType, action, env, params, request }) {
  if (!['auth', 'auth-clear'].includes(action) && !env.GITLAB_TOKEN) {
    return {
      type: 'tree',
      value: [
        'A personal access token is required. Add it with:',
        '/gitlab :auth <token>',
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
    name: 'gitlab',
    title: 'GitLab',
    description: 'Collaborate on GitLab',
    environmentVariables: {
      GITLAB_TOKEN: {
        doc: `
          A GitLab personal access token'
        `,
      },
    },
    resourceTypes: {
      auth: {
        routes: [
          {
            host: 'gitlab.com',
            path: '/:any*',
          },
          { path: '/gitlab' },
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
            host: 'gitlab.com',
            path: '/:owner/:repo/issues',
          },
          { path: '/gitlab/-/:owner/:repo/-/issues' },
        ],
        actions: {
          get: {
            params: [],
          },
        },
      },
    },
    run,
  }
}
