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

export const updateTreeMessage = (treeMessage, treeUpdate) => {
  if (treeUpdate.action) {
    if (treeUpdate.action === 'showOnlyThis') {
      let state = updateNestedState(treeMessage.state, [], {_showOnly: treeUpdate.path})
      state = updateNestedState(state, treeUpdate.path, {_expanded: true})
      return {
        ...treeMessage,
        state,
      }
    } else if (treeUpdate.action === 'showAll') {
      return {
        ...treeMessage,
        state: updateNestedState(treeMessage.state, [], {_showOnly: null}),
      }
    } else {
      return treeMessage
    }
  } else {
    return {
      ...treeMessage,
      value: treeUpdate.value || treeMessage.value,
      state: updateNestedState(treeMessage.state, treeUpdate.path, treeUpdate.state),
    }
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
  return getState(getState(state)[key])
}

export const getNestedState = (state, path) => {
  if (path.length === 0) {
    return getState(state)
  } else {
    const [key, ...rest] = path
    return getNestedState(getChildState(state, key), rest)
  }
}
