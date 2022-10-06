import React, { useState, useRef } from 'react'
import { Manager, Reference } from 'react-popper'
import NodeMenu from '../tree/NodeMenu'
import NameButton from '../generic/NameButton'
import NameEdit from '../generic/NameEdit'
import StringView from '../generic/StringView'

// Node Name Key

export default function NodeNameView({
  name,
  displayName = undefined,
  editingName,
  context,
  path,
  nodeMenuProps,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [autoFocus, setAutoFocus] = useState(false)
  const buttonRef = useRef<HTMLElement>()

  if (editingName) {
    return (
      <NameEdit
        name={name}
        editingName={editingName}
        path={path}
        context={context}
      />
    )
  } else {
    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <div ref={ref}>
              <NameButton
                ref={buttonRef}
                context={context}
                onClick={() => false}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setAutoFocus(false)
                  setMenuOpen(true)
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                  if (e.code === 'Enter') {
                    e.preventDefault()
                    e.stopPropagation()
                    setAutoFocus(true)
                    setMenuOpen(true)
                  }
                }}
              >
                <StringView
                  value={displayName !== undefined ? displayName : name}
                  maxLength={60}
                />
              </NameButton>
            </div>
          )}
        </Reference>
        {menuOpen && (
          <NodeMenu
            {...nodeMenuProps}
            nameOptionsFirst={true}
            onClose={() => {
              setMenuOpen(false)
              if (buttonRef.current) {
                buttonRef.current.focus()
              }
            }}
            autoFocus={autoFocus}
          />
        )}
      </Manager>
    )
  }
}
