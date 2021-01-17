import light from './light'
import dark from './dark'
import blue from './blue'
import { Theme } from 'vtv'

const themes = {
  light,
  dark,
  blue,
}

export default themes
export function getTheme(theme: string | Theme) {
  if (typeof theme === 'string') {
    return themes[theme]
  } else {
    const baseTheme = themes[theme.base]
    return { ...baseTheme, ...theme }
  }
}

export const themeProperties = {
  fontFamily: '--vtv-font-family',
  background: '--vtv-background',
  backgroundHover: '--vtv-background-hover',
  backgroundActive: '--vtv-background-active',
  foreground: '--vtv-foreground',
  lightTextColor: '--vtv-light-text-color',
  lighterTextColor: '--vtv-lighter-text-color',
  inputBorder: '--vtv-input-border',
  selectionBackground: '--vtv-selection-background',
  selectionColor: '--vtv-selection-color',
  summaryColor: '--vtv-summary-color',
  linkColor: '--vtv-link-color',
  inputColor: '--vtv-input-color',
  numberColor: '--vtv-number-color',
  valueColor: '--vtv-value-color',
  bubble1: '--vtv-bubble1',
  bubble2: '--vtv-bubble2',
  menuBackground: '--vtv-menu-background',
  menuHighlight: '--vtv-menu-highlight',
  menuSeparator: '--vtv-menu-separator',
  errorColor: '--vtv-error-color',
  actionColor: '--vtv-action-color',
  primaryActionColor: '--vtv-primary-action-color',
  actionTextColor: '--vtv-action-text-color',
  disabledActionColor: '--vtv-disabled-action-color',
  disabledActionTextColor: '--vtv-disabled-action-text-color',
}