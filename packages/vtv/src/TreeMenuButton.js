import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import TreeMenu from './TreeMenu'
import { Manager, Reference, Popper } from 'react-popper'

export default function TreeMenuButton({ treeMenuProps: treeMenuProps_ }) {
  const treeMenuProps = {
    ...treeMenuProps_,
    popperProps: {
      placement: 'bottom-end',
      modifiers: { offset: { offset: '0, 3' } },
    },
  }
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div>
            <button ref={ref} onClick={() => setMenuOpen(true)}>
              <FontAwesomeIcon icon={faEllipsisH} size="sm" />
            </button>
            <style jsx>{`
              button {
                outline: none;
                border: none;
                cursor: pointer;
                margin: 0;
                text-align: left;
                width: 22px;
                background: none;
              }
            `}</style>
          </div>
        )}
      </Reference>
      {menuOpen && (
        <TreeMenu {...treeMenuProps} onClose={() => setMenuOpen(false)} />
      )}
    </Manager>
  )
}
