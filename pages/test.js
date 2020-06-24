import { useState, useEffect } from 'react'
import ConsoleWorkspace from 'api/workspace/ConsoleWorkspace'
import { parseCommand } from 'vtv'

async function runTests() {
  const workspace = ConsoleWorkspace.getWorkspace()
  const channel = await workspace.getChannel('main')
  const message = 'https://example.com/'
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

export default ({}) => {
  const [result, setResult] = useState('not completed')
  useEffect(() => {
    runTests().then(result => {
      setResult(JSON.stringify(result))
    })
  }, [])
  return <div>{result}</div>
}
