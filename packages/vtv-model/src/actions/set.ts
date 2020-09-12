import produce from 'immer'
import { getDraftUpdate, draftState } from '../util'

export default function set(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const { path, value } = treeUpdate
    const [parent, key] = getDraftUpdate(draft, path)
    const state = draftState(draft, path)
    parent[key] = value
    state._expanded = true
  })
}
