import produce from 'immer'
import { getDraftUpdate, draftState } from '../util'

export default function convert(treeData, treeUpdate) {
  return produce(treeData, draft => {
    const { path, type } = treeUpdate
    const [parent, key] = getDraftUpdate(draft, path)
    const oldValue = parent[key]
    let newValue
    if (type === 'object') {
      newValue = {}
      if (Array.isArray(oldValue)) {
        for (let i = 0; i < oldValue.length; i++) {
          newValue[`${i}`] = oldValue[i]
        }
      }
    } else if (type === 'array') {
      newValue = []
      if (typeof oldValue === 'object' && oldValue !== null) {
        for (const key of Object.keys(oldValue)) {
          newValue.push(key)
          newValue.push(oldValue[key])
        }
      }
    }
    parent[key] = newValue
  })
}
