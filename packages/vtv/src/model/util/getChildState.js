import getState from './getState'
import getStateKey from './getStateKey'

export default function getChildState(state, key) {
  return getState(getState(state)[getStateKey(key)])
}
