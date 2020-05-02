import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import ActionButton from '../generic/ActionButton'

export default function CodeView({
  editMode,
  value,
  path,
  onMessage,
  codeMirrorComponent,
  theme,
}) {
  const [editor, setEditor] = useState(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(false)

  const CodeMirror = codeMirrorComponent

  const save = () => {
    if (editor !== null) {
      const newValue = editor.getValue()
      console.log(newValue)
      if (validate(newValue)) {
        setEditing(false)
        onMessage({
          path,
          action: 'editJson',
          value: JSON.parse(newValue),
        })
      }
    }
  }

  const cancel = () => {
    onMessage({ path, action: 'setView', view: null })
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

  return (
    <div className="outer">
      <div className={error ? 'error' : ''}>
        <div className="textareaWrapper">
          <CodeMirror
            value={JSON.stringify(value, null, 2)}
            onChange={() => setEditing(true)}
            maxRows={20}
            autoFocus
            editorDidMount={editor => setEditor(editor)}
            editorWillUnmount={() => setEditor(null)}
            options={{
              mode: {
                name: 'javascript',
                json: true,
              },
              theme: theme.codeTheme,
            }}
          />
        </div>
        {error && <div className="error-message">Invalid JSON</div>}
      </div>
      <div className="actions">
        {editing && (
          <>
            <div className="actionButton">
              <ActionButton onClick={save} primary theme={theme}>
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
        div :global(.CodeMirror) {
          font-size: 16px;
        }
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
