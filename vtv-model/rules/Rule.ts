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

export interface NodeView {
  type: 'node'
  path: string[]
  showLabel: boolean
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
  params: {
    [key: string]: {
      up?: number
      pointer: JsonPointer
    }
  }
  url: string
  action: string

  toUrl: PathFunction

  constructor({ name, params, url, action }: Omit<ActionLinkSpec, 'type'>) {
    this.name = name
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
    this.action = action
    this.toUrl = compile(this.url, { encode: encodeURIComponent })
  }

  getAction({ value, path }) {
    const params = mapValues(this.params, ({ up, pointer }) => {
      const base = getNested(
        value,
        typeof up === 'number' ? path.slice(0, path.length - up) : []
      )
      return `${pointer.get(base)}`
    })
    return {
      url: this.toUrl(params),
      action: this.action,
    }
  }
}

export type SummaryItemSpec = NodeView | ActionLinkSpec

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
          : { showLabel: true, ...item }
      )
    }
    this.matcher = match(selector)
  }

  // test if it matches the path
  match(pointer: string) {
    return !!this.matcher(pointer)
  }
}
