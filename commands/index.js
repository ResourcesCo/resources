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
    const cmd = commands[command]
    const help = cmd.help
    if (Array.isArray(help)) {
      for (let value of help) {
        result.push({...value, command})
      }
    } else if (typeof help === 'string') {
      result.push({args: cmd.args, details: cmd.help, command})
    } else if (help) {
      result.push({...help, command})
    }
  }
  return result
}

export let commandHelp = getCommandHelp()

const convertToArray = value => {
  return Array.isArray(value) ? value : (value ? [value] : [])
}

const messagesByType = (messages, type) => {
  return convertToArray(messages).filter(({type: _type}) => _type === type)
}

const getCommandEnv = commandName => {
  const result = {}
  const prefix = `${commandName.toUpperCase().replace('-', '_')}_`
  for (let key of Object.keys(store.env).filter(key => key.startsWith(prefix))) {
    result[key.substr(prefix.length).toLowerCase()] = store.env[key]
  }
  return result
}

const updateCommandEnv = (commandName, envUpdates) => {
  if (envUpdates.length > 0) {
    for (let {value: messageValue} of envUpdates) {
      for (let key of Object.keys(messageValue)) {
        const envKey = `${commandName}_${key}`.toUpperCase().replace('-', '_')
        store.env[envKey] = messageValue[key]
      }
    }
    store.save()
  }
}

const runSubcommand = async ({commandName, root, args, store, message, formData, formCommandId}) => {
  if (args.length === 0) {
    return {type: 'text', text: `No ${commandName} command given. Run \`${commandName} help\` to see the available commands.`}
  }
  const subCommandName = args[0]

  if (subCommandName === 'help') {
    const help = [
      {
        command: 'help',
        args: [],
        details: `show help for ${commandName} commands`,
      }
    ]
    for (let key of Object.keys(root.commands)) {
      const command = key.replace('_', '-')
      const cmd = root.commands[key]
      help.push({args: cmd.args, details: cmd.help, command})
    }
    return [{type: 'help', help}]
  }

  const subCommandArgList = args.slice(1)
  const subCommandValue = root.commands[subCommandName.replace('-', '_')]

  if (!subCommandValue) {
    return {type: 'text', text: `Unknown command. Run \`${commandName} help\` to see the available commands.`}
  }
  const subCommand = {
    ...subCommandValue,
    name: subCommandName,
  }

  const subCommandArgs = {}
  if (subCommandArgList.length !== subCommand.args.length) {
    return {type: 'text', text: 'Invalid number of arguments.'}
  }
  for (let i=0; i < subCommand.args.length; i++) {
    subCommandArgs[subCommand.args[i].replace('-', '_')] = subCommandArgList[i]
  }

  const env = getCommandEnv(commandName)
  const parentCommand = {
    ...root,
    name: commandName,
  }
  const context = {
    store,
    message,
    formData,
    formCommandId,
    env,
    args: subCommandArgs,
    command: subCommand,
    parentCommand,
  }

  let beforeResult
  if (parentCommand && parentCommand.filters && parentCommand.filters.before) {
    beforeResult = await parentCommand.filters.before(context)
    if (messagesByType(beforeResult, 'error').length) {
      return convertToArray(beforeResult)
    }
  }
  const result = await subCommand.run(context)
  const resultArray = convertToArray(result)
  const updatedResult = resultArray.filter(({type}) => type !== 'env')
  updateCommandEnv(commandName, resultArray.filter(({type}) => type === 'env'))
  return [...convertToArray(beforeResult), ...updatedResult]
}

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
    const context = {
      args,
      message,
      store,
      formData,
      formCommandId,
      root: command,
    }
    let result
    if (command.commands) {
      result = await runSubcommand({
        commandName,
        ...context,
      })
    } else {
      result = await command.run({
        command: commandName,
        ...context,
      })
    }
    const outputMessages = convertToArray(result).map(message => ({...message, commandId}))
    onMessagesCreated([...outputMessages, {type: 'loaded', commandId}])
  } else {
    onMessagesCreated([
      inputMessage(message),
      { type: 'text', text: 'Command not found.' }
    ].map(message => ({...message, commandId})))
  }
}
