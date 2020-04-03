import draftValue from './draftValue'

export default function getDraftUpdate(draft, path) {
  if (path.length === 0) {
    return [draft, 'value']
  } else {
    const lastIndex = path.length - 1
    const parentPath = path.slice(0, lastIndex)
    return [draftValue(draft, parentPath), path[lastIndex]]
  }
}
