import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import ActionButton from '../generic/ActionButton'
import { codeTypes } from 'vtv-model'

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

  const validate = (value) => {
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
    <div className="vtv--code-view">
      <div className={error ? 'vtv--code-view--error' : ''}>
        <div className="vtv--code-view--textarea-wrapper">
          <CodeMirror
            value={initialValue}
            onChange={() => setEditing(true)}
            editorDidMount={(editor) => setEditor(editor)}
            editorWillUnmount={() => setEditor(null)}
            options={{
              theme: theme.codeTheme,
              lineWrapping: true,
              lineNumbers: true,
              ...mode,
            }}
          />
        </div>
        {error && <div className="vtv--code-view--error-message">Invalid JSON</div>}
      </div>
      <div className="vtv--code-view--actions">
        {editing && (
          <>
            <div className="vtv--code-view--action-button">
              <ActionButton onClick={save} primary context={context}>
                Save
              </ActionButton>
            </div>
            <div className="vtv--code-view--action-button">
              <ActionButton onClick={cancel} context={context}>
                Cancel
              </ActionButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

CodeView.propTypes = {
  editMode: PropTypes.oneOf(['text', 'json']).isRequired,
  value: PropTypes.any.isRequired,
  state: PropTypes.object.isRequired,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
  mediaType: PropTypes.string,
  context: PropTypes.object.isRequired,
}
