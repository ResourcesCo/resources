import produce, { original } from 'immer'
import {
  getDraftUpdate,
  getDraftStateUpdate,
  spliceArrayKeysInObject,
} from '../util'

export default function deleteNode(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const [parentState, stateKey] = getDraftStateUpdate(draft, treeUpdate.path)
    const [parent, key] = getDraftUpdate(draft, treeUpdate.path)
    if (Array.isArray(parent)) {
      const originalLength = parent.length
      parent.splice(Number(key), 1)
      spliceArrayKeysInObject(parentState, originalLength, Number(key), 1)
    } else {
      delete parent[key]
      delete parentState[stateKey]
    }
  })
}
