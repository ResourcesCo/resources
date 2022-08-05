// example:
// rules: {
//   workspace: {
//     selector: '/response/body/data/:index',
//     inline: [
//       'name',
//       {
//         name: 'projects',
//         params: { id: '0/id' },
//         path: '/asana/workspaces/:id/projects',
//         action: 'get',
//       },
//     ],
//   },
// },

import mapValues from 'lodash/mapValues'
import { encodePointer } from 'json-ptr'
import Rule, { RuleSpec } from './Rule'

export interface RuleListSpec {
  [key: string]: Omit<RuleSpec, 'name'>
}

export default class RuleList {
  rules: { [key: string]: Rule }

  constructor(rules: RuleListSpec = {}) {
    this.rules = mapValues(rules, (rule, name) => new Rule({ name, ...rule }))
  }

  // return matching declarations for a path
  match(path: string[]) {
    const pointer = encodePointer(path)
    return Object.values(this.rules).filter((rule) => rule.match(pointer))
  }
}
