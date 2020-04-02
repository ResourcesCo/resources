import getNested from 'lodash/get'
import produce from 'immer'
import {
  getStateKey,
  draftValue,
  draftState,
  clearStateProperty,
  getState,
  getChildState,
  getNestedState,
} from './util'
import { rename } from './actions'

export {
  getStateKey,
  draftValue,
  draftState,
  getState,
  getChildState,
  getNestedState,
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

export const getDraftUpdate = (draft, path) => {
  if (path.length === 0) {
    return [draft, 'value']
  } else {
    const lastIndex = path.length - 1
    const parentPath = path.slice(0, lastIndex)
    return [draftValue(draft, parentPath), path[lastIndex]]
  }
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
      return rename(treeData, treeUpdate)
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
    } else if (['insert', 'paste'].includes(treeUpdate.action)) {
      let state = treeData.state
      let parentPath, key
      const newValue = treeUpdate.action === 'paste' ? treeUpdate.value : null
      if (['above', 'below'].includes(treeUpdate.position)) {
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
          if (treeUpdate.action === 'insert') {
            state = updateNestedState(state, [...parentPath, newKey], {
              _editing: true,
            })
          }
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
          if (treeUpdate.action === 'insert') {
            state = updateNestedState(state, [...parentPath, newKey], {
              _editing: true,
            })
          }
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
        state: updateNestedState(treeData.state, treeUpdate.path, {
          _expanded: true,
        }),
      }
    } else if (treeUpdate.action === 'setError') {
      return {
        state: updateNestedState(treeData.state, treeUpdate.path, {
          _error: treeUpdate.error,
        }),
      }
    } else if (treeUpdate.action === 'clearErrors') {
      return produce(treeData, draft => {
        clearStateProperty(draft, treeUpdate.path || [], '_error')
      })
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

export const removeTemporaryState = tree => {
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
