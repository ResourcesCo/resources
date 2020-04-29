import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import Textarea from '../generic/Textarea'
import ActionButton from '../generic/ActionButton'

export default function CodeView({ editMode, value, path, onMessage, theme }) {
  const [editing, setEditing] = useState(false)
  const [newValue, setNewValue] = useState(JSON.stringify(value, null, 2))
  const [error, setError] = useState(false)

  const save = () => {
    if (validate(newValue)) {
      setEditing(false)
      onMessage({
        path,
        action: 'editJson',
        value: JSON.parse(newValue),
      })
    }
  }

  const cancel = () => {
    setError(false)
    setEditing(false)
    setNewValue(JSON.stringify(value, null, 2))
  }

  const validate = value => {
    let valid = true
    try {
      JSON.parse(value)
    } catch (err) {
      valid = false
    }
    setError(!valid)
    return valid
  }

  const handleKeyDown = ({ target: { value } }) => {}

  const handleChange = ({ target: { value } }) => {
    setNewValue(value)
    setEditing(true)
    if (error) validate(value)
  }

  return (
    <div className="outer">
      <div className={error ? 'error' : ''}>
        <div className="textareaWrapper">
          <Textarea
            value={newValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            maxRows={20}
            autoFocus
          />
        </div>
        {error && <div className="error-message">Invalid JSON</div>}
      </div>
      <div className="actions">
        {editing && (
          <>
            <div className="actionButton">
              <ActionButton
                onClick={save}
                disabled={error}
                primary
                theme={theme}
              >
                Save
              </ActionButton>
            </div>
            <div className="actionButton">
              <ActionButton onClick={cancel} theme={theme}>
                Cancel
              </ActionButton>
            </div>
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
          color: ${theme.foreground};
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
        div.actionButton {
          display: inline-block;
          padding-right: 5px;
        }
      `}</style>
    </div>
  )
}

CodeView.propTypes = {
  editMode: PropTypes.oneOf(['string', 'json']).isRequired,
  value: PropTypes.any.isRequired,
  state: PropTypes.object.isRequired,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
  onMessage: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
}
