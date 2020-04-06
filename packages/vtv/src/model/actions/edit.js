import produce from 'immer'
import { draftState, getDraftUpdate } from '../util'

export default function edit(treeData, treeUpdate) {
  return produce(treeData, draft => {
    draftState(draft, treeUpdate.path)._editing = treeUpdate.editing
    if (typeof treeUpdate.value !== 'undefined') {
      const [parent, key] = getDraftUpdate(draft, treeUpdate.path)
      parent[key] = treeUpdate.value
    }
  })
}
