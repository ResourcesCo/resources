import produce from 'immer'

export default function removeTemporaryState(tree) {
  return produce(tree, draft => {
    const removeTemporaryKeys = value => {
      if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        for (let temporaryKey of temporaryKeys) {
          delete value[temporaryKey]
        }

        for (let key of Object.keys(value)) {
          if (key.startsWith('__') || !key.startsWith('_')) {
            removeTemporaryKeys(value[key])
          }
        }
      }
    }
    removeTemporaryKeys(draft.state)
  })
}
