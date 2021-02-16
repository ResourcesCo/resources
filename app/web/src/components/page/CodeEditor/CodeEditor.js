/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useRef, useEffect } from 'react'
import {
  EditorView,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  keymap,
} from '@codemirror/view'
import { EditorState, Extension, tagExtension } from '@codemirror/state'
import { history, historyKeymap } from '@codemirror/history'
import { foldGutter, foldKeymap } from '@codemirror/fold'
import {
  indentOnInput,
  LanguageSupport,
  LanguageDescription,
} from '@codemirror/language'
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
import darkTheme from './themes/ui/dark'
import darkHighlightStyle from './themes/highlight/dark'
import lightTheme from './themes/ui/light'
import lightHighlightStyle from './themes/highlight/light'

const languageTag = Symbol('lang')
const viewThemeTag = Symbol('viewTheme')
const highlightThemeTag = Symbol('highlightTheme')

const viewThemeExtensions = {
  dark: darkTheme,
  light: lightTheme,
}
const highlightThemeExtensions = {
  dark: darkHighlightStyle,
  light: lightHighlightStyle,
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
  javascript: langs.javascript,
  json: langs.json,
  html: langs.html,
  css: langs.css,
  python: langs.python,
  markdown: markdown({
    codeLanguages: [
      LanguageDescription.of({
        name: 'javascript',
        alias: ['js', 'jsx'],
        async load() {
          return langs.javascript
        },
      }),
      LanguageDescription.of({
        name: 'json',
        async load() {
          return langs.json
        },
      }),
      LanguageDescription.of({
        name: 'html',
        alias: ['htm'],
        async load() {
          return langs.html
        },
      }),
      LanguageDescription.of({
        name: 'css',
        async load() {
          return langs.css
        },
      }),
      LanguageDescription.of({
        name: 'python',
        alias: ['py'],
        async load() {
          return langs.python
        },
      }),
    ],
  }),
}

const CodeEditor = ({
  initialValue = '',
  editorViewRef: editorViewRefProp,
  language = undefined,
  theme = 'light',
  completionExtension,
  additionalExtensions = [],
  customKeymap = [],
  showLineNumbers = true,
  className = '',
}) => {
  const editorViewRefInternal = useRef()
  const containerRef = useRef()
  const prevConfigRef = useRef({ language: undefined, theme: undefined })

  const editorViewRef = editorViewRefProp || editorViewRefInternal

  useEffect(() => {
    const currentConfig = { language, theme }
    if (containerRef.current) {
      if (!editorViewRef.current) {
        const extensions = [
          ...(showLineNumbers ? [lineNumbers()] : []),
          highlightSpecialChars(),
          history(),
          foldGutter(),
          drawSelection(),
          EditorState.allowMultipleSelections.of(true),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          completionExtension || autocompletion(),
          rectangularSelection(),
          highlightActiveLine(),
          highlightSelectionMatches(),
          keymap.of([
            ...customKeymap,
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...commentKeymap,
            ...completionKeymap,
            ...lintKeymap,
          ]),
          ...(languageExtensions[language]
            ? [tagExtension(languageTag, languageExtensions[language])]
            : []),
          tagExtension(viewThemeTag, viewThemeExtensions[theme]),
          tagExtension(highlightThemeTag, highlightThemeExtensions[theme]),
          ...additionalExtensions,
        ]
        editorViewRef.current = new EditorView({
          state: EditorState.create({
            doc: initialValue,
            extensions,
          }),
          parent: containerRef.current,
        })
      } else {
        const langUpdated = language !== prevConfigRef.current.language
        const themeUpdated = theme !== prevConfigRef.current.theme
        if (langUpdated || themeUpdated) {
          editorViewRef.current.dispatch({
            reconfigure: {
              ...(langUpdated && {
                [languageTag]: languageExtensions[language]
                  ? [languageExtensions[language]]
                  : [],
              }),
              ...(themeUpdated && {
                [viewThemeTag]: viewThemeExtensions[theme],
              }),
              ...(themeUpdated && {
                [highlightThemeTag]: highlightThemeExtensions[theme],
              }),
            },
          })
        }
      }
      prevConfigRef.current = currentConfig
    }
  }, [
    containerRef,
    initialValue,
    editorViewRef,
    language,
    theme,
    additionalExtensions,
  ])

  return (
    <div
      className={className}
      ref={containerRef}
      sx={{
        border: '1px solid',
        borderColor: 'gray',
        borderRadius: 4,
        p: 2,
        '&:focus-within': {
          borderColor: 'primary',
          boxShadow: (t) => `0 0 0 2px ${t.colors.primary}`,
          outline: 'none',
        },
      }}
    ></div>
  )
}

export default CodeEditor
