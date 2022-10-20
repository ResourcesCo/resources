import React, { useState, useRef, useEffect } from 'react'
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
  state,
  nodeMenuProps,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [autoFocus, setAutoFocus] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>()
  const { onMessage } = context
  const prevEditingName = useRef()
  const prevEditing = useRef()
  const { editing } = state
  useEffect(() => {
    if (prevEditingName.current === true && !editingName && buttonRef.current instanceof HTMLElement) {
      buttonRef.current.focus()
    }
    prevEditingName.current = editingName
    prevEditing.current = editing
  }, [editingName, prevEditingName])

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
                  if (e.code === 'Enter' || e.code === 'Space' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                    e.preventDefault()
                    e.stopPropagation()
                    if (e.code === 'Enter') {
                      setAutoFocus(true)
                      setMenuOpen(true)
                    } else if (e.code === 'Space') {
                      onMessage({ path, state: { _expanded: !state.expanded } })
                    } else if (e.code === 'ArrowLeft') {
                      if (state.expanded) {
                        onMessage({ path, state: { _expanded: false } })
                      }
                    } else if (e.code === 'ArrowRight') {
                      if (!state.expanded) {
                        onMessage({ path, state: { _expanded: true } })
                      }
                    }
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
