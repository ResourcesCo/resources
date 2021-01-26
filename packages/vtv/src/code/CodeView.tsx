import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import {EditorView, keymap, highlightSpecialChars, drawSelection, highlightActiveLine} from "@codemirror/view"
import {EditorState, Prec} from "@codemirror/state"
import {history, historyKeymap} from "@codemirror/history"
import {foldGutter, foldKeymap} from "@codemirror/fold"
import {indentOnInput, LanguageSupport} from "@codemirror/language"
import {lineNumbers} from "@codemirror/gutter"
import {defaultKeymap} from "@codemirror/commands"
import {bracketMatching} from "@codemirror/matchbrackets"
import {closeBrackets, closeBracketsKeymap} from "@codemirror/closebrackets"
import {searchKeymap, highlightSelectionMatches} from "@codemirror/search"
import {autocompletion, completionKeymap} from "@codemirror/autocomplete"
import {commentKeymap} from "@codemirror/comment"
import {rectangularSelection} from "@codemirror/rectangular-selection"
import {lintKeymap} from "@codemirror/lint"
import {jsxLanguage} from "@codemirror/lang-javascript"
import {oneDarkHighlightStyle} from "@codemirror/theme-one-dark"
import ActionButton from '../generic/ActionButton'
import darkTheme from './themes/ui/dark'
import lightTheme from './themes/ui/light'
import {defaultHighlightStyle} from "@codemirror/highlight"
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
  context: { onMessage, theme },
  context,
}) {
  const [editor, setEditor] = useState(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(false)
  const container = useRef(null)

  const initialValue =
    editMode === 'json' ? JSON.stringify(value, null, 2) : value

  const mode = getMode({ editMode, mediaType })

  useEffect(() => {
    if (container.current) {
      if (!editor) {
        const themeExtensions = theme.dark ? [darkTheme,
          oneDarkHighlightStyle] : [lightTheme, defaultHighlightStyle]
        const newEditor = new EditorView({
          state: EditorState.create({
            doc: initialValue,
            extensions: [
              lineNumbers(),
              highlightSpecialChars(),
              history(),
              foldGutter(),
              drawSelection(),
              EditorState.allowMultipleSelections.of(true),
              indentOnInput(),
              bracketMatching(),
              closeBrackets(),
              autocompletion(),
              rectangularSelection(),
              highlightActiveLine(),
              highlightSelectionMatches(),
              keymap.of([
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...commentKeymap,
                ...completionKeymap,
                ...lintKeymap
              ]),
              new LanguageSupport(jsxLanguage),
              EditorView.updateListener.of(_update => {
                if (_update.docChanged) {
                  setEditing(true)
                }
              }),
              themeExtensions,
            ]
          }),
          parent: container.current
        })
        setEditor(newEditor)
      }
    }
  }, [container, editor, theme.dark, initialValue])

  const save = () => {
    const newValue = editor.state.doc.toString()
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
        <div className="vtv--code-view--textarea-wrapper" ref={container}>
          
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
