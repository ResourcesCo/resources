import produce from 'immer'
import { draftState } from '../util'

export default function attach(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const { path } = treeUpdate
    const state = draftState(draft, path)
    state._attachments = state._attachments || {}
    state._attachments.open = true
  })
}
