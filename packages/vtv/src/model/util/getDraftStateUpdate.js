import draftState from './draftState'
import getStateKey from './getStateKey'

export default function getDraftUpdate(draft, path) {
  const lastIndex = path.length - 1
  const parentPath = path.slice(0, lastIndex)
  return [draftState(draft, parentPath), getStateKey(path[lastIndex])]
}
