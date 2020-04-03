import produce from 'immer'
import { draftState, getDraftUpdate } from '../util'

export default function edit(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const nodeDraftState = draftState(draft, treeUpdate.path)
    nodeDraftState._editingJson = treeUpdate.editing
    if (treeUpdate.editing) {
      if (nodeDraftState._expanded !== true) {
        nodeDraftState._prevExpanded = nodeDraftState._expanded
        nodeDraftState._expanded = true
      }
    } else {
      if (typeof nodeDraftState._prevExpanded === 'boolean') {
        nodeDraftState._expanded = nodeDraftState._prevExpanded
      }
    }
    if (typeof treeUpdate.value !== 'undefined') {
      const [parent, key] = getDraftUpdate(draft, treeUpdate.path)
      parent[key] = treeUpdate.value
    }
  })
}
