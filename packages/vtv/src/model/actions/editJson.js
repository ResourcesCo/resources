import produce from 'immer'
import { getDraftUpdate } from '../util'

export default function editJson(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const [parent, key] = getDraftUpdate(draft, treeUpdate.path)
    parent[key] = treeUpdate.value
  })
}
