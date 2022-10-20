import React from 'react'
import PropTypes from 'prop-types'
import InsertMenu from './InsertMenu'
import ViewMenu from './ViewMenu'
import EditMenu from './EditMenu'
import Menu, { MenuItem } from '../generic/Menu'

function DeleteMenu({
  nodeType,
  path,
  context: { onMessage },
  context,
  ...props
}) {
  return (
    <Menu
      onClose={() => null}
      context={context}
      {...props}
    >
      {path.length > 0 && (
        <MenuItem onClick={() => onMessage({ path, action: 'deleteNode' })}>
          Node
        </MenuItem>
      )}
      <MenuItem onClick={() => onMessage({ path, action: 'deleteContents' })}>
        Contents
      </MenuItem>
    </Menu>
  )
}

function NodeMenu({
  parentType,
  nodeType,
  stringType,
  mediaType,
  name,
  value,
  path,
  state,
  onClose,
  onViewChanged,
  nameOptionsFirst = false,
  popperProps,
  autoFocus = false,
  context: { onMessage, onPickId },
  context,
}) {
  const sendAction = (action, data = {}) => {
    onMessage({
      path,
      action,
      ...data,
    })
  }

  const pickId = () => {
    onPickId(path)
  }

  return (
    <Menu onClose={onClose} popperProps={popperProps} autoFocus={autoFocus} context={context}>
      {
        (autoFocus && !['object', 'array'].includes(nodeType) && !['code', 'text'].includes(state.view)) ? (
          <MenuItem onClick={() => sendAction('edit', { editing: true })}>
            Edit
          </MenuItem>
        ) : null
      }
      {
        (nameOptionsFirst && path.length > 0 && ['object', null].includes(parentType)) ? (
          <MenuItem onClick={() => sendAction('rename', { editing: true })}>
            Rename
          </MenuItem>
        ) : null
      }
      <MenuItem
        submenu={
          <ViewMenu
            path={path}
            value={value}
            state={state}
            nodeType={nodeType}
            stringType={stringType}
            mediaType={mediaType}
            parentType={parentType}
            onViewChanged={onViewChanged}
            onClose={onClose}
            context={context}
          />
        }
      >
        View
      </MenuItem>
      {(['object', 'array'].includes(parentType) ||
        ['object', 'array'].includes(nodeType)) && (
        <MenuItem
          submenu={
            <InsertMenu
              nodeType={nodeType}
              parentType={parentType}
              path={path}
              onClose={onClose}
              context={context}
            />
          }
        >
          Insert
        </MenuItem>
      )}
      <MenuItem
        submenu={
          <EditMenu
            name={name}
            value={value}
            path={path}
            state={state}
            nodeType={nodeType}
            parentType={parentType}
            onClose={onClose}
            context={context}
          />
        }
      >
        Edit
      </MenuItem>
      {['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('attach')}>Attach file</MenuItem>
      )}
      {!nameOptionsFirst && ['object', null].includes(parentType) && (
        <MenuItem onClick={() => sendAction('rename', { editing: true })}>
          Rename
        </MenuItem>
      )}
      <MenuItem
        submenu={
          <DeleteMenu
            nodeType={nodeType}
            path={path}
            onClose={onClose}
            context={context}
          />
        }
      >
        Delete
      </MenuItem>
      {typeof onPickId === 'function' && (
        <MenuItem onClick={pickId}>Paste into console</MenuItem>
      )}
    </Menu>
  )
}

NodeMenu.propTypes = {
  context: PropTypes.object.isRequired,
}

export default NodeMenu
