export default function toArray(result) {
  if (Array.isArray(result)) {
    return result
  } else if (result) {
    return [result]
  } else {
    return []
  }
}
