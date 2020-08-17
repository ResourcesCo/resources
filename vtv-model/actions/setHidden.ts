import produce from 'immer'
import { draftState } from '../util'

export default function hide(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const { path, hidden } = treeUpdate
    const state = draftState(draft, path)
    if (hidden === true) {
      state._hidden = true
    } else {
      delete state._hidden
    }
  })
}
