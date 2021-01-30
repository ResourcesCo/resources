import React, { useState, useRef, FunctionComponent } from 'react'
import { EditorView } from '@codemirror/view'
import CodeEditor from './CodeEditor'
import ActionButton from '../generic/ActionButton'
import { Context } from '../'
import { codeTypes } from 'vtv-model'

function getMode({ editMode, mediaType }) {
  if (editMode === 'json') {
    return {
      editorMode: 'json',
    }
  } else if (mediaType) {
    const codeType = codeTypes.find(
      ({ mediaType: itemMediaType }) => itemMediaType === mediaType
    )
    if (codeType) {
      return typeof codeType.indentUnit === 'number'
        ? { editorMode: codeType.editorMode, indentUnit: codeType.indentUnit }
        : { editorMode: codeType.editorMode }
    } else {
      return { editorMode: null }
    }
  }
  return { editorMode: null }
}

interface CodeViewProps {
  editMode: 'text' | 'json',
  value: Record<string, unknown>,
  state: Record<string, unknown>,
  path: string[],
  mediaType?: string,
  context: Context,
}

const CodeView: FunctionComponent<CodeViewProps> = ({
  editMode,
  value,
  path,
  mediaType,
  context: { onMessage, theme },
  context,
}) => {
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(false)
  const editorViewRef = useRef<EditorView>()

  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged && !((update.transactions || [])[0] || {}).reconfigure) {
      setEditing(true)
    }
  })

  const initialValue =
    editMode === 'json' ? JSON.stringify(value, null, 2) : (typeof value === 'string' ? value : '')

  const mode = getMode({ editMode, mediaType })
  const languageName = mode.editorMode
  const codeThemeName = theme.dark ? 'dark' : 'light'

  const save = () => {
    if (!editorViewRef.current) return;
    
    const newValue = editorViewRef.current.state.doc.toString()
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

  return (
    <div className="vtv--code-view">
      <div className={error ? 'vtv--code-view--error' : ''}>
        <CodeEditor
          initialValue={initialValue}
          editorViewRef={editorViewRef}
          language={languageName}
          theme={codeThemeName}
          className="vtv--code-view--textarea-wrapper"
          additionalExtensions={[updateListener]}
        />
        {error && (
          <div className="vtv--code-view--error-message">Invalid JSON</div>
        )}
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

export default CodeView