const updateNestedState = (state, path = [], pathState, options = {}) => {
  if (path.length === 0) {
    const optionState = {}
    if (options.savePrevExpanded) {
      optionState._prevExpanded = state._expanded
    } else if (options.restoreExpanded) {
      optionState._expanded = state._prevExpanded
    }
    return { ...state, ...pathState, ...optionState }
  }
  const [key, ...remainingPath] = path
  const stateKey = key.startsWith('_') ? `_${key}` : key
  const result = {
    ...state,
    [stateKey]: updateNestedState(
      getChildState(state, key),
      remainingPath,
      pathState,
      options
    ),
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
      [key]: childValue,
    }
  }
}

const updateNestedValue = (value, path, pathValueOrFn) => {
  if ((path || []).length === 0) {
    return typeof pathValueOrFn === 'function'
      ? pathValueOrFn(value[path[0]])
      : pathValueOrFn
  }
  if (path.length === 1) {
    return replaceKey(
      value,
      path[0],
      typeof pathValueOrFn === 'function'
        ? pathValueOrFn(value[path[0]])
        : pathValueOrFn
    )
  } else {
    const [key, ...rest] = path
    return replaceKey(
      value,
      key,
      updateNestedValue(value[key], rest, pathValueOrFn)
    )
  }
}

export const updateTree = (treeData, treeUpdate) => {
  if (treeUpdate.action) {
    if (treeUpdate.action === 'showOnlyThis') {
      let state = updateNestedState(treeData.state, [], {
        _showOnly: treeUpdate.path,
      })
      state = updateNestedState(state, treeUpdate.path, { _expanded: true })
      return {
        ...treeData,
        state,
      }
    } else if (treeUpdate.action === 'showAll') {
      return {
        ...treeData,
        state: updateNestedState(treeData.state, [], { _showOnly: null }),
      }
    } else if (treeUpdate.action === 'editName') {
      let updatedMessage = {
        ...treeData,
        state: updateNestedState(treeData.state, treeUpdate.path, {
          _editingName: treeUpdate.editing,
        }),
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
    } else if (treeUpdate.action === 'edit') {
      return {
        ...treeData,
        state: updateNestedState(treeData.state, treeUpdate.path, {
          _editing: treeUpdate.editing,
        }),
        value:
          typeof treeUpdate.value === 'undefined'
            ? treeData.value
            : updateNestedValue(
                treeData.value,
                treeUpdate.path,
                treeUpdate.value
              ),
      }
    } else if (treeUpdate.action === 'editJson') {
      return {
        ...treeData,
        state: updateNestedState(
          treeData.state,
          treeUpdate.path,
          { _expanded: true, _editingJson: treeUpdate.editing },
          treeUpdate.editing
            ? { savePrevExpanded: true }
            : { restoreExpanded: true }
        ),
        value:
          typeof treeUpdate.value === 'undefined'
            ? treeData.value
            : updateNestedValue(
                treeData.value,
                treeUpdate.path,
                treeUpdate.value
              ),
      }
    } else if (treeUpdate.action === 'insert') {
      const parentPath = treeUpdate.path.slice(0, treeUpdate.path.length - 1)
      const key = treeUpdate.path[treeUpdate.path.length - 1]
      let state = treeData.state
      const insert = parent => {
        if (Array.isArray(parent)) {
          const result = []
          let newKey
          for (let i = 0; i < parent.length; i++) {
            if (treeUpdate.position === 'above' && i === Number(key)) {
              result.push(null)
              newKey = `${i}`
            }
            result.push(parent[i])
            if (treeUpdate.position === 'below' && i === Number(key)) {
              result.push(null)
              newKey = `${i + 1}`
            }
          }
          state = updateNestedState(treeData.state, [...parentPath, newKey], {
            _editing: true,
          })
          return result
        } else {
          const result = {}
          let newKey = ''
          if (Object.keys(parent).includes(newKey)) {
            for (let i = 1; i <= 10; i++) {
              newKey = `newItem${i}`
              if (!Object.keys(parent).includes(newKey)) break
            }
          }
          for (let parentKey of Object.keys(parent)) {
            if (treeUpdate.position === 'above' && parentKey === key) {
              result[newKey] = ''
            }
            result[parentKey] = parent[parentKey]
            if (treeUpdate.position === 'below' && parentKey === key) {
              result[newKey] = ''
            }
          }
          state = updateNestedState(treeData.state, [...parentPath, newKey], {
            _editingName: true,
          })
          return result
        }
      }
    } else if (treeUpdate.action === 'delete') {
      const parentPath = treeUpdate.path.slice(0, treeUpdate.path.length - 1)
      const key = treeUpdate.path[treeUpdate.path.length - 1]
      let state = treeData.state
      const del = parent => {
        if (Array.isArray(parent)) {
          const result = []
          for (let i = 0; i < parent.length; i++) {
            if (i !== Number(key)) {
              result.push(parent[i])
            }
          }
          return result
        } else {
          const result = {}
          for (let parentKey of Object.keys(parent)) {
            if (parentKey !== key) {
              result[parentKey] = parent[parentKey]
            }
          }
          return result
        }
      }

      let value
      if (parentPath.length > 0) {
        value = updateNestedValue(treeData.value, parentPath, del)
      } else {
        value = del(treeData.value)
      }

      return {
        ...treeData,
        value,
      }
    }
  } else {
    return {
      ...treeData,
      value: treeUpdate.value || treeData.value,
      state: updateNestedState(
        treeData.state,
        treeUpdate.path,
        treeUpdate.state
      ),
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
      newValue[key === oldName ? name : key] = value[key]
    })
    return {
      value: newValue,
      state: { ...newState, [newStateKey]: getChildState(state, oldName) },
    }
  } else if (path.length > 1) {
    const [key, ...rest] = path
    const stateKey = key.startsWith('_') ? `_${key}` : key
    const { state: childState, value: childValue } = rename(
      value[key],
      getChildState(state, key),
      rest,
      name
    )
    return {
      value: replaceKey(value, key, childValue),
      state: {
        ...getState(state),
        [stateKey]: childState,
      },
    }
  } else {
    return { value, state }
  }
}
