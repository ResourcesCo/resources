import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import NodeMenu from './NodeMenu'
import { Manager, Reference } from 'react-popper'

export default function NodeMenuButton({ nodeMenuProps: nodeMenuProps_ }) {
  const nodeMenuProps = {
    ...nodeMenuProps_,
    popperProps: {
      placement: 'bottom-end',
      modifiers: [{ name: 'offset', options: { offset: [0, 3] } }],
    },
  }
  const {
    context: { theme },
  } = nodeMenuProps
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div>
            <button className="vtv--node-menu-button--button" ref={ref} onClick={() => setMenuOpen(true)} tabIndex={-1}>
              <FontAwesomeIcon icon={faEllipsisH} size="sm" />
            </button>
          </div>
        )}
      </Reference>
      {menuOpen && (
        <NodeMenu {...nodeMenuProps} onClose={() => setMenuOpen(false)} />
      )}
    </Manager>
  )
}
