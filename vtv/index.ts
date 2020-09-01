import RuleList from 'vtv-model/rules/RuleList'
import Clipboard from './util/Clipboard'
import { ComponentType } from 'react'
import View from './View'
export { default as Textarea } from './generic/Textarea'
export { getTheme } from './themes'

export type Path = string[]

export interface Theme {
  base: string
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
    value: any
    state: any
  }
  ruleList: RuleList
  onMessage: Function
  clipboard: Clipboard
  theme: Theme
  onPickId: Function
  codeMirrorComponent?: ComponentType
}

export default View
