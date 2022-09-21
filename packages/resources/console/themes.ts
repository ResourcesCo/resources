import { getTheme as _getTheme } from 'vtv'

export const themes = {
  dark: _getTheme('dark'),
  light: _getTheme('light'),
  blue: _getTheme('blue')
}

export function getTheme(value) {
  if (typeof value === 'string') {
    return themes[value]
  } else {
    return {
      ...themes[value.base],
      ...themes[value],
    }
  }
}
