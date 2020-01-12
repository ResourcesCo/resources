import { useState } from 'react'
import { getState } from './state'
import { hasChildren } from './analyze'
import useClickOutside from './useClickOutside'
import Menu, { MenuItem } from './Menu'

export default ({ onPickId, parentType, name, value, path, state, commandId, showAll, onMessage, onClose, theme }) => {
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
  }

  const sendAction = action => {
    onMessage({
      type: 'tree-update',
      path,
      action,
      treeCommandId: commandId,
    })
  }

  const pickId = () => {
    onPickId(name)
  }

  return <Menu theme={theme} onClose={onClose}>
    {!showAll && ['object', 'root'].includes(parentType) && <MenuItem onClick={() => sendAction('editName')}>Edit name</MenuItem>}
    {
      ['tree', 'table', 'json'].map(key => {
        if (key === viewType) {
          return null
        }
        if (key === 'table' && !hasChildren(value)) {
          return null
        }
        return <MenuItem key={key} onClick={() => setViewType(key)}>View as {key}</MenuItem>
      })
    }
    {!showAll && (path.length > 0) && <MenuItem onClick={() => sendAction('showOnlyThis')}>Show only this</MenuItem>}
    {showAll && <MenuItem onClick={() => sendAction('showAll')}>Show all</MenuItem>}
    <MenuItem onClick={pickId}>Paste into console</MenuItem>
  </Menu>
}
