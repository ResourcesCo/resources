import produce from 'immer'
import { draftState, getDraftUpdate } from '../util'

export default function attach(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const { path, value } = treeUpdate
    const state = draftState(draft, path)
    if (typeof value !== 'undefined') {
      const [parent, key] = getDraftUpdate(draft, path)
      parent[key] = value
      delete state['_attachments']
    } else {
      state._attachments = state._attachments || { open: true }
      state._attachments.open = true
    }
  })
}
