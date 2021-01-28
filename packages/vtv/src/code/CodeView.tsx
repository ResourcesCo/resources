import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
} from '@codemirror/view'
import { EditorState, tagExtension } from '@codemirror/state'
import { history, historyKeymap } from '@codemirror/history'
import { foldGutter, foldKeymap } from '@codemirror/fold'
import { indentOnInput, LanguageSupport, LanguageDescription } from '@codemirror/language'
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
import { cssLanguage } from '@codemirror/lang-css'
import { pythonLanguage } from '@codemirror/lang-python'
import { markdown } from '@codemirror/lang-markdown'
import { jsonLanguage } from '@codemirror/lang-json'
import ActionButton from '../generic/ActionButton'
import darkTheme from './themes/ui/dark'
import darkHighlightStyle from './themes/highlight/dark'
import lightTheme from './themes/ui/light'
import lightHighlightStyle from './themes/highlight/light'
import { codeTypes } from 'vtv-model'

const themeExtensions = {
  dark: [darkTheme, darkHighlightStyle],
  light: [lightTheme, lightHighlightStyle],
}
const langs = {
  javascript: new LanguageSupport(jsxLanguage),
  css: new LanguageSupport(cssLanguage),
  python: new LanguageSupport(pythonLanguage),
  json: new LanguageSupport(jsonLanguage),
  html: undefined,
}
langs.html = new LanguageSupport(htmlLanguage, [langs.css, langs.javascript])
const languageExtensions = {
  javascript: [langs.javascript],
  json: [langs.json],
  html: [langs.html],
  css: [langs.css],
  python: [langs.python],
  markdown: [markdown({codeLanguages: [
    LanguageDescription.of({name: 'javascript', alias: ['js', 'jsx'], async load() { return langs.javascript}}),
    LanguageDescription.of({name: 'json', async load() { return langs.json}}),
    LanguageDescription.of({name: 'html', alias: ['htm'], async load() { return langs.html}}),
    LanguageDescription.of({name: 'css', async load() { return langs.css}}),
    LanguageDescription.of({name: 'python', alias: ['py'], async load() { return langs.python}}),
  ]})],
  plainText: [],
}

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

  const languageName = (mode.editorMode || '').toString() in languageExtensions ? mode.editorMode : 'plainText'
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
        ...languageExtensions[languageName],
        ...themeExtensions[codeThemeName],
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !((update.transactions || [])[0] || {}).reconfigure) {
            setEditing(true)
          }
        }),
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
