import { match } from 'path-to-regexp'

export interface RouteSpec {
  host?: string
  path: string
  action: string | string[]
  params: string[]
  name?: string
  doc?: string
}

export interface Route extends RouteSpec {
  match
  app
}

export interface AppSpec {
  name: string
  routes: RouteSpec[]
  run(props: {
    host?: string
    path?: string
    action?: string
    params?: object
  }): object
}

export default class App {
  name: string
  routes: Route[]
  onRun: Function

  constructor({ name, routes, run }: AppSpec) {
    this.name = name
    this.routes = routes.map(route => ({
      ...route,
      app: this,
      match: match(route.path),
    }))
    this.onRun = run
  }

  async run({ provider, action, params }) {
    return await this.onRun({ action, params })
  }

  static async get({ app: appBuilder }) {
    const appSpec = await appBuilder()
    return new App(appSpec)
  }
}
