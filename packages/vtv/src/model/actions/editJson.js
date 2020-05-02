import produce from 'immer'
import { getDraftUpdate, draftState } from '../util'

export default function editJson(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const [parent, key] = getDraftUpdate(draft, treeUpdate.path)
    const state = draftState(draft, treeUpdate.path)
    parent[key] = treeUpdate.value
    state._view = null
  })
}
