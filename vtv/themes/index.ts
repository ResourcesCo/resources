import light from './light'
import dark from './dark'
import { Theme } from 'vtv'

const themes = {
  light,
  dark,
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
