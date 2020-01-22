import light from './light'
import dark from './dark'

const themes = {
  light,
  dark,
}

export default themes
export const getTheme = value => (
  typeof value === 'string' ? themes[value] : value
)
