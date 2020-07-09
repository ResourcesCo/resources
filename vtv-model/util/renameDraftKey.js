// rename the key in a draft while preserving order
export default function renameDraftKey(draftParentValue, key, newKey) {
  const keys = Object.keys(draftParentValue)
  const keysToAppend = keys.slice(keys.indexOf(key) + 1)
  const valuesToAppend = []

  // save and remove all key/value pairs after the old key name
  for (let key of keysToAppend) {
    valuesToAppend.push(draftParentValue[key])
    delete draftParentValue[key]
  }

  // rename the key
  const newValue = draftParentValue[key]
  delete draftParentValue[key]
  draftParentValue[newKey] = newValue

  // add all the saved key/value pairs back
  for (let i = 0; i < keysToAppend.length; i++) {
    draftParentValue[keysToAppend[i]] = valuesToAppend[i]
  }
}
