import React from 'react'
import Menu, { MenuItem } from '../generic/Menu'

export default function ClipboardMenu({
  name,
  value,
  path,
  state,
  nodeType,
  parentType,
  showAll,
  onMessage,
  theme,
  ...props
}) {
  const doClipboardAction = (action, position = null) => {
    if (action === 'cut') {
      onMessage({
        path,
        action: 'delete',
      })
    }
  }
  const hasPasteData = true
  const valueJson = JSON.stringify(
    parentType === 'object' ? { name: value } : value,
    null,
    2
  )

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
        copyToClipboard={valueJson}
      >
        Cut
      </MenuItem>
      <MenuItem
        onClick={() => doClipboardAction('copy')}
        copyToClipboard={valueJson}
      >
        Copy
      </MenuItem>
      {!showAll && hasPasteData && ['object', 'array'].includes(nodeType) && (
        <MenuItem onClick={() => doClipboardAction('paste', 'child')}>
          Paste Child
        </MenuItem>
      )}
      {!showAll && hasPasteData && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('paste', 'above')}>
          Paste Before
        </MenuItem>
      )}
      {!showAll && hasPasteData && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => sendAction('paste', 'below')}>
          Paste After
        </MenuItem>
      )}
    </Menu>
  )
}
