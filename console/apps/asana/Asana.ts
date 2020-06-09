function run({ url }) {
  return { type: 'text', text: `docs for ${url}` }
}

import { AppSpec } from '../../services/app/App'

export default async function app(): Promise<AppSpec> {
  return {
    name: 'Asana',
    defaultProvider: 'asana',
    providers: {
      asana: {
        path: [],
        defaultAction: 'info',
        actions: {
          auth: {
            args: [],
            match: {
              type: 'url',
              host: 'asana.com',
              path: '*',
            },
          },
        },
      },
    },
    run,
  }
}
