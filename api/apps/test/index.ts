import { AppSpec } from '../../app-base/App'

async function run({ action, env, params: { path } }) {
  return { type: 'embed', path: `/tests/${path}` }
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'Test',
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
