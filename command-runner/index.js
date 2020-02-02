import shortid from 'shortid'
import { splitPath } from 'vtv'
import commands from '../commands'
import { store } from '../store'

const inputMessage = message => ({
  type: 'input',
  text: message,
})

const getGlobalCommandHelp = () => {
  let result = []
  for (let command of Object.keys(commands)) {
    const cmd = commands[command]
    const help = cmd.help
    if (Array.isArray(help)) {
      for (let value of help) {
        result.push({ ...value, command })
      }
    } else if (typeof help === 'string') {
      result.push({ args: cmd.args, details: cmd.help, command })
    } else if (help) {
      result.push({ ...help, command })
    } else if (cmd.commands) {
      result.push({
        command,
        details: `run ${command} commands (see \`${command}.help\`)`,
      })
    }
  }
  return result
}

export let globalCommandHelp = getGlobalCommandHelp()

const convertToArray = value => {
  return Array.isArray(value) ? value : value ? [value] : []
}

const messagesByType = (messages, type) => {
  return convertToArray(messages).filter(({ type: _type }) => _type === type)
}

const getCommandEnv = commandName => {
  const result = {}
  const prefix = `${commandName.toUpperCase().replace('-', '_')}_`
  for (let key of Object.keys(store.env).filter(key =>
    key.startsWith(prefix)
  )) {
    result[key.substr(prefix.length).toLowerCase()] = store.env[key]
  }
  return result
}

const updateCommandEnv = (commandName, envUpdates) => {
  if (envUpdates.length > 0) {
    for (let { value: messageValue } of envUpdates) {
      for (let key of Object.keys(messageValue)) {
        const envKey = `${commandName}_${key}`.toUpperCase().replace('-', '_')
        store.env[envKey] = messageValue[key]
      }
    }
    store.save()
  }
}

const runSubcommand = async ({
  commandPath,
  root,
  args,
  store,
  message,
  formData,
  formCommandId,
}) => {
  const commandName = commandPath[0]
  const subCommandName = commandPath[1]

  if (commandPath.length === 1) {
    return {
      type: 'text',
      text: `No ${commandName} command given. Run \`${commandName}.help\` to see the available commands.`,
    }
  }

  if (subCommandName === 'help') {
    const help = [
      {
        command: `${commandName}.help`,
        args: [],
        details: `show help for ${commandName} commands`,
      },
    ]
    for (let key of Object.keys(root.commands).filter(
      s => !s.startsWith('_')
    )) {
      const command = key
      const cmd = root.commands[key]
      help.push({
        args: cmd.args,
        details: cmd.help,
        command: `${commandName}.${command}`,
      })
    }
    return [{ type: 'help', help }]
  }

  const subCommandArgList = args
  const subCommandValue = root.commands[subCommandName.replace('-', '_')]

  if (!subCommandValue) {
    return {
      type: 'text',
      text: `Unknown command. Run \`${commandName} help\` to see the available commands.`,
    }
  }
  const subCommand = {
    ...subCommandValue,
    name: subCommandName,
  }

  const subCommandArgs = {}
  if (subCommandArgList.length !== subCommand.args.length) {
    return { type: 'text', text: 'Invalid number of arguments.' }
  }
  for (let i = 0; i < subCommand.args.length; i++) {
    subCommandArgs[subCommand.args[i].replace('-', '_')] = subCommandArgList[i]
  }

  let dependencies = null
  if (root.dependencies) {
    dependencies = {}
    for (let dependency of root.dependencies) {
      dependencies[dependency.replace('-', '_')] = {
        env: getCommandEnv(dependency),
      }
    }
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
    dependencies,
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
  const updatedResult = resultArray.filter(({ type }) => type !== 'env')
  updateCommandEnv(
    commandName,
    resultArray.filter(({ type }) => type === 'env')
  )
  return [...convertToArray(beforeResult), ...updatedResult]
}

export default async (
  message,
  parsed,
  onMessagesCreated,
  { formData, formCommandId } = {}
) => {
  const commandPath = splitPath(parsed[0])

  const commandName = commandPath[0]
  const command = commands[commandName]
  const commandId = shortid.generate()
  if (command) {
    const args = parsed.slice(1)
    if (formData) {
      onMessagesCreated([
        { type: 'form-status', commandId, formCommandId, loading: true },
      ])
    } else {
      onMessagesCreated([
        { ...inputMessage(message), commandId, loading: true },
      ])
    }
    const context = {
      commandPath,
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
    const outputMessages = convertToArray(result).map(message => ({
      ...message,
      commandId,
    }))
    onMessagesCreated([...outputMessages, { type: 'loaded', commandId }])
  } else {
    onMessagesCreated(
      [
        inputMessage(message),
        { type: 'text', text: 'Command not found.' },
      ].map(message => ({ ...message, commandId }))
    )
  }
}
