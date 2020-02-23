import getNested from 'lodash/get'
import produce from 'immer'

export function getStateKey(key) {
  return typeof key === 'string' ? (key.startsWith('_') ? `_${key}` : key) : key
}

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

export const draftValue = (draft, path) => {
  let draftValue = draft.value
  for (let key of path) {
    draftValue = draftValue[key]
  }
  return draftValue
}

export const getDraftUpdate = (draft, path) => {
  if (path.length === 0) {
    return [draft, 'value']
  } else {
    const lastIndex = path.length - 1
    const parentPath = path.slice(0, lastIndex)
    return [draftValue(draft, parentPath), path[lastIndex]]
  }
}

export const draftState = (draft, path) => {
  let draftState = draft.state
  for (let key of path) {
    const stateKey = getStateKey(key)
    draftState[stateKey] = draftState[stateKey] || {}
    draftState = draftState[stateKey]
  }
  return draftState
}

export const updateTree = (treeData, treeUpdate) => {
  if (treeUpdate.action) {
    if (treeUpdate.action === 'showOnlyThis') {
      return produce(treeData, draft => {
        draftState(draft, [])._showOnly = treeUpdate.path
        draftState(draft, treeUpdate.path)._expanded = true
      })
    } else if (treeUpdate.action === 'showAll') {
      return produce(treeData, draft => {
        const rootDraftState = draftState(draft, [])
        delete rootDraftState['_showOnly']
      })
    } else if (treeUpdate.action === 'rename') {
      return produce(treeData, draft => {
        draftState(draft, treeUpdate.path)._editingName = treeUpdate.editing
        if (typeof treeUpdate.value !== 'undefined') {
          if (treeUpdate.path.length === 0) {
            draft.name = treeUpdate.value
          } else if (treeUpdate.path[0] !== treeUpdate.value) {
            const lastIndex = treeUpdate.path.length - 1
            const parentPath = treeUpdate.path.slice(0, lastIndex)
            const key = treeUpdate.path[lastIndex]
            const draftParentValue = draftValue(draft, parentPath)

            const keys = Object.keys(draftParentValue)
            const keysToAppend = keys.slice(keys.indexOf(key) + 1)
            const valuesToAppend = []
            for (let key of keysToAppend) {
              valuesToAppend.push(draftParentValue[key])
              delete draftParentValue[key]
            }
            draftParentValue[treeUpdate.value] = draftParentValue[key]
            delete draftParentValue[key]
            for (let i = 0; i < keysToAppend.length; i++) {
              draftParentValue[keysToAppend[i]] = valuesToAppend[i]
            }

            const draftParentState = draftState(draft, parentPath)
            draftParentState[getStateKey(treeUpdate.value)] =
              draftParentState[getStateKey(key)]
            delete draftParentState[getStateKey(key)]
          }
        }
      })
    } else if (treeUpdate.action === 'edit') {
      return produce(treeData, draft => {
        draftState(draft, treeUpdate.path)._editing = treeUpdate.editing
        if (typeof treeUpdate.value !== 'undefined') {
          const [parent, key] = getDraftUpdate(draft, treeUpdate.path)
          parent[key] = treeUpdate.value
        }
      })
    } else if (treeUpdate.action === 'editJson') {
      return produce(treeData, draft => {
        const nodeDraftState = draftState(draft, treeUpdate.path)
        nodeDraftState._editingJson = treeUpdate.editing
        if (treeUpdate.editing) {
          if (nodeDraftState._expanded !== true) {
            nodeDraftState._prevExpanded = nodeDraftState._expanded
            nodeDraftState._expanded = true
          }
        } else {
          if (typeof nodeDraftState._prevExpanded === 'boolean') {
            nodeDraftState._expanded = nodeDraftState._prevExpanded
          }
        }
        if (typeof treeUpdate.value !== 'undefined') {
          const [parent, key] = getDraftUpdate(draft, treeUpdate.path)
          parent[key] = treeUpdate.value
        }
      })
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
