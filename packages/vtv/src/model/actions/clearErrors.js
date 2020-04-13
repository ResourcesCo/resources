import produce from 'immer'
import { clearStateProperty } from '../util'

export default function clearErrors(treeData, treeUpdate) {
  return produce(treeData, draft => {
    clearStateProperty(draft, [], '_error')
  })
}
