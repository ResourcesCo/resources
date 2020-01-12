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
    } else if (treeUpdate.action === 'editName') {
      const editingName = (
        typeof treeUpdate.value === 'undefined' ?
        (typeof treeUpdate.editing === 'undefined' ? true : treeUpdate.editing) :
        false
      )
      let updatedMessage = {
        ...treeMessage,
        state: updateNestedState(treeMessage.state, treeUpdate.path, {_editingName: editingName})
      }
      if (typeof treeUpdate.value !== 'undefined') {
        if (treeUpdate.path.length === 0) {
          return {
            ...updatedMessage,
            name: treeUpdate.value,
          }
        } else if (treeUpdate.path[0] !== treeUpdate.value) {
          const { value: valueAfterRename, state: stateAfterRename } = rename(
            updatedMessage.value,
            updatedMessage.state,
            treeUpdate.path,
            treeUpdate.value
          )
          return {
            ...updatedMessage,
            value: valueAfterRename,
            state: stateAfterRename,
          }
        } else {
          return updatedMessage
        }
      }
      return updatedMessage
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

const rename = (value, state, path, name) => {
  if (path.length === 1) {
    const oldName = path[0]
    const oldStateKey = oldName.startsWith('_') ? `_${oldName}` : oldName
    const newStateKey = name.startsWith('_') ? `_${name}` : name
    const { [oldStateKey]: deleted2, ...newState } = getState(state)
    const newValue = {}
    Object.keys(value).forEach(key => {
      newValue[key === oldName ? name: key] = value[key]
    })
    return {
      value: newValue,
      state: { ...newState, [newStateKey]: getChildState(state, oldName) }
    }
  } else if (path.length > 1) {
    const [key, ...rest] = path
    const stateKey = key.startsWith('_') ? `_${key}` : key
    const { state: childState, value: childValue } = rename(value[key], getChildState(state, key), rest, name)
    return {
      value: {
        ...value,
        [key]: childValue
      },
      state: {
        ...getState(state),
        [stateKey]: childState,
      },
    }
  } else {
    return {value, state}
  }
}
