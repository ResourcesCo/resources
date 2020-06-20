import ConsoleWorkspace from 'console/services/workspace/ConsoleWorkspace'
import { parseCommand } from 'vtv'

export default async function asana() {
  const workspace = ConsoleWorkspace.getWorkspace()
  const channel = await workspace.getChannel('main')
  let receivedRequest
  // mock the request
  channel.apps.asana.request = async request => {
    receivedRequest = request
    return { ok: true }
  }
  const receivedMessages = []
  const onMessage = message => {
    receivedMessages.push(message)
  }
  const messages = [
    'https://asana.com/ :auth apiKey',
    'https://app.asana.com/0/1180016330032425/1180016330032432 :complete',
  ]
  const results = []
  for (const message of messages) {
    const result = await channel.runCommand({
      message,
      parsed: parseCommand(message),
      onMessage,
    })
    results.push(result)
  }
  if (results.every(a => !!a) && receivedRequest.method === 'PUT') {
    return '1 test passed'
  } else {
    return '(error)'
  }
}
