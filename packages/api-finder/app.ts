function run({
  action,
  params: { url },
}: {
  action: string
  params: { url: string }
}) {
  return {}
}

interface App {
  name: string
  providers: {
    [key: string]: {
      path: string[]
      actions: {
        [key: string]: {
          args: string[]
          autorun: {
            type: string
            host: string
            path: string
          }
        }
      }
    }
  }
  run(this: App, props: { action: string; params: object }): object
}

export default async function app(): Promise<App> {
  return {
    name: 'API finder',
    providers: {
      apiFinder: {
        path: [],
        actions: {
          lookup: {
            args: ['url'],
            autorun: {
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
