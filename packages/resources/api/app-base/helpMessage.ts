import App, { ResourceType } from './App'
import produce, { Draft } from 'immer'
import { parse, compile, Token } from 'path-to-regexp'
import { keyBy, mapValues, pickBy } from 'lodash-es'

function setPathParams(path: string, params: { [key: string]: string }) {
  const defaultParams = mapValues(
    keyBy(
      parse(path).filter((o) => typeof o !== 'string'),
      'name'
    ),
    (_, s) => `___3A${s}`
  )
  const toPath = compile(path, {
    encode: encodeURIComponent,
  })
  const inputParams = pickBy(params, (v) => !/^%3A|:/.test(v))
  return toPath({
    ...defaultParams,
    ...inputParams,
  }).replace('___3A', ':')
}

function defineResourceTypeDraftRoutes(
  resourceType: Draft<any>,
  params: { [key: string]: string } = {}
) {
  const routes = resourceType.routes
  resourceType.routes = {}
  const channelRoute = routes.find((route) => !('host' in route))
  const webRoute = routes.find((route) => 'host' in route)
  if (channelRoute) {
    resourceType.routes.channel = channelRoute
  }
  if (webRoute) {
    resourceType.routes.web = webRoute
  }
  for (const actionName of Object.keys(resourceType.actions)) {
    const action = resourceType.actions[actionName]
    action.exampleParams = (action.params || []).map((s) => `<${s}>`).join(' ')
  }
  resourceType.url = channelRoute
    ? setPathParams(channelRoute.path, params)
    : `https://${webRoute.host}${webRoute.path}`
}

function defineResourceTypeRoutes(
  resourceType,
  params: { [key: string]: string }
) {
  return produce(resourceType, (resourceType) => {
    defineResourceTypeDraftRoutes(resourceType, params)
  })
}

function defineAppRoutes(resourceTypes) {
  return produce(resourceTypes, (resourceTypes) => {
    for (const resourceType of Object.keys(resourceTypes)) {
      defineResourceTypeDraftRoutes(resourceTypes[resourceType])
    }
  })
}

function appHelp({ app }: { app: App }) {
  return {
    type: 'tree',
    value: {
      output: {
        app: app.name,
        description: app.description,
        resourceTypes: defineAppRoutes(app.resourceTypes),
      },
    },
    state: {
      _showOnly: ['output'],
      output: {
        resourceTypes: {
          _expanded: true,
        },
      },
    },
    rules: {
      resourceTypes: {
        sel: '/output/resourceTypes/:index',
        inline: [
          {
            type: 'node',
            path: ['routes', 'channel', 'path'],
            showLabel: false,
          },
          {
            type: 'action',
            name: 'help',
            params: {
              url: '0/url',
            },
            url: '${ url }',
            action: 'help',
          },
        ],
      },
    },
  }
}

function resourceTypeHelp({
  app,
  resourceType,
  params,
}: {
  app: App
  resourceType: ResourceType
  params: { [key: string]: string }
}) {
  const resourceTypeOutput: any = defineResourceTypeRoutes(resourceType, params)
  return {
    type: 'tree',
    value: {
      output: {
        app: {
          name: app.name,
          description: app.description,
        },
        resourceType: {
          name: resourceType.name,
          url: resourceTypeOutput.url,
        },
        actions: resourceTypeOutput.actions,
      },
    },
    state: {
      _showOnly: ['output'],
      output: {
        actions: {
          _expanded: true,
        },
      },
    },
    rules: {
      app: {
        sel: '/output/app',
        inline: [
          {
            type: 'action',
            name: 'help',
            params: {
              name: '0/name',
              action: '0/name',
            },
            url: '/:name',
            action: 'help',
            args: 'app',
          },
        ],
      },
      resourceType: {
        sel: '/output/resourceType',
        inline: [
          {
            type: 'node',
            path: ['url'],
            showLabel: false,
          },
        ],
      },
      actions: {
        sel: '/output/actions/:index',
        inline: [
          {
            type: 'action',
            name: 'go',
            params: {
              url: '/output/resourceType/url',
              action: '0/name',
              exampleParams: '0/exampleParams',
            },
            url: '${ url }',
            action: '${ action }',
            args: '${ exampleParams }',
          },
        ],
      },
    },
  }
}

export default function helpMessage({
  app,
  resourceType,
  helpType,
  params,
}: {
  app: App
  resourceType?: string
  helpType?: string
  params: { [key: string]: string }
}) {
  if (helpType === 'app' || !app.resourceTypes[resourceType]) {
    return appHelp({ app })
  } else {
    return resourceTypeHelp({
      app,
      resourceType: app.resourceTypes[resourceType],
      params,
    })
  }
}
