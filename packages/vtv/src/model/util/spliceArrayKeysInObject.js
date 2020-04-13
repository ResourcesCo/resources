export default function spliceArrayKeysInObject(draft, len, ...args) {
  let maxDraftKey = 0
  for (const key of Object.keys(draft)) {
    if (!isNaN(key)) {
      maxDraftKey = Math.max(maxDraftKey, +key)
    }
  }
  const tempArray = []
  for (let i = 0; i <= Math.max(maxDraftKey, len - 1); i++) {
    tempArray.push(draft[i])
  }
  const originalLength = tempArray.length
  tempArray.splice(...args)
  const newLen = Math.max(originalLength, tempArray.length)
  for (let i = 0; i < newLen; i++) {
    if (typeof tempArray[i] !== 'undefined') {
      draft[i] = tempArray[i]
    } else {
      delete draft[`${i}`]
    }
  }
}
