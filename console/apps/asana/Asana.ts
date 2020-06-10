function run({ host }) {
  return { type: 'text', text: `docs for ${host}` }
}

import { AppSpec } from '../../services/app/App'

export default async function app(): Promise<AppSpec> {
  return {
    name: 'Asana',
    routes: [
      { path: '/asana', action: 'auth', params: ['apiKey'] },
      {
        host: 'app.asana.com',
        path: '/:any*',
        action: 'auth',
        params: ['apiKey'],
      },
      {
        host: 'app.asana.com',
        path: '/0/:projectId/:taskId',
        action: 'close',
        params: [],
      },
    ],
    run,
  }
}
