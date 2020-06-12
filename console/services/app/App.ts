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
}

export interface ActionSpec {
  name?: string
  doc?: string
  params: string[]
}

export interface ResourceTypeSpec {
  name?: string
  doc?: string
  routes: RouteSpec[]
  actions: { [key: string]: ActionSpec }
}

export interface Route extends RouteSpec {
  match
  resourceType
}

export interface Action extends ActionSpec {
  name: string
}

export interface ResourceType extends ResourceTypeSpec {
  name: string
  routes: Route[]
  actions: {}
}

export interface AppSpec {
  name: string
  resourceTypes: { [key: string]: ResourceTypeSpec }
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

function buildResourceTypes(appSpec: AppSpec): { [key: string]: ResourceType } {
  const resourceTypes = {}
  for (const name of Object.keys(appSpec.resourceTypes)) {
    resourceTypes[name] = {
      name,
      ...appSpec.resourceTypes[name],
    }
  }
}

export default class App {
  name: string
  resourceTypes: { [key: string]: ResourceType }
  onRun: Function
  env: { [key: string]: string }

  constructor({ name, resourceTypes, run }: AppSpec) {
    this.name = name
    this.resourceTypes = resourceTypes.map(route => ({
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
