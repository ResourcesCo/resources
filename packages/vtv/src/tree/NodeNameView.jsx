import React, { useState, useRef, useEffect } from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import Textarea from '../generic/Textarea'
import StringView from '../content/StringView'
import NodeMenu from '../tree/NodeMenu'
import setCaretAtEnd from '../util/setCaretAtEnd'
import escapeHtml from '../util/escapeHtml'

// Node Name Key

const NameEdit = React.forwardRef(
  ({ name, editingName, path, onMessage, theme }, ref) => {
    const [newName, setNewName] = useState(editingName === 'new' ? '' : name)

    const sendAction = (data = {}) => {
      onMessage({
        path,
        action: 'rename',
        editing: false,
        ...data,
      })
    }

    const save = (data = {}) => {
      let value
      try {
        value = JSON.parse(newName)
      } catch (e) {
        value = newName
      }
      sendAction({
        value,
        ...data,
      })
    }

    const cancel = () => {
      sendAction()
    }

    const handleKeyPress = e => {
      if ((e.key === 'Enter' && e.shiftKey === false) || e.key === 'Tab') {
        e.preventDefault()
        save({ tab: e.key === 'Tab', enter: e.key === 'Enter' })
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
          tabIndex="-1"
        />
        <style jsx>{`
          div :global(textarea) {
            background: none;
            border: none;
            resize: none;
            outline: none;
            color: ${theme.foreground};
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
  }
)

const NameEditInPlace = React.forwardRef(
  ({ name, editingName, path, onMessage, theme }, ref) => {
    const editableRef = useRef(null)
    const [newName, setNewName] = useState(editingName === 'new' ? '' : name)

    useEffect(() => {
      if (editableRef.current) {
        editableRef.current.focus()
        setCaretAtEnd(editableRef.current)
      }
    }, [editableRef])

    const sendAction = (data = {}) => {
      onMessage({
        path,
        action: 'rename',
        editing: false,
        ...data,
      })
    }

    const save = (data = {}) => {
      let value
      const text = editableRef.current.innerText
      setNewName(text)
      try {
        value = JSON.parse(text)
      } catch (e) {
        value = text
      }
      sendAction({
        value,
        ...data,
      })
    }

    const cancel = () => {
      sendAction()
    }

    const handleKeyPress = e => {
      if ((e.key === 'Enter' && e.shiftKey === false) || e.key === 'Tab') {
        e.preventDefault()
        save({ tab: e.key === 'Tab', enter: e.key === 'Enter' })
      } else if (e.key === 'Esc' || e.key === 'Escape') {
        e.preventDefault()
        cancel()
      }
      setNewName(editableRef.current.innerText)
    }

    return (
      <div>
        &#x200b;
        <span
          contentEditable
          ref={editableRef}
          onKeyDown={handleKeyPress}
          onBlur={save}
          dangerouslySetInnerHTML={{
            __html: escapeHtml(editingName === 'new' ? '' : name),
          }}
        ></span>
        <style jsx>{`
          div {
            background-color: ${theme.bubble1};
            border-radius: 12px;
            outline: none;
            padding: 3px 7px;
            border: 0;
            outline: none;
            margin: 0 0;
          }
          span {
            outline: none;
            margin: 0 0;
          }
        `}</style>
      </div>
    )
  }
)

const NameButton = ({ displayName, name, onClick, theme }) => {
  return (
    <button className="id" onClick={onClick} tabIndex="-1">
      {typeof displayName !== 'undefined' ? (
        displayName
      ) : (
        <StringView value={name} maxLength={40} />
      )}
      <style jsx>{`
        button {
          cursor: pointer;
          background-color: ${theme.bubble1};
          color: ${theme.foreground};
          font-family: ${theme.fontFamily};
          border-radius: 9999px;
          outline: none;
          padding: 3px 7px;
          font-size: inherit;
          border: 0;
        }
      `}</style>
    </button>
  )
}

export default ({
  name,
  displayName,
  editingName,
  theme,
  options: { bubbleMenu, dotMenu },
  parentType,
  path,
  onMessage,
  nodeMenuProps,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const rename = () => {
    onMessage({ path, action: 'rename', editing: true })
  }

  if (editingName) {
    return (
      <NameEditInPlace
        name={name}
        editingName={editingName}
        path={path}
        onMessage={onMessage}
        theme={theme}
      />
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
                  onDoubleClick={rename}
                  theme={theme}
                />
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
    } else {
      const rename = () => {
        if (parentType === 'array') {
          onMessage({
            path,
            action: 'rename',
            editing: true,
          })
        }
      }
      return (
        <div>
          <NameButton
            displayName={displayName}
            name={name}
            onClick={rename}
            theme={theme}
          />
        </div>
      )
    }
  }
}
