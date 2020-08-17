import produce from 'immer'

function removeTemporaryKeys(value, temporaryKeys) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (let temporaryKey of temporaryKeys) {
      delete value[temporaryKey]
    }

    for (let key of Object.keys(value)) {
      if (key.startsWith('__') || !key.startsWith('_')) {
        removeTemporaryKeys(value[key], temporaryKeys)
      }
    }
  }
}

export default function removeTemporaryState(tree) {
  return produce(tree, tree => {
    removeTemporaryKeys(tree.state, [])
  })
}
