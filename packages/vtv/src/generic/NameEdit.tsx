import React, { useState, useRef, useEffect } from 'react'
import setCaretAtEnd from '../util/setCaretAtEnd'
import escapeHtml from '../util/escapeHtml'
import { Path, Context } from 'vtv'
import { NODE_CLASS, ROOT_CLASS } from '../util/constants'

interface NameEditProps {
  name: string
  editingName: boolean | 'new'
  path: Path
  context: Context
}

export default React.forwardRef<HTMLBaseElement, NameEditProps>(
  function NameEdit(
    { name, editingName, path, context: { onMessage } },
    ref
  ) {
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
      <div className="vtv--name-edit">
        &#x200b;
        <span
          className="vtv--name-edit--span"
          contentEditable
          ref={editableRef}
          onKeyDown={handleKeyPress}
          onBlur={save}
          dangerouslySetInnerHTML={{
            __html: escapeHtml(editingName === 'new' ? '' : name),
          }}
        ></span>
      </div>
    )
  }
)
