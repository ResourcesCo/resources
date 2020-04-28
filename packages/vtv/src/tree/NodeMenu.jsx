import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isBasicType } from '../model/analyze'
import InsertMenu from './InsertMenu'
import ViewMenu from './ViewMenu'
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
        ['object', null].includes(parentType.baseType) && (
          <MenuItem onClick={() => sendAction('rename', { editing: true })}>
            Rename
          </MenuItem>
        )}
      {!showAll && isBasicType(value) && (
        <MenuItem onClick={edit}>Edit</MenuItem>
      )}
      <MenuItem
        submenu={
          <ViewMenu
            path={path}
            value={value}
            state={state}
            onMessage={onMessage}
            onViewChanged={onViewChanged}
            onClose={onClose}
            theme={theme}
          />
        }
      >
        View
      </MenuItem>
      <MenuItem
        submenu={
          <InsertMenu
            showAll={showAll}
            nodeType={nodeType}
            parentType={parentType}
            path={path}
            onMessage={onMessage}
            onClose={onClose}
            theme={theme}
          />
        }
      >
        Insert
      </MenuItem>
      {!showAll && ['object', 'array'].includes(parentType.baseType) && (
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
      {!showAll && ['object', 'array'].includes(parentType.baseType) && (
        <MenuItem onClick={() => sendAction('attach')}>Attach file</MenuItem>
      )}
      {!nameOptionsFirst &&
        !showAll &&
        ['object', null].includes(parentType.baseType) && (
          <MenuItem onClick={() => sendAction('rename', { editing: true })}>
            Rename
          </MenuItem>
        )}
      {!showAll && ['object', 'array'].includes(parentType.baseType) && (
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
