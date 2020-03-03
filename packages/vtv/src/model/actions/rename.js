import produce from 'immer'
import { getStateKey, draftValue, draftState, renameDraftKey } from '../util'

export default function rename(treeData, treeUpdate) {
  return produce(treeData, draft => {
    draftState(draft, treeUpdate.path)._editingName = treeUpdate.editing
    if (typeof treeUpdate.value !== 'undefined') {
      if (treeUpdate.path.length === 0) {
        draft.name = treeUpdate.value
      } else if (
        treeUpdate.path[treeUpdate.path.length - 1] !== treeUpdate.value
      ) {
        const lastIndex = treeUpdate.path.length - 1
        const parentPath = treeUpdate.path.slice(0, lastIndex)
        const key = treeUpdate.path[lastIndex]
        const draftParentValue = draftValue(draft, parentPath)

        renameDraftKey(draftParentValue, key, treeUpdate.value)

        const draftParentState = draftState(draft, parentPath)
        draftParentState[getStateKey(treeUpdate.value)] =
          draftParentState[getStateKey(key)]
        delete draftParentState[getStateKey(key)]
      }
    }
  })
}
