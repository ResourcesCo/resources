export default {
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#33e',
    secondary: '#30c',
    muted: '#f6f6f6',
    divider: '#bbb',
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: '"Avenir Next", sans-serif',
    monospace: 'Menlo, monospace',
  },
  fontSizes: [9, 12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.8,
  },
  cards: {
    primary: {
      maxWidth: 256,
    },
  },
  text: {
    heading: {
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
    },
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  forms: {
    label: {
      fontSize: 2,
      fontWeight: 'bold',
    },
    input: {
      borderColor: 'gray',
      '&:focus': {
        borderColor: 'primary',
        boxShadow: (t) => `0 0 0 2px ${t.colors.primary}`,
        outline: 'none',
      },
    },
    select: {
      borderColor: 'gray',
      '&:focus': {
        borderColor: 'primary',
        boxShadow: (t) => `0 0 0 2px ${t.colors.primary}`,
        outline: 'none',
      },
    },
    textarea: {
      borderColor: 'gray',
      '&:focus': {
        borderColor: 'primary',
        boxShadow: (t) => `0 0 0 2px ${t.colors.primary}`,
        outline: 'none',
      },
    },
    slider: {
      bg: 'muted',
    },
  },
  borders: {
    divider: '1px solid #ccc',
  },
  styles: {
    root: {
      boxSizing: 'border-box',
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    },
    h1: {
      fontSize: 36,
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      mt: 4,
      mb: 2,
    },
    h2: {
      fontSize: 26,
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      mt: 2,
      mb: 1,
    },
    h3: {
      fontSize: 22,
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      mt: 2,
      mb: 1,
    },
    ul: {
      fontSize: 'body',
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      ml: 3,
      pl: 1,
    },
    ol: {
      fontSize: 'body',
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      ml: 3,
      pl: 1,
    },
    p: {
      color: 'text',
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
    table: {
      borderCollapse: 'collapse',
    },
    tr: {},
    th: {
      fontFamily: 'body',
      border: '1px solid #bbb',
      p: 1,
    },
    td: {
      fontFamily: 'body',
      border: '1px solid #bbb',
      p: 1,
    },
  },
}
