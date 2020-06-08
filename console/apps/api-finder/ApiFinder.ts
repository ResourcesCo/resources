function run({ url }) {
  return { type: 'text', text: `docs for ${url}` }
}

interface App {
  name: string
  providers: {
    [key: string]: {
      path: string[]
      actions: {
        [key: string]: {
          args: string[]
          match: {
            type: string
            host: string
            path: string
          }
        }
      }
    }
  }
  run(
    this: App,
    props: { path?: string[]; url?: string; action?: string; params?: object }
  ): object
}

export default async function app(): Promise<App> {
  return {
    name: 'apiFinder',
    providers: {
      apiFinder: {
        path: [],
        actions: {
          lookup: {
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
