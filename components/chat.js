import { PureComponent } from 'react';
import runCommand from '../commands'
import Message from './messages/message'
import { store } from '../store'
import ChatInput from './chat-input'
import insertTextAtCursor from 'insert-text-at-cursor'

class Chat extends PureComponent {
  state = {
    commandIds: [],
    commands: {},
    text: '',
  }

  constructor(props) {
    super(props)
    this.scrollRef = React.createRef()
    this.textareaRef = React.createRef()
  }

  setLoaded(m) {
    return m.type === 'input' ? {...m, loading: false} : m
  }

  async componentDidMount() {
    const loadMessages = async () => {
      await store.load()
      const commands = { ...store.commands }
      for (let key of Object.keys(commands)) {
        commands[key] = this.setLoaded(commands[key])
      }
      this.setState({
        commands,
        commandIds: store.commandIds || this.state.commandIds,
      })
    }
    await loadMessages()
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollIntoView()
    }
  }

  componentWillUnmount() {
  }

  addMessages = newMessages => {
    let {commandIds, commands} = this.state
    let clear = false
    let loadedMessage = undefined
    for (let message of newMessages) {
      const command = commands[message.commandId]
      if (message.type === 'loaded') {
        if (commands[message.commandId]) {
          commands[message.commandId] = {
            ...command,
            messages: command.messages.map(m => this.setLoaded(m)),
          }
        }
      } else if (message.type === 'clear') {
        clear = true
      } else if (message.type === 'set-theme') {
        this.props.onThemeChange(message.theme)
      } else {
        if (commands[message.commandId]) {
          commands[message.commandId] = {...command, messages: [...command.messages, message]}
        } else {
          commands[message.commandId] = {id: message.commandId, messages: [message]}
          commandIds.push(message.commandId)
        }
      }
    }
    if (clear) {
      commands = {}
      commandIds = []
    }
    this.setCommands([...commandIds], {...commands})
    this.scrollToBottom()
  }

  setCommands = (commandIds, commands) => {
    this.setState({commandIds, commands})
    store.commandIds = commandIds
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
    const { text, commandIds, commands } = this.state
    const scrollRef = this.scrollRef
    const messages = []
    for (let commandId of commandIds) {
      const command = commands[commandId]
      for (let message of command ? command.messages : []) {
        messages.push(message)
      }
    }

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
