export default function getStateKey(key) {
  return typeof key === 'string' ? (key.startsWith('_') ? `_${key}` : key) : key
}
