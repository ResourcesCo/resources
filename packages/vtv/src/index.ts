import { RuleList } from 'vtv-model'
import Clipboard from './util/Clipboard'
import View from './View'
export { default as Textarea } from './generic/Textarea'
export { getTheme } from './themes/index'
export { default as CodeEditor } from './code/CodeEditor'

export type Path = string[]

export interface Theme {
  base: string
  dark: boolean
  foreground: string
  lightTextColor: string
  lighterTextColor: string
  background: string
  backgroundHover: string
  backgroundActive: string
  inputBorder: string
  selectionBackground: string
  selectionColor: string
  summaryColor: string
  linkColor: string
  inputColor: string
  numberColor: string
  valueColor: string
  bubble1: string
  bubble2: string
  menuBackground: string
  menuHighlight: string
  errorColor: string
  actionColor: string
  primaryActionColor: string
  actionTextColor: string
  disabledActionColor: string
  disabledActionTextColor: string
  codeTheme: string
  fontFamily: string
}

export interface Context {
  document: {
    name?: string
    value: Record<string, unknown>
    state: Record<string, unknown>
  }
  ruleList: RuleList
  onMessage(message: Record<string, unknown>): void
  clipboard: Clipboard
  theme: Theme
  onPickId(string): void
}

export default View
