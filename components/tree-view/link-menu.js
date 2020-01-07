import { useRef } from 'react'
import { getState } from './state'
import { hasChildren } from './analyze'
import useClickOutside from './use-click-outside'
import Menu, { MenuItem } from './menu'

export default ({ onPickId, url, theme, onClose }) => {
  const pickId = () => {
    onPickId(`request get ${url}`)
  }

  const openUrl = () => {
    window.open(url, '_blank')
  }



  return <Menu theme={theme} onClose={onClose}>
    <MenuItem onClick={pickId}>Paste into console</MenuItem>
    <MenuItem onClick={openUrl}>Browse URL</MenuItem>
  </Menu>
}
