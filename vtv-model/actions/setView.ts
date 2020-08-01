import produce from 'immer'
import { draftState } from '../util'

export default function setView(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const { path, view } = treeUpdate
    const state = draftState(draft, path)
    state._view = view
    if ('mediaType' in treeUpdate) {
      state._mediaType = treeUpdate.mediaType
    }
    state._expanded = true
  })
}
