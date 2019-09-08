import giphy from './giphy'
import github from './github'
import asana from './asana'
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
  asana,
  note,
  clear,
  roll,
  'dark-mode': {
    run() {
      return {type: 'set-theme', theme: 'dark'}
    },
    help: {
      details: 'change to the dark theme'
    }
  },
  'light-mode': {
    run() {
      return {type: 'set-theme', theme: 'light'}
    },
    help: {
      details: 'change to the light theme'
    }
  },
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
  const commandName = message.trim().split(/\s+/, 2)[0]
  const command = commands[commandName]
  if (command) {
    const args = command.raw ? null : message.trim().split(/\s+/).slice(1)
    const inputMessages = command.raw ? [] : [inputMessage(message)]
    const result = await command.run({command: commandName, args, message, store})
    const outputMessages = Array.isArray(result) ? result : (
      result ? [result] : []
    )
    return [...inputMessages, ...outputMessages]
  } else {
    return [
      inputMessage(message),
      { type: 'text', text: 'Command not found.' }
    ]
  }
}
