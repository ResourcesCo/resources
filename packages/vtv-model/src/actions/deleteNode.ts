import produce, { original } from 'immer'
import {
  getDraftUpdate,
  getDraftStateUpdate,
  spliceArrayKeysInObject,
  getStateKey,
} from '../util'

export default function deleteNode(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const [parentState, stateKey] = getDraftStateUpdate(draft, treeUpdate.path)
    const [parent, key] = getDraftUpdate(draft, treeUpdate.path)
    const keyIndex = Object.keys(parent).indexOf(key)
    if (Array.isArray(parent)) {
      const originalLength = parent.length
      parent.splice(Number(key), 1)
      spliceArrayKeysInObject(parentState, originalLength, Number(key), 1)
    } else {
      delete parent[key]
      delete parentState[stateKey]
    }
    const parentKeys = Object.keys(parent)
    if (parentKeys.length) {
      const stateKey = getStateKey(parentKeys[Math.min(keyIndex, parentKeys.length - 1)])
      if (!(stateKey in parentState)) {
        parentState[stateKey] = {}
      }
      parentState[stateKey]._focus = true
    } else {
      parentState._focus = true
    }
  })
}
