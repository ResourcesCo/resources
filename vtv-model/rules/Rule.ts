import { match, MatchFunction } from 'path-to-regexp'
import mapValues from 'lodash/mapValues'
import { JsonPointer } from 'json-ptr'
import { compile, PathFunction } from 'path-to-regexp'
import getNested from 'lodash/get'

// example:
// {
//   sel: '/response/body/data/:index',
//   inline: [
//     'name',
//     {
//       name: 'projects',
//       params: { id: '0/id' },
//       url: '/asana/workspaces/:id/projects',
//       action: 'get',
//     },
//   ],
// }

export class RelativeLink {
  params: {
    [key: string]: {
      up?: number
      pointer: JsonPointer
    }
  }
  url: string
  toPath?: PathFunction

  constructor({
    params,
    url,
  }: {
    params: { [key: string]: string }
    url: string
  }) {
    this.params = mapValues(params, value => {
      const match = /^\d+/.exec(value)
      return {
        up: match && Number(match[0]),
        pointer: JsonPointer.create(
          match ? value.substr(match[0].length) : value
        ),
      }
    })
    this.url = url
    if (!url.startsWith('${')) {
      const urlPath = url.startsWith('/') ? url : new URL(url).pathname
      this.toPath = compile(urlPath, {
        encode: encodeURIComponent,
      })
    }
  }

  getParams({ value, path }) {
    return mapValues(this.params, ({ up, pointer }) => {
      const basePath =
        typeof up === 'number' ? path.slice(0, path.length - up) : []
      const base = basePath.length > 0 ? getNested(value, basePath) : value
      return `${pointer.get(base)}`
    })
  }

  getUrl({ value, path }) {
    const params = this.getParams({ value, path })
    if (this.toPath) {
      try {
        const pathname = this.toPath(params)
        if (this.url.startsWith('/')) {
          return pathname
        } else {
          const parsedUrl = new URL(this.url)
          parsedUrl.pathname = pathname
          return parsedUrl.href
        }
      } catch (err) {
        return
      }
    } else {
      return this.url.replace(/\$\{\s*(\w+)\s*\}/, (s, param) => params[param])
    }
  }
}

export interface NodeViewSpec {
  type: 'node'
  path: string[]
  showLabel: boolean
  params?: { [key: string]: string }
  url?: string
}

class NodeView {
  type = 'node'
  path: string[]
  showLabel: boolean
  relativeLink?: RelativeLink

  constructor({ path, showLabel, params, url }: Omit<NodeViewSpec, 'type'>) {
    this.path = path
    this.showLabel = showLabel
    if (params && url) {
      this.relativeLink = new RelativeLink({ params, url })
    }
  }

  getUrl({ value, path }) {
    return this.relativeLink && this.relativeLink.getUrl({ value, path })
  }
}

export interface ActionLinkSpec {
  type: 'action'
  name: string
  params: { [key: string]: string }
  url: string
  action: string
  args?: string
}

class ActionLink {
  type = 'action'
  name: string
  action: string
  args?: string
  relativeLink: RelativeLink

  constructor({
    name,
    params,
    args,
    url,
    action,
  }: Omit<ActionLinkSpec, 'type'>) {
    this.name = name
    this.action = action
    this.args = args
    this.relativeLink = new RelativeLink({ params, url })
  }

  getActionName({ path, value }) {
    if (/\$\{\s*(\w+)\s*\}/.test(this.action)) {
      const params = this.relativeLink.getParams({ path, value })
      return this.action.replace(
        /\$\{\s*(\w+)\s*\}/,
        (s, param) => params[param]
      )
    } else {
      return this.action
    }
  }

  getAction({ path, value }) {
    return {
      url: this.relativeLink.getUrl({ path, value }),
      action: this.getActionName({ path, value }),
      args: this.args,
    }
  }
}

export type inlineItemSpec = NodeViewSpec | ActionLinkSpec

type inlineItem = NodeView | ActionLink

export type inlineSpec = inlineItemSpec[]

type inline = inlineItem[]

export interface RuleSpec {
  name: string
  sel: string | string[]
  inline?: inlineSpec
}

export default class RuleSet {
  name: string
  sel: string | string[]
  inline?: inline
  matchers: MatchFunction[]

  constructor({ name, sel, inline }: RuleSpec) {
    this.name = name
    this.sel = sel
    if (inline) {
      this.inline = inline.map(item =>
        item.type === 'action'
          ? new ActionLink(item)
          : new NodeView({ showLabel: true, ...item })
      )
    }
    this.matchers = (Array.isArray(sel) ? sel : [sel]).map(sel => match(sel))
  }

  // test if it matches the path
  match(pointer: string) {
    return this.matchers.some(matcher => matcher(pointer))
  }
}
