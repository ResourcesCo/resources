import produce from 'immer'
import { draftState } from '../util'

export default function setView(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const { path, view } = treeUpdate
    const state = draftState(draft, path)
    state._view = view
    state._expanded = true
  })
}
