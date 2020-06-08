function run({ url }) {
  return { type: 'text', text: `docs for ${url}` }
}

import { AppSpec } from '../../services/app/App'

export default async function app(): Promise<AppSpec> {
  return {
    name: 'Asana',
    providers: {
      apiFinder: {
        path: [],
        actions: {
          all: {
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
