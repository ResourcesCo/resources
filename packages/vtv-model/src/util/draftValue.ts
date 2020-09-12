export default function draftValue(draft, path) {
  let draftValue = draft.value
  for (let key of path) {
    draftValue = draftValue[key]
  }
  return draftValue
}
