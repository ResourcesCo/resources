import { useState } from 'react'
import { getState } from './state'
import { hasChildren, isBasicType } from './analyze'
import useClickOutside from './useClickOutside'
import Menu, { MenuItem } from './Menu'

export default ({
  onPickId,
  parentType,
  name,
  value,
  path,
  state,
  commandId,
  showAll,
  onMessage,
  onClose,
  onViewChanged,
  theme,
}) => {
  const [action, setAction] = useState(null)

  const isArray = Array.isArray(value)
  const viewType = getState(state)._viewType || 'tree'

  const setViewType = viewType => {
    onMessage({
      type: 'tree-update',
      path,
      state: { _viewType: viewType, _expanded: true },
      treeCommandId: commandId,
    })
    onViewChanged()
  }

  const sendAction = (action, data = {}) => {
    onMessage({
      type: 'tree-update',
      path,
      action,
      treeCommandId: commandId,
      ...data,
    })
  }

  const editJson = () => {
    sendAction('editJson', { editing: true })
    onViewChanged()
  }

  const edit = () => {
    sendAction('edit', { editing: true })
  }

  const pickId = () => {
    onPickId(name)
  }

  return (
    <Menu theme={theme} onClose={onClose}>
      {['tree', 'table'].map(key => {
        if (key === viewType) {
          return null
        }
        if (key === 'table' && !hasChildren(value)) {
          return null
        }
        return (
          <MenuItem key={key} onClick={() => setViewType(key)}>
            {key === 'json' ? 'Edit JSON' : `View as ${key}`}
          </MenuItem>
        )
      })}
      {!showAll && isBasicType(value) && (
        <MenuItem onClick={edit}>Edit</MenuItem>
      )}
      {!showAll && ['object', 'root'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('editName', { editing: true })}>
          Rename
        </MenuItem>
      )}
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('insert', { position: 'above' })}>
          Insert Above
        </MenuItem>
      )}
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('insert', { position: 'below' })}>
          Insert Below
        </MenuItem>
      )}
      {!showAll && path.length > 0 && (
        <MenuItem onClick={() => sendAction('showOnlyThis')}>
          Show only this
        </MenuItem>
      )}
      {showAll && (
        <MenuItem onClick={() => sendAction('showAll')}>Show all</MenuItem>
      )}
      {!showAll && ['object', 'root'].includes(parentType) && (
        <MenuItem onClick={editJson}>Edit JSON</MenuItem>
      )}
      {typeof onPickId === 'function' &&
        <MenuItem onClick={pickId}>Paste into console</MenuItem>
      }
    </Menu>
  )
}
