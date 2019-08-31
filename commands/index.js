import giphy from './giphy'
import github from './github'
import docs from './docs'
import note from './note'
import clear from './clear'
import help from './help'
import roll from './roll'
import { store } from '../store'

const inputMessage = message => ({
  type: 'input',
  text: message,
})

const commands = {
  help,
  docs,
  giphy,
  github,
  note,
  clear,
  roll,
}

const getCommandHelp = () => {
  let result = []
  for (let command of Object.keys(commands)) {
    let commandHelp = []
    if (Array.isArray(commands[command].help)) {
      commandHelp = [...commands[command].help]
    } else if (commands[command].help) {
      commandHelp = [commands[command].help]
    }
    result = [...result, ...commandHelp.map(help => ({...help, command}))]
  }
  return result
}

export let commandHelp = getCommandHelp()

export default async (message) => {
  const commandName = message.split(/\s+/, 2)[0]
  const command = commands[commandName]
  if (command) {
    const args = command.raw ? null : message.split(/\s+/).slice(1)
    const inputMessages = command.raw ? [] : [inputMessage(message)]
    const result = await command.run({command: commandName, args, message, store})
    const outputMessages = Array.isArray(result) ? result : [result]
    return [...inputMessages, ...outputMessages]
  } else {
    return [
      inputMessage(message),
      { type: 'text', text: 'Command not found.' }
    ]
  }
}
