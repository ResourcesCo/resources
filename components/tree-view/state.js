const updateNestedState = (state, path = [], pathState, options = {}) => {
  if (path.length === 0) {
    const optionState = {}
    if (options.savePrevExpanded) {
      optionState._prevExpanded = state._expanded
    } else if (options.restoreExpanded) {
      optionState._expanded = state._prevExpanded
    }
    return {...state, ...pathState, ...optionState}
  }
  const [key, ...remainingPath] = path
  const stateKey = key.startsWith('_') ? `_${key}` : key
  const result = {
    ...state,
    [stateKey]: updateNestedState(getChildState(state, key), remainingPath, pathState, options)
  }
  return result
}

const replaceKey = (value, key, childValue) => {
  if (Array.isArray(value)) {
    const result = value.slice()
    result[key] = childValue
    return result
  } else {
    return {
      ...value,
      [key]: childValue
    }
  }
}

const updateNestedValue = (value, path, pathValue) => {
  if (path.length === 1) {
    return replaceKey(value, path[0], pathValue)
  } else {
    const [key, ...rest] = path
    return replaceKey(value, path[0], updateNestedValue(value[key], rest, pathValue))
  }
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
      let updatedMessage = {
        ...treeMessage,
        state: updateNestedState(treeMessage.state, treeUpdate.path, {_editingName: treeUpdate.editing})
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
    } else if (treeUpdate.action === 'editJson') {
      return {
        ...treeMessage,
        state: updateNestedState(
          treeMessage.state,
          treeUpdate.path,
          {_expanded: true, _editingJson: treeUpdate.editing},
          treeUpdate.editing ? {savePrevExpanded: true} : {restoreExpanded: true}
        ),
        value: (
          typeof treeUpdate.value === 'undefined' ?
          treeMessage.value :
          updateNestedValue(treeMessage.value, treeUpdate.path, treeUpdate.value)
        ),
      }
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
      value: replaceKey(value, key, childValue),
      state: {
        ...getState(state),
        [stateKey]: childState,
      },
    }
  } else {
    return {value, state}
  }
}
