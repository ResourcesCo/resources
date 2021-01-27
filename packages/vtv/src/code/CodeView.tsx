import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
} from '@codemirror/view'
import { EditorState, tagExtension, Prec } from '@codemirror/state'
import { history, historyKeymap } from '@codemirror/history'
import { foldGutter, foldKeymap } from '@codemirror/fold'
import { indentOnInput, LanguageSupport } from '@codemirror/language'
import { lineNumbers } from '@codemirror/gutter'
import { defaultKeymap } from '@codemirror/commands'
import { bracketMatching } from '@codemirror/matchbrackets'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { commentKeymap } from '@codemirror/comment'
import { rectangularSelection } from '@codemirror/rectangular-selection'
import { lintKeymap } from '@codemirror/lint'
import { jsxLanguage } from '@codemirror/lang-javascript'
import { htmlLanguage } from '@codemirror/lang-html'
import ActionButton from '../generic/ActionButton'
import { defaultHighlightStyle } from '@codemirror/highlight'
import pickBy from 'lodash/pickBy'
import darkTheme from './themes/ui/dark'
import darkHighlightStyle from './themes/highlight/dark'
import lightTheme from './themes/ui/light'
import lightHighlightStyle from './themes/highlight/light'
import { codeTypes } from 'vtv-model'

const editorThemeTag = Symbol('editorTheme')
const highlightThemeTag = Symbol('highlightTheme')
const languageTag = Symbol('languageTag')
const themeReconfigure = {
  dark: {
    [editorThemeTag]: darkTheme,
    [highlightThemeTag]: darkHighlightStyle,
  },
  light: {
    [editorThemeTag]: lightTheme,
    [highlightThemeTag]: lightHighlightStyle,
  },
}
const languageReconfigure = {
  javascript: {
    [languageTag]: new LanguageSupport(jsxLanguage)
  },
  html: {
    [languageTag]: new LanguageSupport(htmlLanguage)
  },
}

function getMode({ editMode, mediaType }) {
  if (editMode === 'json') {
    return {
      mode: {
        editorMode: 'javascript',
        json: true,
      },
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

export default function CodeView({
  editMode,
  value,
  path,
  mediaType,
  context: { onMessage, theme },
  context,
}) {
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(false)
  const editor = useRef(null)
  const container = useRef(null)

  const initialValue =
    editMode === 'json' ? JSON.stringify(value, null, 2) : value

  const mode = getMode({ editMode, mediaType })

  const languageName = mode.editorMode === 'html' ? 'html' : 'javascript'
  const codeThemeName = theme.dark ? 'dark' : 'light'

  useEffect(() => {
    if (container.current) {
      const extensions = [
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
          ...lintKeymap,
        ]),
        Prec.fallback(defaultHighlightStyle),
        tagExtension(languageTag, languageReconfigure[languageName][languageTag]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !((update.transactions || [])[0] || {}).reconfigure) {
            setEditing(true)
          }
        }),
        tagExtension(editorThemeTag, themeReconfigure[codeThemeName][editorThemeTag]),
        tagExtension(highlightThemeTag, themeReconfigure[codeThemeName][highlightThemeTag]),
      ]
      if (!editor.current) {
        editor.current = new EditorView({
          state: EditorState.create({
            doc: initialValue,
            extensions,
          }),
          parent: container.current,
        })
      } else {
        const oldEditor = editor.current
        const doc = oldEditor.state.doc
        oldEditor.destroy()
        editor.current = new EditorView({
          state: EditorState.create({
            doc,
            extensions,
          }),
          parent: container.current,
        })
        // TODO: figure out how to use reconfigure
        // const reconfigure = pickBy({
        //   ...(languageReconfigure[languageName]),
        //   ...(themeReconfigure[codeThemeName]),
        // })
        // editor.current.dispatch({
        //   reconfigure,
        // });
        // editor.current.dispatch({
        //   reconfigure: {
        //     full: extensions,
        //   }
        // })
      }
    }
  }, [container, editor, codeThemeName, languageName, initialValue])

  const save = () => {
    const newValue = editor.current.state.doc.toString()
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
        <div className="vtv--code-view--textarea-wrapper" ref={container}></div>
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

CodeView.propTypes = {
  editMode: PropTypes.oneOf(['text', 'json']).isRequired,
  value: PropTypes.any.isRequired,
  state: PropTypes.object.isRequired,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
  mediaType: PropTypes.string,
  context: PropTypes.object.isRequired,
}
