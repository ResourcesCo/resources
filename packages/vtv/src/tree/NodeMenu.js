import { useState } from 'react'
import { getState } from '../model/state'
import { hasChildren, isBasicType } from '../model/analyze'
import useClickOutside from '../util/useClickOutside'
import Menu, { MenuItem } from '../generic/Menu'

export default function NodeMenu({
  onPickId,
  parentType,
  name,
  value,
  path,
  state,
  showAll,
  onMessage,
  onClose,
  onViewChanged,
  nameOptionsFirst,
  popperProps,
  theme,
}) {
  const [action, setAction] = useState(null)

  const isArray = Array.isArray(value)
  const viewType = getState(state)._viewType || 'tree'

  const setViewType = viewType => {
    onMessage({
      path,
      state: { _viewType: viewType, _expanded: true },
    })
    onViewChanged()
  }

  const sendAction = (action, data = {}) => {
    onMessage({
      path,
      action,
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
    onPickId(path)
  }

  const nameOptions = {
    rename: !showAll && ['object', 'root'].includes(parentType) && (
      <MenuItem onClick={() => sendAction('rename', { editing: true })}>
        Rename
      </MenuItem>
    ),
    pasteIntoConsole: typeof onPickId === 'function' && (
      <MenuItem onClick={pickId}>Paste into console</MenuItem>
    ),
  }

  return (
    <Menu onClose={onClose} popperProps={popperProps} theme={theme}>
      {nameOptionsFirst && nameOptions.rename}
      {nameOptionsFirst && nameOptions.pasteIntoConsole}
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
      {!nameOptionsFirst && nameOptions.rename}
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
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('delete')}>Delete</MenuItem>
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
      {!nameOptionsFirst && nameOptions.pasteIntoConsole}
    </Menu>
  )
}
