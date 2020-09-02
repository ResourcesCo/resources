import produce from 'immer'
import { draftState } from '../util'

export default function showAll(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const rootDraftState = draftState(draft, [])
    delete rootDraftState['_showOnly']
  })
}
