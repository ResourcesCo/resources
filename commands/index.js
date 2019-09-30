import shortid from 'shortid'
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
  'sleep': {
    async run({args}) {
      const [timeout, message] = args
      const promise = new Promise((resolve, reject) => {
        setTimeout(resolve, timeout)
      })
      await promise
      return { type: 'text', text: message }
    },
    help: {
      args: ['milliseconds', 'message'],
      details: 'Sleep for a specified number of milliseconds and then send a message'
    }
  }
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

export default async (message, onMessagesCreated, {formData, formCommandId} = {}) => {
  const commandName = message.trim().split(/\s+/, 2)[0]
  const command = commands[commandName]
  const commandId = shortid.generate()
  if (command) {
    const args = command.raw ? null : message.trim().split(/\s+/).slice(1)
    if (formData) {
      onMessagesCreated([{type: 'form-status', commandId, formCommandId, loading: true}])
    } else {
      onMessagesCreated(command.raw ? [] : [{...inputMessage(message), commandId, loading: true}])
    }
    const result = await command.run({command: commandName, args, message, store, formData, formCommandId})
    const outputMessages = Array.isArray(result) ? result : (
      result ? [result] : []
    ).map(message => ({...message, commandId}))
    onMessagesCreated([...outputMessages, {type: 'loaded', commandId}])
  } else {
    onMessagesCreated([
      inputMessage(message),
      { type: 'text', text: 'Command not found.' }
    ].map(message => ({...message, commandId})))
  }
}
