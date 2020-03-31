import getState from './getState'
import getChildState from './getChildState'

export default function getNestedState(state, path) {
  if (path.length === 0) {
    return getState(state)
  } else {
    const [key, ...rest] = path
    return getNestedState(getChildState(state, key), rest)
  }
}
