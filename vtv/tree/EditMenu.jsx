import React from 'react'
import PropTypes from 'prop-types'
import Menu, { MenuItem, Separator } from '../generic/Menu'

import { getStateKey } from '../../vtv-model/state'

function EditMenu({
  name,
  value,
  path,
  state,
  nodeType,
  parentType,
  showAll,
  context: { onMessage, clipboard },
  context,
  ...props
}) {
  const hasPasteData = true

  // needed for copy to clipboard component
  const nodeJson = JSON.stringify({ [name]: value }, null, 2)

  const valueJson = JSON.stringify(value, null, 2)

  const doClipboardAction = (
    clipboardAction,
    { name, value, state, position }
  ) => {
    if (
      ['cutNode', 'copyNode', 'cutContents', 'copyContents'].includes(
        clipboardAction
      )
    ) {
      const valueJson = JSON.stringify(
        ['cutNode', 'copyNode'].includes(clipboardAction)
          ? { [name]: value }
          : value,
        null,
        2
      )
      const stateJson = JSON.stringify(
        ['cutNode', 'copyNode'].includes(clipboardAction)
          ? { [getStateKey(name)]: state }
          : state,
        null,
        2
      )

      // copy to internal clipboard
      clipboard.value = valueJson
      clipboard.state = stateJson
      if (['cutNode', 'cutContents'].includes(clipboardAction)) {
        onMessage({
          path,
          action:
            clipboardAction === 'cutNode' ? 'deleteNode' : 'deleteContents',
        })
      }
    } else if (clipboardAction === 'paste') {
      if (typeof clipboard.value === 'string') {
        let value
        try {
          value = JSON.parse(clipboard.value)
        } catch (err) {
          value = clipboard.value
        }
        let state = undefined
        if (typeof clipboard.state === 'string' && clipboard.state.length) {
          try {
            state = JSON.parse(clipboard.state)
          } catch (err) {
            state = undefined
          }
        }
        onMessage({
          path,
          action: 'insert',
          value,
          state,
          position,
          paste: true,
        })
      }
    }
  }

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
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem
          onClick={() => doClipboardAction('cutNode', { name, value, state })}
          {...(clipboard.copyToSystemClipboard && {
            copyToClipboard: valueJson,
          })}
        >
          Cut Node
        </MenuItem>
      )}
      <MenuItem
        onClick={() => doClipboardAction('cutContents', { name, value, state })}
        {...(clipboard.copyToSystemClipboard && { copyToClipboard: valueJson })}
      >
        Cut Contents
      </MenuItem>
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem
          onClick={() => doClipboardAction('copyNode', { name, value, state })}
          {...(clipboard.copyToSystemClipboard && {
            copyToClipboard: valueJson,
          })}
        >
          Copy Node
        </MenuItem>
      )}
      <MenuItem
        onClick={() =>
          doClipboardAction('copyContents', { name, value, state })
        }
        {...(clipboard.copyToSystemClipboard && { copyToClipboard: valueJson })}
      >
        Copy Contents
      </MenuItem>
      {!showAll && hasPasteData && ['object', 'array'].includes(nodeType) && (
        <MenuItem
          onClick={() => doClipboardAction('paste', { position: 'append' })}
        >
          Paste at End
        </MenuItem>
      )}
      {!showAll && hasPasteData && ['object', 'array'].includes(nodeType) && (
        <MenuItem
          onClick={() => doClipboardAction('paste', { position: 'prepend' })}
        >
          Paste at Start
        </MenuItem>
      )}
      {!showAll && hasPasteData && ['object', 'array'].includes(parentType) && (
        <MenuItem
          onClick={() => doClipboardAction('paste', { position: 'above' })}
        >
          Paste Before
        </MenuItem>
      )}
      {!showAll && hasPasteData && ['object', 'array'].includes(parentType) && (
        <MenuItem
          onClick={() => doClipboardAction('paste', { position: 'below' })}
        >
          Paste After
        </MenuItem>
      )}
      {(['array', 'object'].includes(nodeType) || value === null) && (
        <Separator />
      )}
      {(nodeType === 'array' || value === null) && (
        <MenuItem
          onClick={() => onMessage({ path, action: 'convert', type: 'object' })}
        >
          {nodeType === 'array' ? 'Convert to' : 'Create'} Object
        </MenuItem>
      )}
      {(nodeType === 'object' || value === null) && (
        <MenuItem
          onClick={() => onMessage({ path, action: 'convert', type: 'array' })}
        >
          {nodeType === 'object' ? 'Convert to' : 'Create'} Array
        </MenuItem>
      )}
    </Menu>
  )
}

EditMenu.propTypes = {
  context: PropTypes.object.isRequired,
}

export default EditMenu
