import getStateKey from './getStateKey'

export default function draftState(draft, path) {
  let draftState = draft.state
  for (let key of path) {
    const stateKey = getStateKey(key)
    draftState[stateKey] = draftState[stateKey] || {}
    draftState = draftState[stateKey]
  }
  return draftState
}
