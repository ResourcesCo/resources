import { useState } from 'react'
import LinkMenu from './link-menu'

export default ({url, onPickId, theme}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const openMenu = e => {
    setMenuOpen(true)
    e.preventDefault()
    return false
  }
  return <span>
    {
      (
        menuOpen &&
        <LinkMenu
          onPickId={onPickId}
          url={url}
          onClose={() => setMenuOpen(false)}
          theme={theme}
        />
      )
    }
    <a href={url} onClick={openMenu}>{url}</a>
  </span>
}
