import { AppSpec } from '../../services/app/App'

async function run({ action, env, params: { path } }) {
  return { type: 'embed', path: `/tests/${path}` }
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'Test',
    environmentVariables: {},
    resourceTypes: {
      tests: {
        routes: [{ path: '/tests/:path*' }],
        actions: {
          run: {
            params: [],
          },
        },
      },
    },
    run,
  }
}
