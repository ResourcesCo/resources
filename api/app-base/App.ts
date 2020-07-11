import { match } from 'path-to-regexp'
import mapValues from 'lodash/mapValues'
import request from './request'
import helpMessage from './helpMessage'

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

export interface RequestSpec {
  method: string
  url: string
}

export interface ActionSpec {
  name?: string
  doc?: string
  docUrl?: string
  request?: RequestSpec
  params: string[]
}

export interface ResourceTypeSpec {
  name?: string
  doc?: string
  routes: RouteSpec[]
  defaultAction?: string
  actions: { [key: string]: ActionSpec }
}

export interface Route extends RouteSpec {
  match
}

export interface Action extends ActionSpec {
  name: string
}

export interface ResourceType extends ResourceTypeSpec {
  name: string
  routes: Route[]
  actions: { [key: string]: Action }
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
    request?: Function
  }): MessageReturnValue
}

function defaultAction(actionName) {
  if (actionName === 'help') {
    return {
      name: 'help',
      params: [],
    }
  }
}

export default class App {
  name: string
  resourceTypes: { [key: string]: ResourceType }
  onRun: Function
  env: { [key: string]: string }
  request: Function

  constructor({
    appSpec,
    env,
    request: requestParam,
  }: {
    appSpec: AppSpec
    env: { [key: string]: string }
    request?: Function
  }) {
    const { name, resourceTypes, run } = appSpec
    this.name = name
    this.resourceTypes = mapValues(
      resourceTypes,
      ({ routes, actions, ...props }, name) => ({
        name,
        ...props,
        routes: routes.map(route => ({ ...route, match: match(route.path) })),
        actions: mapValues(actions, (action, name) => ({ name, ...action })),
      })
    )
    this.env = env
    this.onRun = run
    this.request = requestParam || request
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

  async route({ host, path, action, params }) {
    for (const resourceType of Object.values(this.resourceTypes)) {
      for (const route of resourceType.routes) {
        if (!host === !route.host || host === route.host) {
          const result = this.matchRoute({
            resourceType,
            route,
            path,
            action,
            params,
          })
          if (result) {
            return result
          }
        }
      }
    }
  }

  matchRoute({ resourceType, route, path, action: actionName, params }) {
    const match = route.match(path)
    if (match) {
      const resolvedActionName =
        actionName || resourceType.defaultAction || 'help'
      const action =
        Object.values(resourceType.actions).find(
          ({ name }) => name === resolvedActionName
        ) || defaultAction(resolvedActionName)
      if (action) {
        const result = this.matchParams({ match, action, params })
        if (result.error) {
          return result
        } else if (result.params) {
          return {
            resourceType: resourceType.name,
            action: resolvedActionName,
            params: result.params,
          }
        }
      }
    }
  }

  matchParams({ match, action, params }) {
    const { any: discard, ...actionParams } = match.params
    if (action.params.length === params.length) {
      let i = 0
      for (const name of action.params) {
        actionParams[name] = params[i]
        i++
      }
      return { params: actionParams }
    } else {
      return {
        error: `Expected ${action.params.length} parameter${
          action.params.length === 1 ? '' : 's'
        }, got ${params.length}`,
      }
    }
  }

  help = async ({ resourceType }) => {
    if (resourceType) {
      return helpMessage({ resourceType: this.resourceTypes[resourceType] })
    } else {
      return {
        type: 'error',
        text: 'Command not found.',
      }
    }
  }

  async run({ resourceType, action, params }) {
    const handler = action === 'help' ? this.help : this.onRun
    const result = await handler({
      resourceType,
      action,
      params,
      env: this.env,
      request: this.request,
    })
    return this.prepareMessage(result)
  }

  static async get({
    app,
    env,
  }: {
    app(): Promise<AppSpec>
    env: { [key: string]: string }
  }) {
    const appSpec = await app()
    return new App({ appSpec, env })
  }
}
