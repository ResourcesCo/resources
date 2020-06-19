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
  const message1 = 'https://asana.com/ :auth apiKey'
  const message2 =
    'https://app.asana.com/0/1180016330032425/1180016330032432 :complete'
  const receivedMessages = []
  const onMessage = message => {
    receivedMessages.push(message)
  }
  const result1 = await channel.runCommand({
    message: message1,
    parsed: parseCommand(message1),
    onMessage,
  })
  const result2 = await channel.runCommand({
    message: message2,
    parsed: parseCommand(message2),
    onMessage,
  })
  if (
    result1 === true &&
    result2 === true &&
    receivedRequest.method === 'PUT'
  ) {
    return '1 test passed'
  } else {
    return '(error)'
  }
}
