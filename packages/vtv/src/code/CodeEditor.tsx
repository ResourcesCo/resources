import React, {
  useRef,
  useEffect,
  MutableRefObject,
  FunctionComponent,
} from 'react'
import {
  EditorView,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  KeyBinding,
  keymap,
  lineNumbers,
  rectangularSelection
} from '@codemirror/view'
import { EditorState, Extension, Compartment } from '@codemirror/state'
import {
  indentOnInput,
  LanguageSupport,
  LanguageDescription,
  foldGutter,
  foldKeymap,
  bracketMatching,
  syntaxHighlighting
} from '@codemirror/language'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
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

const languageCompartment = new Compartment()
const viewThemeCompartment = new Compartment()
const highlightThemeCompartment = new Compartment()

const viewThemeExtensions = {
  dark: darkTheme,
  light: lightTheme,
}
const highlightThemeExtensions = {
  dark: syntaxHighlighting(darkHighlightStyle),
  light: syntaxHighlighting(lightHighlightStyle),
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

interface CodeEditorProps {
  initialValue?: string
  editorViewRef: MutableRefObject<EditorView>
  language?: string
  theme?: string
  completionExtension?: Extension
  additionalExtensions?: Extension[]
  customKeymap?: readonly KeyBinding[]
  showLineNumbers?: boolean
  className?: string
}

const CodeEditor: FunctionComponent<CodeEditorProps> = ({
  initialValue = '',
  editorViewRef,
  language = undefined,
  theme = 'dark',
  completionExtension,
  additionalExtensions = [],
  customKeymap = [],
  showLineNumbers = true,
  className = '',
}) => {
  const containerRef = useRef()
  const prevConfigRef = useRef({ language: undefined, theme: undefined })

  useEffect(() => {
    const currentConfig = { language, theme }
    if (containerRef.current) {
      if (!editorViewRef.current) {
        const languageExtension = languageCompartment.of(
          languageExtensions[language]
          ? [languageExtensions[language]]
          : []
        );
        const viewThemeExtension = viewThemeCompartment.of(viewThemeExtensions[theme])
        const highlightThemeExtension = highlightThemeCompartment.of(highlightThemeExtensions[theme])
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
            ...completionKeymap,
            ...lintKeymap,
          ]),
          languageExtension,
          viewThemeExtension,
          highlightThemeExtension,
          ...additionalExtensions,
        ]
        console.log({extensions});
        editorViewRef.current = new EditorView({
          state: EditorState.create({
            doc: initialValue,
            extensions,
          }),
          parent: containerRef.current,
        })
      } else {
        const editorView = editorViewRef.current as EditorView
        const langUpdated = language !== prevConfigRef.current.language
        const themeUpdated = theme !== prevConfigRef.current.theme
        if (langUpdated || themeUpdated) {
          editorView.state.update({effects: [
            ...(langUpdated ? [languageCompartment.reconfigure(
              languageExtensions[language]
              ? [languageExtensions[language]]
              : []
            )] : []),
            ...(themeUpdated ? [languageCompartment.reconfigure(
              viewThemeExtensions[theme]
            )] : []),
            ...(themeUpdated ? [languageCompartment.reconfigure(
              highlightThemeExtensions[theme]
            )] : []),
          ]})
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

  return <div className={className} ref={containerRef}></div>
}

export default CodeEditor
