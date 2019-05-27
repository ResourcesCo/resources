import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'

export default ({onFocusChange}) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const ref = useRef();
  const send = () => {
    setText('');
    setMessages([...messages, text]);
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }
  return (
    <div className="chat">
      <div className="messages-pane">
        <div className="messages-scroll">
          <div className="messages">
            {
              messages.map(message => (
                <div className="chat-message">{message}</div>
              ))
            }
            <div className="the-end" ref={ref}></div>
          </div>
        </div>
      </div>
      <div className="chat-input">
        <textarea
          placeholder=">"
          value={text}
          onChange={({target}) => setText(target.value)}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
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
          padding: 5px 3px;
        }

        textarea {
          outline: none;
          width: 100%;
          font-size: 20px;
          line-height: 28px;
          padding: 2px;
          height: 32px;
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
      `}</style>
    </div>
  )
}