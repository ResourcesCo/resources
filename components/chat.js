import { PureComponent } from 'react';
import runCommand from '../commands'
import Message from './messages/message'
import { store } from '../store'
import ChatInput from './chat-input'
import insertTextAtCursor from 'insert-text-at-cursor'

class Chat extends PureComponent {
  state = {
    messages: [],
    text: '',
  }

  constructor(props) {
    super(props)
    this.scrollRef = React.createRef()
    this.textareaRef = React.createRef()
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
    let {messages} = this.state
    const messagesToAdd = []
    let clear = false
    let loadedMessage = undefined
    for (let message of newMessages) {
      if (message.type === 'loaded') {
        loadedMessage = message.commandId
      } else if (message.type === 'clear') {
        clear = true
      } else if (message.type === 'set-theme') {
        this.props.onThemeChange(message.theme)
      } else {
        messagesToAdd.push(message)
      }
    }
    messages = [...messages, ...messagesToAdd]
    if (clear) {
      messages = []
    }
    if (loadedMessage) {
      messages = messages.map(m => (
        (m.type === 'input' && m.commandId === loadedMessage) ? {...m, loading: false} : m
      ))
    }
    this.setMessages(messages)
    this.scrollToBottom()
  }

  setMessages = updatedMessages => {
    this.setState({messages: updatedMessages})
    store.messages = updatedMessages
    store.save()
  }

  send = async () => {
    const {text} = this.state
    this.setState({text: ''})
    const newMessages = await runCommand(text, this.addMessages)
  }

  scrollToBottom = () => {
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollIntoView()
    }
  }

  handleTextChange = ({target}) => {
    this.setState({text: target.value})
  }

  handlePickId = id => {
    const el = this.textareaRef.current
    insertTextAtCursor(el, `${id}`)
    el.focus()
  }

  render() {
    const { onFocusChange, theme } = this.props
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
                    <Message key={i} onLoad={this.scrollToBottom} theme={theme} onPickId={this.handlePickId} {...message} />
                  </div>
                ))
              }
              <div className="the-end" ref={scrollRef}></div>
            </div>
          </div>
        </div>
        <ChatInput
          textareaRef={this.textareaRef}
          text={text}
          onTextChange={this.handleTextChange}
          onFocusChange={onFocusChange}
          onSend={this.send}
        />
        <style jsx>{`
          .chat {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            flex-grow: 1;
          }

          .chat-message {
            padding: 3px 5px;
            font-size: 20px;
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

          .input-message {
            color: ${theme.inputColor};
          }
        `}</style>
      </div>
    )
  }
}

export default Chat
