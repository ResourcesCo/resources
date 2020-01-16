import { useState, useRef } from 'react'
import LinkMenu from './LinkMenu'
import { Manager, Reference, Popper } from 'react-popper'

export default ({url, onPickId, theme}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const openMenu = e => {
    setMenuOpen(true)
    e.preventDefault()
    return false
  }
  return <span>
    <Manager>
      <Reference>
        {({ref}) => (
          <a ref={ref} href={url} onClick={openMenu}>{url}</a>
        )}
      </Reference>
      {(menuOpen &&
        <Popper placement="bottom">
          {({ref, style, placement}) => (
            <div ref={ref} style={style} data-placement={placement}>
              <LinkMenu
                onPickId={onPickId}
                url={url}
                onClose={() => setMenuOpen(false)}
                theme={theme}
              />
            </div>
          )}
        </Popper>
      )}
    </Manager>
  </span>
}
