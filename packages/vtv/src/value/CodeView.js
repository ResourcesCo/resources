import { useState, useRef, useEffect } from 'react'
import Textarea from '../generic/Textarea'
import ActionButton from '../generic/ActionButton'

export default ({ value, path, onMessage, theme }) => {
  const [newValue, setNewValue] = useState(JSON.stringify(value, null, 2))
  const [hadError, setHadError] = useState(false)
  const [error, setError] = useState(false)

  const save = () => {
    if (validate(newValue)) {
      onMessage({
        path,
        action: 'editJson',
        editing: false,
        value: JSON.parse(newValue),
      })
    }
  }

  const cancel = () => {
    onMessage({
      path,
      action: 'editJson',
      editing: false,
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
        {value !== newValue ? (
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
          width: 100%;
          padding: 3px;
        }
        div.textareaWrapper {
          border: 1px solid ${theme.bubble1};
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
