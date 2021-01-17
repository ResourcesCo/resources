import vtvDark from 'vtv/themes/dark'
import vtvLight from 'vtv/themes/light'
import vtvBlue from 'vtv/themes/blue'

export const shared = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Avenir Next, Avenir, Helvetica, sans-serif',
}

// TODO: remove options not specific to console
export const dark = {
  ...shared,
  base: 'dark',
  foreground: '#eee',
  lightTextColor: '#ccc',
  lighterTextColor: '#aaa',
  background: '#14191e',
  backgroundHover: '#33383d',
  inputBorder: 'rgb(140, 140, 140)',
  selectionBackground: 'rgb(68, 68, 153, 0.99)',
  selectionColor: '#eee',
  summaryColor: '#aaa',
  linkColor: '#6fd7d7',
  inputColor: '#5ac',
  numberColor: '#9ce',
  valueColor: '#dd9',
  menuBackground: '#777',
  menuHighlight: '#878787',
  errorColor: '#c00',
  actionColor: '#999',
  primaryActionColor: '#aee',
  actionTextColor: '#111',
  disabledActionColor: '#575757',
  disabledActionTextColor: '#999',
  ...vtvDark,
}

export const blue = {
  ...shared,
  base: 'blue',
  foreground: '#eee',
  lightTextColor: '#ccc',
  lighterTextColor: '#aaa',
  background: '#00008B',
  backgroundHover: '#0000E7',
  inputBorder: 'rgb(140, 140, 140)',
  selectionBackground: 'rgb(68, 68, 153, 0.99)',
  selectionColor: '#eee',
  summaryColor: '#aaa',
  linkColor: '#6fd7d7',
  inputColor: '#5ac',
  numberColor: '#9ce',
  valueColor: '#dd9',
  menuBackground: '#777',
  menuHighlight: '#878787',
  errorColor: '#c00',
  actionColor: '#999',
  primaryActionColor: '#aee',
  actionTextColor: '#111',
  disabledActionColor: '#575757',
  disabledActionTextColor: '#999',
  ...vtvBlue,
}

export const light = {
  ...shared,
  base: 'light',
  foreground: '#111',
  lightTextColor: '#444',
  background: '#f7f7f7',
  backgroundHover: '#d7d7d7',
  inputBorder: 'rgb(140, 140, 140)',
  selectionBackground: '#7ec0ee',
  selectionColor: 'black',
  linkColor: '#2562b1',
  summaryColor: '#444',
  inputColor: '#297',
  numberColor: '#407',
  valueColor: '#550',
  bubble1: '#c8c8c8',
  bubble2: '#d9c9e9',
  menuBackground: '#bbb',
  menuHighlight: '#aaa',
  errorColor: '#f00',
  actionColor: '#444',
  primaryActionColor: '#5a5',
  actionTextColor: '#ccc',
  disabledActionColor: '#bbb',
  disabledActionTextColor: '#888',
  ...vtvLight,
}

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
