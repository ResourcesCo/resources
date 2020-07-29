import App, { ResourceType } from './App'
import { produce } from 'immer'

function defineDraftRoutes(draft) {
  const routes = draft.routes
  draft.routes = {}
  const channelRoute = routes.find(route => !('host' in route))
  const webRoute = routes.find(route => 'host' in route)
  if (channelRoute) {
    draft.routes.channel = channelRoute
  }
  if (webRoute) {
    draft.routes.web = webRoute
  }
  draft.urlPattern = channelRoute
    ? channelRoute.path
    : `https://${webRoute.host}${webRoute.path}`
}

function defineRoutes(resourceType) {
  return produce(resourceType, draft => {
    defineDraftRoutes(draft)
  })
}

function defineAppRoutes(resourceTypes) {
  return produce(resourceTypes, draft => {
    for (const resourceType of Object.keys(draft)) {
      defineDraftRoutes(resourceTypes[resourceType])
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
            name: 'more',
            params: {
              urlPattern: '0/urlPattern',
            },
            url: '${ urlPattern }',
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
}: {
  app: App
  resourceType: ResourceType
}) {
  const resourceTypeRoutes: any = defineRoutes(resourceType)
  return {
    type: 'tree',
    value: {
      output: {
        app: app.name,
        description: app.description,
        resourceType: resourceType.name,
        actions: resourceType.actions,
        urlPattern: resourceTypeRoutes.urlPattern,
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
      actions: {
        sel: '/output/actions/:index',
        inline: [
          {
            type: 'action',
            name: 'go',
            params: {
              urlPattern: '/output/urlPattern',
              action: '0/name',
            },
            url: '${ urlPattern }',
            action: '${ action }',
          },
        ],
      },
    },
  }
}

export default function helpMessage({
  app,
  resourceType,
  type,
}: {
  app: App
  resourceType?: string
  type?: string
}) {
  if (type === 'app' || !app.resourceTypes[resourceType]) {
    return appHelp({ app })
  } else {
    return resourceTypeHelp({
      app,
      resourceType: app.resourceTypes[resourceType],
    })
  }
}
