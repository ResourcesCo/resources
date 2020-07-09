import React from 'react'
import PropTypes from 'prop-types'
import Menu, { MenuItem } from '../generic/Menu'

import { getStateKey } from '../../vtv-model/util'

function ClipboardMenu({
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
  const valueJson = JSON.stringify(
    parentType === 'object' ? { [name]: value } : value,
    null,
    2
  )

  const doClipboardAction = (
    clipboardAction,
    { name, value, state, position }
  ) => {
    if (['cut', 'copy'].includes(clipboardAction)) {
      const valueJson = JSON.stringify(
        parentType === 'object' ? { [name]: value } : value,
        null,
        2
      )
      const stateJson = JSON.stringify(
        parentType === 'object' ? { [getStateKey(name)]: state } : state,
        null,
        2
      )

      // copy to internal clipboard
      clipboard.value = valueJson
      clipboard.state = stateJson
      if (clipboardAction === 'cut') {
        onMessage({
          path,
          action: 'deleteNode',
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
      <MenuItem
        onClick={() => doClipboardAction('cut', { name, value, state })}
        {...(clipboard.copyToSystemClipboard && { copyToClipboard: valueJson })}
      >
        Cut
      </MenuItem>
      <MenuItem
        onClick={() => doClipboardAction('copy', { name, value, state })}
        {...(clipboard.copyToSystemClipboard && { copyToClipboard: valueJson })}
      >
        Copy
      </MenuItem>
      {!showAll && hasPasteData && ['object', 'array'].includes(nodeType) && (
        <MenuItem
          onClick={() => doClipboardAction('paste', { position: 'append' })}
        >
          Paste Child
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
    </Menu>
  )
}

ClipboardMenu.propTypes = {
  context: PropTypes.object.isRequired,
}

export default ClipboardMenu
