import draftState from './draftState'

function clearProperty(state, propertyName) {
  if (typeof state === 'object' && state !== null) {
    delete state[propertyName]
    for (const key of Object.keys(state)) {
      if (!key.startsWith('_') || key.startsWith('__')) {
        clearProperty(state[key], propertyName)
      }
    }
  }
}

export default function clearStateProperty(draft, path = [], propertyName) {
  const state = draftState(draft, path)
  clearProperty(state, propertyName)
}
