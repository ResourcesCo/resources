import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { getState } from '../model/state'
import { hasChildren, isBasicType } from '../model/analyze'
import useClickOutside from '../util/useClickOutside'
import ClipboardMenu from './ClipboardMenu'
import Menu, { MenuItem } from '../generic/Menu'

function NodeMenu({
  onPickId,
  parentType,
  nodeType,
  name,
  value,
  path,
  state,
  showAll,
  onMessage,
  onClose,
  onViewChanged,
  nameOptionsFirst = false,
  popperProps,
  clipboard,
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

  return (
    <Menu onClose={onClose} popperProps={popperProps} theme={theme}>
      {nameOptionsFirst &&
        !showAll &&
        ['object', null].includes(parentType) && (
          <MenuItem onClick={() => sendAction('rename', { editing: true })}>
            Rename
          </MenuItem>
        )}
      {!showAll && isBasicType(value) && (
        <MenuItem onClick={edit}>Edit</MenuItem>
      )}
      {['tree', 'table'].map(key => {
        if (key === viewType) {
          return null
        }
        if (key === 'table' && !hasChildren(value)) {
          return null
        }
        return (
          <MenuItem key={key} onClick={() => setViewType(key)}>
            View as {key}
          </MenuItem>
        )
      })}
      {!showAll && ['object', 'array'].includes(nodeType) && (
        <MenuItem onClick={() => sendAction('insert', { position: 'append' })}>
          Append Child
        </MenuItem>
      )}
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('insert', { position: 'above' })}>
          Insert Before
        </MenuItem>
      )}
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('insert', { position: 'below' })}>
          Insert After
        </MenuItem>
      )}
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem
          submenu={
            <ClipboardMenu
              name={name}
              value={value}
              path={path}
              state={state}
              showAll={showAll}
              nodeType={nodeType}
              parentType={parentType}
              onMessage={onMessage}
              onClose={onClose}
              clipboard={clipboard}
              theme={theme}
            />
          }
        >
          Clipboard
        </MenuItem>
      )}
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('upload')}>Upload file</MenuItem>
      )}
      {!nameOptionsFirst &&
        !showAll &&
        ['object', null].includes(parentType) && (
          <MenuItem onClick={() => sendAction('rename', { editing: true })}>
            Rename
          </MenuItem>
        )}
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('delete')}>Delete</MenuItem>
      )}
      {!showAll && <MenuItem onClick={editJson}>Edit JSON</MenuItem>}
      {!showAll && path.length > 0 && (
        <MenuItem onClick={() => sendAction('showOnlyThis')}>
          Show only this
        </MenuItem>
      )}
      {showAll && (
        <MenuItem onClick={() => sendAction('showAll')}>Show all</MenuItem>
      )}
      {typeof onPickId === 'function' && (
        <MenuItem onClick={pickId}>Paste into console</MenuItem>
      )}
    </Menu>
  )
}

NodeMenu.propTypes = {
  clipboard: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default NodeMenu
