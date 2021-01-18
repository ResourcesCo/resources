import dark from 'vtv/themes/dark'
import light from 'vtv/themes/light'
import blue from 'vtv/themes/blue'

export const themes = { dark, light, blue }

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
