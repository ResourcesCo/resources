function run({ url }) {
  return { type: 'text', text: `docs for ${url}` }
}

import { AppSpec } from '../../services/app/App'

export default async function app(): Promise<AppSpec> {
  return {
    name: 'api-finder',
    defaultProvider: 'api-finder',
    providers: {
      'api-finder': {
        path: ['*'],
        defaultAction: 'info',
        actions: {
          info: {
            args: [],
            match: {
              type: 'url',
              host: '*',
              path: '*',
            },
          },
        },
      },
    },
    run,
  }
}
