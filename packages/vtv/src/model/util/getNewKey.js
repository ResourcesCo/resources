export default function getNewKey(parent, prefix) {
  let newKey = prefix
  if (Object.keys(parent).includes(newKey)) {
    for (let i = 1; i <= 1000; i++) {
      newKey = `${prefix}${i}`
      if (!Object.keys(parent).includes(newKey)) break
    }
  }
  return newKey
}
