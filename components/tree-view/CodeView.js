import { useState } from 'react'
import Textarea from '../util/Textarea'

export default ({value, commandId, path, onMessage, theme}) => {
  const [newValue, setNewValue] = useState(JSON.stringify(value, null, 2))
  const [error, setError] = useState(value)

  const save = () => {
    onMessage({
      type: 'tree-update',
      path,
      action: 'editJson',
      value: newValue,
      treeCommandId: commandId,
    })
  }

  const cancel = () => {
    onMessage({
      type: 'tree-update',
      path,
      action: 'editJson',
      editing: false,
      treeCommandId: commandId,
    })
  }

  const handleKeyPress = e => {

  }

  return <div className="outer">
    <div>
      <Textarea
        value={newValue}
        onChange={({target: {value}}) => setNewValue(value)}
        onKeyDown={handleKeyPress}
        onBlur={save}
        autoFocus
      />
    </div>
    <div>
      <button onClick={save}></button>
      <button onClick={cancel}></button>
    </div>
    <style jsx>{`
      div :global(textarea) {
        background: none;
        border: 1px solid ${theme.bubble1};
        padding: 3px;
        resize: none;
        outline: none;
        width: 95%;
      }
      div.outer {
        outline: none;
        padding-left: 30px;
        border: 0;
      }
    `}</style>
  </div>
}
