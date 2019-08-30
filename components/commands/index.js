import Giphy from './giphy'
import Docs from './docs'

const giphy = new Giphy()
const docs = new Docs()

const inputMessage = message => ({
  type: 'input',
  text: message,
})

const commands = {
  help({message}) {
    const outputMessage = {
      type: 'help',
    }
    return [inputMessage(message), outputMessage]
  },
  docs({message, args}) {
    const url = args[0]
    const outputMessages = docs.run(url)
    return [inputMessage(message), ...outputMessages]
  },
  async giphy({message, args}) {
    const outputMessage = await giphy.run(...args)
    return [inputMessage(message), outputMessage]
  },
  note({message}) {
    return [
      {type: 'input', text: 'note'},
      {type: 'text', text: message.replace(/^note\s*/, '')}
    ]
  }
}

export default async (message) => {
  const allArgs = message.split(/\s+/)
  const command = allArgs[0]
  const args = allArgs.slice(1)
  const commandFn = commands[command]
  if (commandFn) {
    return commandFn({command, args, message})
  } else {
    return [
      inputMessage(message),
      { type: 'output', content: <p>Command not found.</p> }
    ]
  }
}
