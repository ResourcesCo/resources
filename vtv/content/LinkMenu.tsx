import React from 'react'
import Menu, { MenuItem } from '../generic/Menu'

export default ({ onEdit, url, onClose, context: { onPickId }, context }) => {
  const pickId = () => {
    onPickId(`request get ${url}`)
  }

  const openUrl = () => {
    window.open(url, '_blank')
  }

  return (
    <Menu onClose={onClose} context={context}>
      <MenuItem onClick={onEdit}>Edit</MenuItem>
      {typeof onPickId === 'function' && (
        <MenuItem onClick={pickId}>Paste into console</MenuItem>
      )}
      <MenuItem onClick={openUrl}>Browse URL</MenuItem>
    </Menu>
  )
}
