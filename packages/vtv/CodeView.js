import { useState, useRef, useEffect } from 'react'
import Textarea from '../util/Textarea'
import ActionButton from './ActionButton'

export default ({ value, commandId, path, onMessage, theme }) => {
  const [newValue, setNewValue] = useState(JSON.stringify(value, null, 2))
  const [changed, setChanged] = useState(false)
  const [hadError, setHadError] = useState(false)
  const [error, setError] = useState(false)

  const save = () => {
    if (validate(newValue)) {
      onMessage({
        type: 'tree-update',
        path,
        action: 'editJson',
        editing: false,
        value: JSON.parse(newValue),
        treeCommandId: commandId,
      })
    }
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

  const validate = value => {
    let valid = true
    try {
      JSON.parse(value)
    } catch (err) {
      valid = false
    }
    setError(!valid)
    if (!valid && !hadError) setHadError(true)
    return valid
  }

  const handleKeyDown = ({ target: { value } }) => {}

  const handleChange = ({ target: { value } }) => {
    setNewValue(value)
    setChanged(true)
    if (hadError) validate(value)
  }

  return (
    <div className="outer">
      <div className={error ? 'error' : ''}>
        <div className="textareaWrapper">
          <Textarea
            value={newValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => validate(newValue)}
            maxRows={20}
            autoFocus
          />
        </div>
        {error && <div className="error-message">Invalid JSON</div>}
      </div>
      <div className="actions">
        {changed ? (
          <>
            <ActionButton onClick={save} disabled={error} primary theme={theme}>
              Save
            </ActionButton>
            <ActionButton onClick={cancel} theme={theme}>
              Cancel
            </ActionButton>
          </>
        ) : (
          <>
            <ActionButton onClick={cancel} theme={theme}>
              Close
            </ActionButton>
          </>
        )}
      </div>
      <style jsx>{`
        div :global(textarea) {
          background: none;
          margin: 0;
          resize: none;
          outline: none;
          border: none;
          width: 95%;
        }
        div.textareaWrapper {
          border: 1px solid ${theme.bubble1};
          padding: 3px;
        }
        div.error div.textareaWrapper {
          border: 1px solid ${theme.errorColor};
        }
        div.error-message {
          color: ${theme.errorColor};
          margin-bottom: 3px;
          font-size: 0.8em;
        }
        div.outer {
          outline: none;
          padding-left: 30px;
          border: 0;
        }
        div.actions {
          padding-top: 3px;
        }
      `}</style>
    </div>
  )
}
