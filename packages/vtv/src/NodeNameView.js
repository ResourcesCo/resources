import { useState } from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import Textarea from './Textarea'
import StringView from './StringView'
import TreeMenu from './TreeMenu'

// Node Name Key

const NameEdit = React.forwardRef(({ name, path, onMessage, theme }, ref) => {
  const [newName, setNewName] = useState(name)

  const sendAction = (data = {}) => {
    onMessage({
      path,
      action: 'editName',
      editing: false,
      ...data,
    })
  }

  const save = () => {
    let value
    try {
      value = JSON.parse(newName)
    } catch (e) {
      value = newName
    }
    sendAction({
      value,
    })
  }

  const cancel = () => {
    sendAction()
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault()
      save()
    } else if (e.key === 'Esc' || e.key === 'Escape') {
      e.preventDefault()
      cancel()
    }
  }

  return (
    <div>
      <Textarea
        value={newName}
        onChange={({ target: { value } }) => setNewName(value)}
        onKeyDown={handleKeyPress}
        onBlur={save}
        autoFocus
      />
      <style jsx>{`
        div :global(textarea) {
          background: none;
          border: none;
          resize: none;
          outline: none;
        }
        div {
          background-color: ${theme.bubble1};
          border-radius: 12px;
          outline: none;
          padding: 4px 7px;
          border: 0;
        }
      `}</style>
    </div>
  )
})

const NameButton = ({ displayName, name, onClick, theme }) => (
  <button className="id" onClick={onClick}>
    {typeof displayName !== 'undefined' ? (
      displayName
    ) : (
      <StringView value={name} maxLength={40} />
    )}
    <style jsx>{`
      button {
        cursor: pointer;
        background-color: ${theme.bubble1};
        border-radius: 9999px;
        outline: none;
        padding: 3px 7px;
        font-size: inherit;
        border: 0;
      }
    `}</style>
  </button>
)

export default ({
  name,
  displayName,
  editingName,
  theme,
  bubbleMenu,
  parentType,
  path,
  onMessage,
  treeMenuProps,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  if (editingName) {
    return (
      <NameEdit name={name} path={path} onMessage={onMessage} theme={theme} />
    )
  } else {
    if (bubbleMenu) {
      return (
        <Manager>
          <Reference>
            {({ ref }) => (
              <div ref={ref}>
                <NameButton
                  displayName={displayName}
                  name={name}
                  onClick={() => setMenuOpen(true)}
                  theme={theme}
                />
              </div>
            )}
          </Reference>
          {menuOpen && (
            <TreeMenu {...treeMenuProps} onClose={() => setMenuOpen(false)} />
          )}
        </Manager>
      )
    } else {
      const editName = () => {
        if (parentType !== 'array') {
          onMessage({
            path,
            action: 'editName',
            editing: true,
          })
        }
      }
      return (
        <div>
          <NameButton
            displayName={displayName}
            name={name}
            onClick={editName}
            theme={theme}
          />
        </div>
      )
    }
  }
}
