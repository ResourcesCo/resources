import { useRef } from 'react'
import { getState } from './state'
import { hasChildren } from './analyze'
import useClickOutside from './useClickOutside'
import Menu, { MenuItem } from './Menu'

export default ({ onPickId, name, value, path, state, commandId, onSubmitForm, onClose, theme }) => {
  const isArray = Array.isArray(value)
  const viewType = getState(state)._viewType || 'tree'

  const setViewType = viewType => {
    onSubmitForm({
      message: 'channel _updateCommand',
      commandId,
      formData: {
        path,
        state: { _viewType: viewType, _expanded: true }
      }
    })
  }

  const pickId = () => {
    onPickId(name)
  }

  return <Menu theme={theme} onClose={onClose}>
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
    <MenuItem onClick={pickId}>Paste into console</MenuItem>
  </Menu>
}
