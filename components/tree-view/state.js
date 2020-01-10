const updateNestedState = (state, path = [], pathState) => {
  if (path.length === 0) {
    return {...state, ...pathState}
  }
  const [key, ...remainingPath] = path
  const stateKey = key.startsWith('_') ? `_${key}` : key
  const result = {
    ...state,
    [stateKey]: updateNestedState(state[stateKey], remainingPath, pathState)
  }
  return result
}

export const updateTreeMessage = (treeMessage, {treeUpdate}) => {
  return {
    ...treeMessage,
    value: treeUpdate.value || treeMessage.value,
    state: updateNestedState(treeMessage.state, treeUpdate.path, treeUpdate.state),
  }
}

export const getState = state => {
  return {
    _expanded: false,
    _viewType: 'tree',
    ...(state || {}),
  }
}

export const getChildState = (state, key) => {
  const stateKey = key.startsWith('_') ? `_${key}` : key
  return getState(state)[key]
}
