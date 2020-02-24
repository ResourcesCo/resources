import { PureComponent } from 'react'
import runCommand from '../../command-runner'
import { parseCommand, updateTree } from 'vtv'
import Message from '../messages/Message'
import { store } from '../../store'
import ChannelInput from './ChannelInput'
import Nav from './Nav'
import insertTextAtCursor from 'insert-text-at-cursor'
import { Manager } from 'react-popper'
import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import getNested from 'lodash/get'

class Chat extends PureComponent {
  state = {
    commandIds: [],
    commands: {},
    text: '',
    lastCommandId: null,
  }

  constructor(props) {
    super(props)
    this.scrollRef = React.createRef()
    this.textareaRef = React.createRef()
  }

  setCommandLoading(c, loading) {
    return { ...c, messages: c.messages.map(m => this.setLoading(m, loading)) }
  }

  setLoading(m, loading) {
    return m.type === 'input' ? { ...m, loading } : m
  }

  async componentDidMount() {
    const loadMessages = async () => {
      await store.load()
      const commands = { ...store.commands }
      for (let key of Object.keys(commands)) {
        commands[key] = this.setCommandLoading(commands[key], false)
      }
      this.setState({
        commands,
        commandIds: store.commandIds || this.state.commandIds,
      })
      // this.setState({
      //   commands: {},
      //   commandIds: [],
      // })
      this.props.onThemeChange(store.theme)
    }
    await loadMessages()
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollIntoView()
    }
  }

  componentWillUnmount() {}

  addMessages = newMessages => {
    let { commandIds, commands } = this.state
    let clear = false
    let loadedMessage = undefined
    let scrollToBottom = false
    for (let message of newMessages) {
      const command = commands[message.commandId]
      if (message.type === 'loaded') {
        if (commands[message.commandId]) {
          commands[message.commandId] = {
            ...command,
            messages: command.messages.map(m => this.setLoading(m, false)),
          }
        }
      } else if (message.type === 'clear') {
        clear = true
      } else if (message.type === 'set-theme') {
        this.setState({ theme: message.theme })
        store.theme = message.theme
        store.save()
        this.props.onThemeChange(message.theme)
      } else if (['tree-update', 'message-command'].includes(message.type)) {
        scrollToBottom = false
        const treeCommand = commands[message.parentCommandId]
        const treeMessage = treeCommand.messages.find(
          message => message.type === 'tree'
        )
        let updates
        if (message.type === 'tree-update') {
          updates = message
        } else if (message.type === 'message-command') {
          const {
            type: __type,
            commandId: __commandId,
            ...treeUpdates
          } = message
          updates = updateTree(
            pick(treeMessage, ['name', 'value', 'state']),
            treeUpdates
          )
        }
        const updatedTreeMessage = {
          ...treeMessage,
          ...pickBy(pick(updates, ['name', 'value', 'state']), identity),
        }
        commands[message.parentCommandId] = {
          ...treeCommand,
          messages: treeCommand.messages
            .map(m => this.setLoading(m, !!message.loading))
            .map(message =>
              message.type === 'tree' ? updatedTreeMessage : message
            ),
        }
      } else if (message.type === 'form-status') {
        const formCommand = commands[message.parentCommandId]
        if (formCommand) {
          let commandMessages = formCommand.messages
            .map(m => this.setLoading(m, !!message.loading))
            .filter(({ type }) => type !== 'form-status')
          if (message.success) {
            commandMessages = commandMessages.filter(
              ({ type }) => type !== 'form'
            )
          }
          const formStatusMessage = {
            ...message,
            commandId: message.parentCommandId,
          }
          commands[formStatusMessage.commandId] = {
            ...formCommand,
            messages: [...commandMessages, formStatusMessage],
          }
        }
        scrollToBottom = true
      } else {
        let newMessage = message
        if (message.type === 'message-get') {
          const treeCommand = commands[message.parentCommandId]
          const treeMessage = treeCommand.messages.find(
            message => message.type === 'tree'
          )
          newMessage = {
            ...message,
            type: 'tree',
            name: message.path[message.path.length - 1] || 'value',
            value: getNested(treeMessage.value, message.path),
          }
        }
        if (commands[message.commandId]) {
          commands[message.commandId] = {
            ...command,
            messages: [...command.messages, newMessage],
          }
        } else {
          commands[message.commandId] = {
            id: message.commandId,
            messages: [newMessage],
          }
          commandIds.push(message.commandId)
        }
        if (message.type !== 'input') {
          scrollToBottom = true
        }
      }
      this.setState({ lastCommandId: message.commandId })
    }
    if (clear) {
      commands = {}
      commandIds = []
    }
    this.setCommands([...commandIds], { ...commands })
    if (scrollToBottom) {
      this.scrollToBottom()
    }
  }

  setCommands = (commandIds, commands) => {
    this.setState({ commandIds, commands })
    store.commandIds = commandIds
    store.commands = commands
    store.save()
  }

  send = async () => {
    const { text } = this.state
    const parsed = parseCommand(text)
    if (Array.isArray(parsed) && parsed.length) {
      this.setState({ text: '' })
      await runCommand(text, parsed, this.addMessages)
    }
  }

  scrollToBottom = () => {
    setTimeout(() => {
      if (this.scrollRef.current) {
        this.scrollRef.current.scrollIntoView()
      }
    }, 10)
  }

  handleTextChange = ({ target }) => {
    this.setState({ text: target.value })
  }

  handlePickId = id => {
    const el = this.textareaRef.current
    insertTextAtCursor(el, `${id}`)
    el.focus()
  }

  handleSubmitForm = async ({ commandId, formData, message }) => {
    const { commands } = this.state
    const parentMessage = (
      getNested(commands, [commandId, 'messages']) || []
    ).filter(message => message.type === 'tree')[0]
    await runCommand(message, parseCommand(message), this.addMessages, {
      formData,
      parentCommandId: commandId,
      parentMessage,
    })
  }

  handleSelectExample = example => {
    this.setState({ text: example })
    if (this.textareaRef.current) {
      this.textareaRef.current.focus()
    }
  }

  render() {
    const { onFocusChange, theme } = this.props
    const { text, commandIds, commands, lastCommandId } = this.state
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
        <div className="nav">
          <Nav onSelectExample={this.handleSelectExample} />
        </div>
        <div className="messages-scroll">
          <div className="messages">
            {messages
              .filter(m => typeof m === 'object' && !!m)
              .map((message, i) => (
                <div
                  className={`chat-message ${
                    message.type === 'input'
                      ? 'input-message'
                      : 'output-message'
                  }`}
                  key={i}
                >
                  <Message
                    key={i}
                    onLoad={this.scrollToBottom}
                    theme={theme}
                    onPickId={this.handlePickId}
                    onSubmitForm={this.handleSubmitForm}
                    onMessage={message => this.addMessages([message])}
                    isNew={message.commandId === lastCommandId}
                    {...message}
                  />
                </div>
              ))}
            <div className="the-end" ref={scrollRef}></div>
          </div>
        </div>
        <div className="chat-input">
          <ChannelInput
            textareaRef={this.textareaRef}
            text={text}
            onTextChange={this.handleTextChange}
            onFocusChange={onFocusChange}
            onSend={this.send}
            theme={theme}
          />
        </div>
        <style jsx>{`
          .chat {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            height: 100vh;
            flex-grow: 1;
          }

          .messages-scroll {
            flex-grow: 1;
            overflow: scroll;
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
