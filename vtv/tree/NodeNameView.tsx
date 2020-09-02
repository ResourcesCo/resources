import { useState } from 'react'
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
              <NameButton onClick={() => setMenuOpen(true)} context={context}>
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
            onClose={() => setMenuOpen(false)}
          />
        )}
      </Manager>
    )
  }
}
