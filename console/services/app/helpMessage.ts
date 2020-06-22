import { ResourceType } from './App'

export default function helpMessage({ resourceType }) {
  return {
    type: 'tree',
    name: resourceType.name,
    value: resourceType,
    state: {
      _view: 'tree',
      _expanded: true,
      name: {
        _hidden: true,
      },
      routes: {
        _view: 'table',
        _expanded: true,
      },
      actions: {
        _view: 'table',
        _expanded: true,
      },
    },
  }
}
