import React from 'react'
import PropTypes from 'prop-types'
import Menu, { MenuItem, Separator } from '../generic/Menu'

import { getStateKey } from 'vtv-model'

function EditMenu({
  name,
  value,
  path,
  state,
  nodeType,
  parentType,
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
    {
      name = undefined,
      value = undefined,
      state = undefined,
      position = undefined,
    }
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
      context={context}
      {...props}
    >
      {path.length > 0 && ['object', 'array'].includes(parentType) && (
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
      {path.length > 0 && ['object', 'array'].includes(parentType) && (
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
      {hasPasteData && ['object', 'array'].includes(nodeType) && (
        <MenuItem
          onClick={() => doClipboardAction('paste', { position: 'append' })}
        >
          Paste at End
        </MenuItem>
      )}
      {hasPasteData && ['object', 'array'].includes(nodeType) && (
        <MenuItem
          onClick={() => doClipboardAction('paste', { position: 'prepend' })}
        >
          Paste at Start
        </MenuItem>
      )}
      {path.length > 0 &&
        hasPasteData &&
        ['object', 'array'].includes(parentType) && (
          <MenuItem
            onClick={() => doClipboardAction('paste', { position: 'above' })}
          >
            Paste Before
          </MenuItem>
        )}
      {path.length > 0 &&
        hasPasteData &&
        ['object', 'array'].includes(parentType) && (
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
