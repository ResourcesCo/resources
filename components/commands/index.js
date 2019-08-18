import Giphy from './giphy'
import Docs from './docs'

const giphy = new Giphy()
const docs = new Docs()

export default async (message) => {
  let messages = [
    {
      type: 'input',
      text: message,
    }
  ]
  if (message === 'help') {
    messages.push({
      type: 'help',
    })
  } else if (message.startsWith('docs ')) {
    const args = message.split(/\s+/)
    const url = args[1]
    const outputMessages = docs.run(args[1])
    messages = [...messages, ...outputMessages]
  } else if (message.startsWith('auth ')) {
    const args = message.split(/\s+/)
    if (args[1] === 'giphy') {
      messages.push(giphy.auth(args[2]))
    }
  } else if (message.startsWith('giphy ')) {
    const args = message.split(/\s+/)
    const outputMessage = await giphy.run(args[1])
    messages.push(outputMessage)
  } else if (message.startsWith('note ')) {
    messages[0].content = <div className="input-message">note</div>
    messages = [{type: 'input', text: 'note'}, {type: 'text', text: message.replace(/^note\s*/, '')}]
  } else {
    messages.push({
      type: 'output',
      content: <p>Command not found.</p>
    })
  }
  return messages
}