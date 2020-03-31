import React from 'react'
import Menu, { MenuItem } from '../generic/Menu'

export default function NodeMenu({ name, value, path, state, parentType }) {
  const doClipboardAction = (action, position = null) => {}
  const hasPasteData = true

  return (
    <Menu>
      <MenuItem onClick={() => doClipboardAction('cut')}>Cut</MenuItem>
      <MenuItem onClick={() => doClipboardAction('copy')}>Copy</MenuItem>
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
