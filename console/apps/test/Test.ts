import { AppSpec } from '../../services/app/App'

async function run({ action, env, params }) {
  return { type: 'embed', path: '/tests/${}' }
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
