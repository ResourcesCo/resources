import produce from 'immer'
import { draftState } from '../util'

export default function setError(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const { path, error } = treeUpdate
    const state = draftState(draft, path)
    state._error = error
  })
}
