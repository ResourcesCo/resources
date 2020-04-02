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
    parentType === 'object' ? { name: value } : value,
    null,
    2
  )
  const doClipboardAction = (action, position = null) => {
    if (['cut', 'copy'].includes(action)) {
      // copy to internal clipboard
      clipboard.data = valueJson
      if (action === 'cut') {
        onMessage({
          path,
          action: 'delete',
        })
      }
    } else if (action === 'paste') {
      if (typeof clipboard.data === 'string') {
        const value = JSON.parse(clipboard.data)
        onMessage({
          path,
          action: 'paste',
          value,
          position,
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
        onClick={() => doClipboardAction('cut')}
        {...(clipboard.copyToSystemClipboard && { copyToClipboard: valueJson })}
      >
        Cut
      </MenuItem>
      <MenuItem
        onClick={() => doClipboardAction('copy')}
        {...(clipboard.copyToSystemClipboard && { copyToClipboard: valueJson })}
      >
        Copy
      </MenuItem>
      {!showAll && hasPasteData && ['object', 'array'].includes(nodeType) && (
        <MenuItem onClick={() => doClipboardAction('paste', 'append')}>
          Paste Into (Append)
        </MenuItem>
      )}
      {!showAll && hasPasteData && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => doClipboardAction('paste', 'above')}>
          Paste Before
        </MenuItem>
      )}
      {!showAll && hasPasteData && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => doClipboardAction('paste', 'below')}>
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
