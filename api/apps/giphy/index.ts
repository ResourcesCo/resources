import { AppSpec } from '../../app-base/App'
import { ok, replaceEnv } from '../../app-base/request'
import camelCase from '../../app-base/util/string/camelCase'
import getNested from 'lodash/get'

const actions = {
  root: {
    async auth({ env, params: { apiToken } }) {
      env.GIPHY_TOKEN = apiToken
      return 'API key saved to session.'
    },
    async authClear({ env }) {
      delete env.GIPHY_TOKEN
      return 'API key cleared.'
    },
  },
  gifs: {
    async random({
      env: { GIPHY_TOKEN: apiToken },
      env,
      params: { tag },
      request,
    }) {
      const req = {
        url: `https://api.giphy.com/v1/gifs/random?api_key=${apiToken}&tag=${encodeURIComponent(
          tag
        )}`,
        method: 'GET',
      }
      const response = await request(req)
      const output = getNested(response.body, ['data', 'image_url'])
      return {
        type: 'tree',
        value: { request: replaceEnv(req, env), response, output },
        state: {
          _showOnly: ['output'],
          output: {
            _view: 'image',
            _expanded: true,
          },
        },
      }
    },
  },
}

async function run({ resourceType, action, env, params, request }) {
  if (!['auth', 'auth-clear'].includes(action) && !env.GIPHY_TOKEN) {
    return {
      type: 'tree',
      value: [
        'A personal access token is required. Add it with:',
        '/giphy :auth <token>',
      ],
    }
  }
  const handler = actions[resourceType][camelCase(action)]
  return await handler({ env, params, request })
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'giphy',
    title: 'GIPHY',
    description: 'Search for GIFs',
    environmentVariables: {
      GITHUB_TOKEN: {
        doc: `
          A GIPHY API key, from developers.giphy.com'
        `,
      },
    },
    resourceTypes: {
      root: {
        routes: [
          {
            host: 'giphy.com',
            path: '/:any*',
          },
          { path: '/giphy' },
        ],
        actions: {
          auth: { params: ['apiToken'] },
          'auth-clear': {
            params: [],
          },
          random: {
            params: ['tag'],
          },
        },
      },
      gifs: {
        routes: [
          {
            host: 'giphy.com',
            path: '/:any*',
          },
          { path: '/giphy/gifs' },
        ],
        actions: {
          auth: { params: ['apiToken'] },
          'auth-clear': {
            params: [],
          },
          random: {
            params: ['tag'],
          },
        },
      },
    },
    run,
  }
}
