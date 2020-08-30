import { useState } from 'react'
import { Manager, Reference } from 'react-popper'
import NodeMenu from '../tree/NodeMenu'
import NameButton from '../generic/NameButton'
import NameEdit from '../generic/NameEdit'
import StringView from '../generic/StringView'

// Node Name Key

export default function NodeNameView({
  name,
  displayName,
  editingName,
  context,
  path,
  onMessage,
  nodeMenuProps,
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const rename = () => {
    onMessage({ path, action: 'rename', editing: true })
  }

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
                  value={
                    typeof displayName !== 'undefined' ? displayName : name
                  }
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
