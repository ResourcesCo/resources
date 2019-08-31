export default {
  run({message}) {
    return [
      {type: 'input', text: 'note'},
      {type: 'text', text: message.replace(/^note\s*/, '')}
    ]
  },
  raw: true,
  help: {
    args: ['text'],
    details: 'print a note'
  }
}
