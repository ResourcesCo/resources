import { match } from 'path-to-regexp'

export interface Message {
  type: string
  text?: string
  name?: string
  value?: any
  state?: any
}

export type MessageValue = Message | string | undefined | void

export type MessageReturnValue = Promise<MessageValue> | MessageValue

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
  environmentVariables: {
    [key: string]: {
      doc: string
    }
  }
  run(props: {
    host?: string
    path?: string
    action?: string
    params?: object
    env?: object
  }): MessageReturnValue
}

export default class App {
  name: string
  routes: Route[]
  onRun: Function
  env: { [key: string]: string }

  constructor({ name, routes, run }: AppSpec) {
    this.name = name
    this.routes = routes.map(route => ({
      ...route,
      app: this,
      match: match(route.path),
    }))
    this.onRun = run
    this.env = {}
  }

  prepareMessage(result: MessageValue) {
    if (typeof result === 'string') {
      return { type: 'text', text: result }
    } else if (typeof result === 'object') {
      return result
    } else {
      return
    }
  }

  async run({ provider, action, params }) {
    const result = await this.onRun({ action, params, env: this.env })
    return this.prepareMessage(result)
  }

  static async get({ app: appBuilder }) {
    const appSpec = await appBuilder()
    return new App(appSpec)
  }
}
