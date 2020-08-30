import produce from 'immer'
import { getDraftUpdate, getDraftStateUpdate } from '../util'

export default function deleteContents(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const [parentState, stateKey] = getDraftStateUpdate(draft, treeUpdate.path)
    const [parent, key] = getDraftUpdate(draft, treeUpdate.path)
    parent[key] = null
    delete parentState[stateKey]
  })
}
