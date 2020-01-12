import { useState } from 'react'
import Textarea from '../util/Textarea'

const NameEdit = ({name, commandId, path, onMessage, theme}) => {
  const [newName, setNewName] = useState(name)

  const save = () => {
    onMessage({
      type: 'tree-update',
      path,
      action: 'editName',
      value: newName,
      treeCommandId: commandId,
    })
  }

  const cancel = () => {
    onMessage({
      type: 'tree-update',
      path,
      action: 'editName',
      editing: false,
      treeCommandId: commandId,
    })
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
      :global(textarea) {
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
}

export default ({name, displayName, editingName, theme, onClick, ...props}) => {
  return editingName ? <NameEdit
    name={name}
    theme={theme}
    {...props}
  /> : <div>
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
}
