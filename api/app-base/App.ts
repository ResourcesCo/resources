import { match } from 'path-to-regexp'
import mapValues from 'lodash/mapValues'
import request from './request'
import helpMessage from './helpMessage'
import ConsoleChannel from 'api/channel/ConsoleChannel'
import expandRoot from './util/message/expandRoot'

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
  title?: string
  description: string
  resourceTypes: { [key: string]: ResourceTypeSpec }
  environmentVariables?: {
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
    formData?: object
    parentMessage?: object
    onMessage?: Function
    request?: Function
  }): MessageReturnValue
}

function defaultAction(actionName) {
  if (actionName === 'help') {
    return {
      name: 'help',
      params: ['helpType?'],
    }
  }
}

export default class App {
  name: string
  title?: string
  description: string
  resourceTypes: { [key: string]: ResourceType }
  onRun: Function
  env: { [key: string]: string }
  request: Function
  channel?: ConsoleChannel

  constructor({
    appSpec,
    env,
    request: requestParam,
    channel,
  }: {
    appSpec: AppSpec
    env: { [key: string]: string }
    request?: Function
    channel: ConsoleChannel
  }) {
    const { name, title, resourceTypes, run, description } = appSpec
    this.name = name
    this.title = title
    this.description = description
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
    this.channel = channel
  }

  prepareMessage(message: MessageValue) {
    let result
    if (typeof message === 'string') {
      result = { type: 'text', text: message }
    } else if (
      typeof message === 'object' &&
      message !== null &&
      message.type === 'tree'
    ) {
      result = expandRoot({ state: {}, ...message })
    } else {
      result = message
    }
    return result
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
        actionName || resourceType.defaultAction || 'get'
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
    const optionalParams = action.params.filter(param => param.endsWith('?'))
      .length
    const minParams = action.params.length - optionalParams
    const maxParams = action.params.length
    if (params.length >= minParams && params.length <= maxParams) {
      let i = 0
      for (const name of action.params) {
        if (i + 1 <= params.length) {
          actionParams[
            name.endsWith('?') ? name.substr(0, name.length - 1) : name
          ] = params[i]
        }
        i++
      }
      return { params: actionParams }
    } else {
      return {
        error: `Expected ${
          minParams === maxParams ? maxParams : `${minParams} to ${maxParams}`
        } parameter${minParams === 1 && maxParams === 1 ? '' : 's'}, got ${
          params.length
        }`,
      }
    }
  }

  help = async ({ resourceType, params: { helpType, ...params } }) => {
    return helpMessage({ app: this, resourceType, helpType, params })
  }

  async run({
    resourceType,
    action,
    params,
    formData,
    parentMessage,
    onMessage,
  }) {
    const handler =
      action === 'help' && !this.resourceTypes[resourceType]?.actions?.help
        ? this.help
        : this.onRun
    const handleMessage = message => {
      onMessage(this.prepareMessage(message))
    }
    const message = await handler({
      resourceType,
      action,
      params,
      formData,
      parentMessage,
      onMessage: handleMessage,
      env: this.env,
      request: this.request,
      channel: this.channel,
    })
    return this.prepareMessage(message)
  }

  static async get({
    app,
    env,
    channel,
  }: {
    app(): Promise<AppSpec>
    env: { [key: string]: string }
    channel?: ConsoleChannel
  }) {
    const appSpec = await app()
    return new App({ appSpec, env, channel })
  }
}
