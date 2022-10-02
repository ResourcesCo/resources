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

function focusNewNode(target) {
  const node = target.closest(`.${NODE_CLASS}`)
  if (node instanceof HTMLElement) {
    const root = node.parentElement.closest(`.${ROOT_CLASS}`)
    if (root instanceof HTMLElement) {
      const nodeIndex = [...root.querySelectorAll(`.${NODE_CLASS}`)].findIndex(n => n === node)
      let i = 0;
      const interval = setInterval(() => {
        const newNode = [...root.querySelectorAll(`.${NODE_CLASS}`)][nodeIndex]
        if (newNode instanceof HTMLElement) {
          newNode.focus()
          clearInterval(interval)
        }
        i++
        if (i > 20) {
          clearInterval(interval)
        }
      }, 5)
    }
  }
}

export default React.forwardRef<HTMLBaseElement, NameEditProps>(
  function NameEdit(
    { name, editingName, path, context: { onMessage, theme } },
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
        focusNewNode(e.target)
      } else if (e.key === 'Esc' || e.key === 'Escape') {
        e.preventDefault()
        cancel()
        focusNewNode(e.target)
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
