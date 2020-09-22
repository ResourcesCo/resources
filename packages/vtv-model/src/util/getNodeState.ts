import getState from './getState'

export default function getNodeState(state) {
  const result: any = {}
  const _state = getState(state)
  for (const key of Object.keys(_state)) {
    if (key.startsWith('_') && !key.startsWith('__')) {
      result[key.substr(1)] = _state[key]
    }
  }
  return result
}