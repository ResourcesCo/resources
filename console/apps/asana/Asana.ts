// /channel/apps :add asana <api-token>
// /channel/apps :add asana <api-token> as:client-asana
// :close https://app.asana.com/0/1138929626133616/1177203200389571
// :comment https://app.asana.com/0/1138929626133616/1177203200389571 "done!"
// https://app.asana.com/0/1138929626133616/1177203200389571 :comment "done!"
// for task that is only in client-asana
// /client-asana/close https://app.asana.com/0/1138143243423432/1123439392834213323

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
