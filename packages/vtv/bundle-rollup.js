const rollup = require('rollup')

function getRollupOptions(options) {
  const extraGlobals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    'styled-components': 'styled',
    '@emotion/core': 'emotionCore',
    '@emotion/styled': 'emotionStyled',
  };
  if (Array.isArray(options.output)) {
    options.output.forEach((o) => {
      o.globals = { ...o.globals, ...extraGlobals };
    });
  } else {
    options.output = {
      ...options.output,
      globals: {...options.output.globals, ...extraGlobals},
    };
  }
  return options
}

module.exports = getRollupOptions;