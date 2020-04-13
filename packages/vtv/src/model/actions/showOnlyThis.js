import produce from 'immer'
import { draftState } from '../util'

export default function showOnlyThis(treeData, treeUpdate) {
  return produce(treeData, draft => {
    draftState(draft, [])._showOnly = treeUpdate.path
    draftState(draft, treeUpdate.path)._expanded = true
  })
}
