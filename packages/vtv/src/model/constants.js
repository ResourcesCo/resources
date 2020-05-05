export const defaultPrefix = 'newName'

export const codeTypes = [
  {
    name: 'JavaScript',
    editorMode: 'javascript',
    mediaType: 'application/javascript',
  },
  { name: 'CSS', editorMode: 'css', mediaType: 'text/css' },
  { name: 'HTML', editorMode: 'htmlmixed', mediaType: 'text/html' },
  {
    name: 'Markdown',
    editorMode: {
      name: 'gfm',
      tokenTypeOverrides: {
        emoji: 'emoji',
      },
    },
    mediaType: 'text/markdown',
  },
  {
    name: 'JSON',
    editorMode: { mode: 'javascript', json: true },
    mediaType: 'text/x-swift',
  },
  {
    name: 'YAML',
    editorMode: { mode: 'yaml', json: true },
    mediaType: 'text/x-swift',
  },
  {
    name: 'CSV',
    editorMode: null,
    mediaType: 'text/csv',
  },
  {
    name: 'Python',
    editorMode: 'python',
    indentUnit: 4,
    mediaType: 'text/x-python',
  },
  { name: 'Java', editorMode: 'text/x-java', mediaType: 'text/x-java' },
  { name: 'Kotlin', editorMode: 'text/x-kotlin', mediaType: 'text/x-kotlin' },
  { name: 'Swift', editorMode: 'text/x-swift', mediaType: 'text/x-swift' },
]
