import Help from './help'
import Giphy from './giphy'
import Docs from './docs'

const giphy = new Giphy()
const docs = new Docs()

export default (message, addMessages) => {
  const messages = [
    {
      type: 'input',
      content: <div className="input-message">{message}</div>,
    }
  ]
  if (message === 'help') {
    messages.push({
      type: 'output',
      content: <Help />,
    })
  } else if (message.startsWith('docs ')) {
    const args = message.split(/\s+/)
    const url = args[1]
    docs.run(args[1]).then(content => {
      addMessages([
        {
          type: 'output',
          content: content,
        }
      ])
    })
  } else if (message.startsWith('auth ')) {
    const args = message.split(/\s+/)
    if (args[1] === 'giphy') {
      messages.push({
        type: 'output',
        content: giphy.auth(args[2])
      })
    }
  } else if (message.startsWith('giphy ')) {
    const args = message.split(/\s+/)
    giphy.run(args[1]).then(content => {
      addMessages([
        {
          type: 'output',
          content: content,
        }
      ])
    })
  } else if (message.startsWith('note ')) {
    messages[0].content = <div className="input-message">note</div>
    messages.push({
      type: 'output',
      content: <p>
        {message.replace(/^note\s*/, '').split("\n").map(s => <div>{s}</div>)}
      </p>
    })
  } else {
    messages.push({
      type: 'output',
      content: <p>Command not found.</p>
    })
  }
  addMessages(messages)
}