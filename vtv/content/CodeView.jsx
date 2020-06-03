import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import ActionButton from '../generic/ActionButton'
import { codeTypes } from '../model/constants'

function getMode({ editMode, mediaType }) {
  if (editMode === 'json') {
    return {
      mode: {
        name: 'javascript',
        json: true,
      },
    }
  } else if (mediaType) {
    const codeType = codeTypes.find(
      ({ mediaType: itemMediaType }) => itemMediaType === mediaType
    )
    if (codeType) {
      return typeof codeType.indentUnit === 'number'
        ? { mode: codeType.editorMode, indentUnit: codeType.indentUnit }
        : { mode: codeType.editorMode }
    } else {
      return { mode: null }
    }
  }
  return { mode: null }
}

export default function CodeView({
  editMode,
  value,
  path,
  mediaType,
  context: { onMessage, codeMirrorComponent, theme },
  context,
}) {
  const [editor, setEditor] = useState(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(false)

  const CodeMirror = codeMirrorComponent

  const save = () => {
    if (editor !== null) {
      const newValue = editor.getValue()
      if (validate(newValue)) {
        setEditing(false)
        if (editMode === 'json') {
          onMessage({
            path,
            action: 'editJson',
            value: JSON.parse(newValue),
          })
        } else {
          onMessage({
            path,
            action: 'edit',
            value: newValue,
          })
        }
      }
    }
  }

  const cancel = () => {
    onMessage({ path, state: { _expanded: false } })
  }

  const validate = value => {
    if (editMode === 'json') {
      let valid = true
      try {
        JSON.parse(value)
      } catch (err) {
        valid = false
      }
      setError(!valid)
      return valid
    } else {
      return true
    }
  }

  const initialValue =
    editMode === 'json' ? JSON.stringify(value, null, 2) : value

  const mode = getMode({ editMode, mediaType })

  return (
    <div className="outer">
      <div className={error ? 'error' : ''}>
        <div className="textareaWrapper">
          <CodeMirror
            value={initialValue}
            onChange={() => setEditing(true)}
            editorDidMount={editor => setEditor(editor)}
            editorWillUnmount={() => setEditor(null)}
            options={{
              theme: theme.codeTheme,
              lineWrapping: true,
              lineNumbers: true,
              ...mode,
            }}
          />
        </div>
        {error && <div className="error-message">Invalid JSON</div>}
      </div>
      <div className="actions">
        {editing && (
          <>
            <div className="actionButton">
              <ActionButton onClick={save} primary context={context}>
                Save
              </ActionButton>
            </div>
            <div className="actionButton">
              <ActionButton onClick={cancel} context={context}>
                Cancel
              </ActionButton>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        div :global(.CodeMirror) {
          font-size: 16px;
          height: auto;
        }
        div :global(.CodeMirror-scroll) {
          max-height: 295px;
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
  editMode: PropTypes.oneOf(['text', 'json']).isRequired,
  value: PropTypes.any.isRequired,
  state: PropTypes.object.isRequired,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
  mediaType: PropTypes.string,
  onMessage: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
}
