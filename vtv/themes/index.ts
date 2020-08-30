import light from './light'
import dark from './dark'

const themes = {
  light,
  dark,
}

export default themes
export const getTheme = theme => {
  if (typeof theme === 'string') {
    return themes[theme]
  } else {
    const baseTheme = themes[theme.base]
    return { ...baseTheme, ...theme }
  }
}
