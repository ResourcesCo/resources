import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
import Help from './commands/help'
import Giphy from './commands/giphy'
import TextareaAutosize from 'react-autosize-textarea'

const giphy = new Giphy()

export default ({onFocusChange}) => {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const ref = useRef()
  const addMessages = newMessages => {
    setMessages([...messages, ...newMessages])
  }
  const sendMessage = message => {
    const messages = [
      {
        type: 'input',
        content: <div className="input-message">{message}</div>,
      }
    ]
    if (message === '/help') {
      messages.push({
        type: 'output',
        content: <Help />,
      })
    } else if (message.startsWith('/auth ')) {
      const args = message.split(/\s+/)
      if (args[1] === 'giphy') {
        console.log(args)
        messages.push({
          type: 'output',
          content: giphy.auth(args[2])
        })
      }
    } else if (message.startsWith('/giphy ')) {
      const args = message.split(/\s+/)
      giphy.run(args[1]).then(content => {
        addMessages([
          {
            type: 'output',
            content: content,
          }
        ])
      })
    }
    addMessages(messages)
  }
  const send = () => {
    setText('')
    sendMessage(text)
    if (ref.current) {
      ref.current.scrollIntoView()
    }
  }
  const handleKeyPress = e => {
    if (e.which == 13 && e.shiftKey == false) {
      e.preventDefault()
      send()
    }
  }
  return (
    <div className="chat">
      <div className="messages-pane">
        <div className="messages-scroll">
          <div className="messages">
            {
              messages.map((message, i) => (
                <div
                  className={`chat-message ${message.type === 'input' ? 'input-message' : 'output-message'}`}
                  key={i}
                >
                  {message.content}
                </div>
              ))
            }
            <div className="the-end" ref={ref}></div>
          </div>
        </div>
      </div>
      <div className="chat-input">
        <TextareaAutosize
          placeholder=">"
          value={text}
          onChange={({target}) => setText(target.value)}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={send}><span className="rocket"><FontAwesomeIcon icon={faSpaceShuttle} /></span></button>
      </div>
      <style jsx>{`
        .chat {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          flex-grow: 1;
        }

        .chat-input {
          display: flex;
          flex-direction: row;
        }

        .chat-message {
          padding: 3px 5px;
          font-size: 20px;
        }

        div :global(textarea) {
          outline: none;
          width: 100%;
          font-size: 20px;
          line-height: 28px;
          padding: 2px 5px;
          height: 32px;
          resize: none;
        }

        .messages-pane {
          flex-grow: 1;
          position: relative;
        }

        .messages-scroll {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
        }

        .messages {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        button {
          outline: none;
          border: none;
          padding: 0 5px;
          font-size: 32px;
        }

        button :global(svg) {
          cursor: pointer;
        }

        .input-message {
          color: #bbb;
        }
      `}</style>
    </div>
  )
}