import React from 'react'
import PropTypes from 'prop-types'
import Menu, { MenuItem } from '../generic/Menu'

function ClipboardMenu({
  name,
  value,
  path,
  state,
  nodeType,
  parentType,
  showAll,
  onMessage,
  clipboard,
  theme,
  ...props
}) {
  const hasPasteData = true
  const valueJson = JSON.stringify(
    parentType === 'object' ? { [name]: value } : value,
    null,
    2
  )
  const doClipboardAction = (clipboardAction, { data, position }) => {
    if (['cut', 'copy'].includes(clipboardAction)) {
      // copy to internal clipboard
      clipboard.data = data
      if (clipboardAction === 'cut') {
        onMessage({
          path,
          action: 'delete',
        })
      }
    } else if (clipboardAction === 'paste') {
      if (typeof clipboard.data === 'string') {
        const value = JSON.parse(clipboard.data)
        onMessage({
          path,
          action: 'insert',
          value,
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
        modifiers: { offset: { offset: '0, -3' } },
      }}
      theme={theme}
      {...props}
    >
      <MenuItem
        onClick={() => doClipboardAction('cut', { data: valueJson })}
        {...(clipboard.copyToSystemClipboard && { copyToClipboard: valueJson })}
      >
        Cut
      </MenuItem>
      <MenuItem
        onClick={() => doClipboardAction('copy', { data: valueJson })}
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
  clipboard: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default ClipboardMenu
