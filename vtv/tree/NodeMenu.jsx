import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isBasicType } from '../../vtv-model/analyze'
import InsertMenu from './InsertMenu'
import ViewMenu from './ViewMenu'
import ClipboardMenu from './ClipboardMenu'
import Menu, { MenuItem } from '../generic/Menu'

function DeleteMenu({
  showAll,
  nodeType,
  path,
  context: { onMessage },
  context,
  ...props
}) {
  return (
    <Menu
      onClose={() => null}
      popperProps={{
        placement: 'left-start',
        modifiers: [{ name: 'offset', options: { offset: [0, -3] } }],
      }}
      context={context}
      {...props}
    >
      {!showAll && (
        <MenuItem onClick={() => onMessage({ path, action: 'deleteNode' })}>
          Node
        </MenuItem>
      )}
      <MenuItem onClick={() => onMessage({ path, action: 'deleteValue' })}>
        {['object', 'array'].includes(nodeType) ? 'Children' : 'Value'}
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
  showAll,
  onClose,
  onViewChanged,
  nameOptionsFirst = false,
  popperProps,
  context: { onMessage, onPickId },
  context,
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

  const edit = () => {
    sendAction('edit', { editing: true })
  }

  const pickId = () => {
    onPickId(path)
  }

  return (
    <Menu onClose={onClose} popperProps={popperProps} context={context}>
      {nameOptionsFirst &&
        !showAll &&
        ['object', null].includes(parentType) && (
          <MenuItem onClick={() => sendAction('rename', { editing: true })}>
            Rename
          </MenuItem>
        )}
      {isBasicType(value) && <MenuItem onClick={edit}>Edit</MenuItem>}
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
            showAll={showAll}
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
              showAll={showAll}
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
              onClose={onClose}
              context={context}
            />
          }
        >
          Clipboard
        </MenuItem>
      )}
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('attach')}>Attach file</MenuItem>
      )}
      {!nameOptionsFirst &&
        !showAll &&
        ['object', null].includes(parentType) && (
          <MenuItem onClick={() => sendAction('rename', { editing: true })}>
            Rename
          </MenuItem>
        )}
      <MenuItem
        submenu={
          <DeleteMenu
            showAll={showAll}
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
