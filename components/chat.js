import { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
import runCommand from '../commands'
import Message from './messages/message'
import { store } from '../store'

import TextareaAutosize from 'react-autosize-textarea'

class Chat extends PureComponent {
  state = {
    messages: [],
    text: '',
  }

  constructor(props) {
    super(props)
    this.scrollRef = React.createRef()
  }

  async componentDidMount() {
    const loadMessages = async () => {
      await store.load()
      this.setState({messages: store.messages})
    }
    await loadMessages()
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollIntoView()
    }
  }

  componentWillUnmount() {

  }

  addMessages = newMessages => {
    const {messages} = this.state
    const updatedMessages = [...messages, ...newMessages]
    this.setMessages(updatedMessages)
  }

  setMessages = updatedMessages => {
    this.setState({messages: updatedMessages})
    store.messages = updatedMessages
    store.save()
  }

  send = async () => {
    const {text} = this.state
    this.setState({text: ''})
    const newMessages = await runCommand(text)
    if (newMessages.length === 1 && newMessages[0].type === 'clear') {
      this.setMessages([])
    } else {
      this.addMessages(newMessages)
    }
    this.scrollToBottom()
  }

  scrollToBottom = () => {
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollIntoView()
    }
  }

  handleKeyPress = e => {
    if (e.which == 13 && e.shiftKey == false) {
      e.preventDefault()
      this.send()
    }
  }

  handleTextChange = ({target}) => {
    this.setState({text: target.value})
  }

  render() {
    const { onFocusChange } = this.props
    const { text, messages } = this.state
    const scrollRef = this.scrollRef

    return (
      <div className="chat">
        <div className="messages-pane">
          <div className="messages-scroll">
            <div className="messages">
              {
                messages.filter(m => typeof m === 'object' && !!m).map((message, i) => (
                  <div
                    className={`chat-message ${message.type === 'input' ? 'input-message' : 'output-message'}`}
                    key={i}
                  >
                    <Message key={i} onLoad={this.scrollToBottom} {...message} />
                  </div>
                ))
              }
              <div className="the-end" ref={scrollRef}></div>
            </div>
          </div>
        </div>
        <div className="chat-input">
          <TextareaAutosize
            placeholder=">"
            value={text}
            onChange={this.handleTextChange}
            onFocus={() => onFocusChange(true)}
            onBlur={() => onFocusChange(false)}
            onKeyPress={this.handleKeyPress}
            autoFocus
          />
          <button onClick={this.send}><span className="rocket"><FontAwesomeIcon icon={faSpaceShuttle} /></span></button>
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
            display: flex;
            position: relative;
          }

          .messages-scroll {
            flex: 1;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
          }

          .current-page-docs {
            color: green;
            min-height: 300px;
          }

          .messages {
            flex: 0;
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
}

export default Chat
