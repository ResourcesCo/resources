import { match, MatchFunction } from 'path-to-regexp'
import mapValues from 'lodash/mapValues'
import { JsonPointer } from 'json-ptr'
import { compile, PathFunction } from 'path-to-regexp'
import getNested from 'lodash/get'

// example:
// {
//   selector: '/response/body/data/:index',
//   summary: [
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
  toPath: PathFunction

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
    const urlPath = url.startsWith('/') ? url : new URL(url).pathname
    this.toPath = compile(urlPath, {
      encode: encodeURIComponent,
    })
  }

  getUrl({ value, path }) {
    const params = mapValues(this.params, ({ up, pointer }) => {
      const base = getNested(
        value,
        typeof up === 'number' ? path.slice(0, path.length - up) : []
      )
      return `${pointer.get(base)}`
    })
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
}

class ActionLink {
  type = 'action'
  name: string
  action: string
  relativeLink: RelativeLink

  constructor({ name, params, url, action }: Omit<ActionLinkSpec, 'type'>) {
    this.name = name
    this.action = action
    this.relativeLink = new RelativeLink({ params, url })
  }

  getAction({ path, value }) {
    return {
      url: this.relativeLink.getUrl({ path, value }),
      action: this.action,
    }
  }
}

export type SummaryItemSpec = NodeViewSpec | ActionLinkSpec

type SummaryItem = NodeView | ActionLink

export type SummarySpec = SummaryItemSpec[]

type Summary = SummaryItem[]

export interface RuleSpec {
  name: string
  selector: string
  summary?: SummarySpec
}

export default class RuleSet {
  name: string
  selector: string
  summary?: Summary
  matcher: MatchFunction

  constructor({ name, selector, summary }: RuleSpec) {
    this.name = name
    this.selector = selector
    if (summary) {
      this.summary = summary.map(item =>
        item.type === 'action'
          ? new ActionLink(item)
          : new NodeView({ showLabel: true, ...item })
      )
    }
    this.matcher = match(selector)
  }

  // test if it matches the path
  match(pointer: string) {
    return !!this.matcher(pointer)
  }
}
