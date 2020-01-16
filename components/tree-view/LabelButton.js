import { useState } from 'react'
import Textarea from '../util/Textarea'

const NameEdit = React.forwardRef(({name, commandId, path, onMessage, theme}, ref) => {
  const [newName, setNewName] = useState(name)

  const sendAction = (data = {}) => {
    onMessage({
      type: 'tree-update',
      path,
      action: 'editName',
      editing: false,
      treeCommandId: commandId,
      ...data,
    })
  }

  const save = () => {
    sendAction({
      value: newName,
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

  return <div>
    <Textarea
      value={newName}
      onChange={({target: {value}}) => setNewName(value)}
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
})

export default React.forwardRef(({name, displayName, editingName, theme, onClick, ...props}, ref) => {
  return editingName ? <NameEdit
    ref={ref}
    name={name}
    theme={theme}
    {...props}
  /> : <div ref={ref}>
    <button className="id" onClick={onClick}>{typeof displayName !== 'undefined' ? displayName : name}</button>
    <style jsx>{`
      button {
        cursor: pointer;
        background-color: ${theme.bubble1};
        border-radius: 9999px;
        outline: none;
        padding: 4px 7px;
        border: 0;
      }
    `}</style>
  </div>
})
