import ConsoleWorkspace from 'console/services/workspace/ConsoleWorkspace'
import { parseCommand } from 'vtv'

export default async function asana() {
  const workspace = ConsoleWorkspace.getWorkspace()
  const channel = await workspace.getChannel('main')
  const message = 'https://asana.com/ :auth apiKey'
  const receivedMessages = []
  const onMessage = message => {
    receivedMessages.push(message)
  }
  const result = await channel.runCommand({
    message,
    parsed: parseCommand(message),
    onMessage,
  })
  if (result === true) {
    return receivedMessages
  } else {
    return '(error)'
  }
}
