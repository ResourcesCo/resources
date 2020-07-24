import { match, MatchFunction } from 'path-to-regexp'

// example:
// {
//   selector: '/response/body/data/:index',
//   summary: [
//     'name',
//     {
//       name: 'projects',
//       params: { id: '0/id' },
//       path: '/asana/workspaces/:id/projects',
//       action: 'get',
//     },
//   ],
// }

export interface NodeView {
  type: 'node'
  path: string[]
  showLabel: boolean
}

export interface ActionLink {
  type: 'action'
  name: string
  params: { [key: string]: string }
  path: string
  action: string
}

export type SummaryItem = NodeView | ActionLink

export type SummarySpec = SummaryItem[]

export interface RuleSpec {
  name: string
  selector: string
  summary: SummarySpec
}

export default class RuleSet {
  name: string
  selector: string
  summary: SummarySpec
  matcher: MatchFunction

  constructor({ name, selector, summary }: RuleSpec) {
    this.name = name
    this.selector = selector
    this.summary = summary
    this.matcher = match(selector)
  }

  // test if it matches the path
  match(pointer: string) {
    return !!this.matcher(pointer)
  }
}
