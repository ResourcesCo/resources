import getNested from 'lodash/get'

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
  const result = {
    ...state,
    [getStateKey(key)]: updateNestedState(
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
    } else if (treeUpdate.action === 'rename') {
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
    } else if (['insert', 'appendChild'].includes(treeUpdate.action)) {
      let state = treeData.state
      let parentPath, key
      const newValue = null
      if (treeUpdate.action === 'insert') {
        parentPath = treeUpdate.path.slice(0, treeUpdate.path.length - 1)
        key = treeUpdate.path[treeUpdate.path.length - 1]
      } else {
        parentPath = treeUpdate.path
        const value = getNested(treeData.value, parentPath)
        key = null
        state = updateNestedState(state, parentPath, {
          _expanded: true,
        })
      }
      const insert = parent => {
        if (Array.isArray(parent)) {
          let result
          let newKey
          if (key === null) {
            result = [...parent, newValue]
            newKey = result.length - 1
          } else {
            result = []
            for (let i = 0; i < parent.length; i++) {
              if (treeUpdate.position === 'above' && i === Number(key)) {
                result.push(newValue)
                newKey = `${i}`
              }
              result.push(parent[i])
              if (treeUpdate.position === 'below' && i === Number(key)) {
                result.push(newValue)
                newKey = `${i + 1}`
              }
            }
          }
          state = updateNestedState(state, [...parentPath, newKey], {
            _editing: true,
          })
          return result
        } else {
          let newKey = 'newItem'
          if (Object.keys(parent).includes(newKey)) {
            for (let i = 1; i <= 1000; i++) {
              newKey = `newItem${i}`
              if (!Object.keys(parent).includes(newKey)) break
            }
          }
          let result
          if (key === null) {
            result = { ...parent, [newKey]: newValue }
          } else {
            result = {}
            for (let parentKey of Object.keys(parent)) {
              if (treeUpdate.position === 'above' && parentKey === key) {
                result[newKey] = newValue
              }
              result[parentKey] = parent[parentKey]
              if (treeUpdate.position === 'below' && parentKey === key) {
                result[newKey] = newValue
              }
            }
          }
          state = updateNestedState(state, [...parentPath, newKey], {
            _editing: true,
          })
          return result
        }
      }

      let value
      if (parentPath.length > 0) {
        value = updateNestedValue(treeData.value, parentPath, insert)
      } else {
        value = insert(treeData.value)
      }

      return {
        ...treeData,
        value,
        state,
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
    } else if (treeUpdate.action === 'set') {
      return {
        value: {
          ...treeData.value,
          response: treeUpdate.value,
        },
        state: updateNestedState(treeData.state, ['response'], {
          _expanded: true,
        }),
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

export function getStateKey(key) {
  return typeof key === 'string' ? (key.startsWith('_') ? `_${key}` : key) : key
}

export const getChildState = (state, key) => {
  return getState(getState(state)[getStateKey(key)])
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
    const oldStateKey = getStateKey(oldName)
    const newStateKey = getStateKey(name)
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
    const stateKey = getStateKey(key)
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
