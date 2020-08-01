import React, { PureComponent } from 'react'
import insertTextAtCursor from 'insert-text-at-cursor'
import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import getNested from 'lodash/get'
import {
  parseCommand,
  updateTree,
  removeTemporaryState,
} from '../../../vtv-model'
import Message from '../messages/Message'
import ChannelInput from './ChannelInput'

class MessageList extends PureComponent {
  render() {
    const {
      commands,
      commandIds,
      lastCommandId,
      scrollRef,
      onPickId,
      onSubmitForm,
      onMessage,
      codeMirrorComponent,
      theme,
    } = this.props

    const messages = []
    for (let commandId of commandIds) {
      const command = commands[commandId]
      for (let message of command ? command.messages : []) {
        messages.push(message)
      }
    }

    return (
      <div className="messages-scroll">
        <div className="messages">
          {messages
            .filter(m => typeof m === 'object' && !!m)
            .map((message, i) => (
              <div
                className={`chat-message ${
                  message.type === 'input' ? 'input-message' : 'output-message'
                }`}
                key={i}
              >
                <Message
                  key={i}
                  theme={theme}
                  codeMirrorComponent={codeMirrorComponent}
                  onPickId={onPickId}
                  onSubmitForm={onSubmitForm}
                  onMessage={onMessage}
                  isNew={message.commandId === lastCommandId}
                  {...message}
                />
              </div>
            ))}
          <div className="the-end" ref={scrollRef}></div>
        </div>
        <style jsx>{`
          .messages-scroll {
            flex-grow: 1;
            overflow: scroll;
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

export default class ChannelView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      commandIds: props.channel.messageIds,
      commands: props.channel.messages,
      text: '',
      lastCommandId: null,
    }
    this.scrollRef = React.createRef()
    this.textareaRef = React.createRef()
  }

  setCommandLoading(c, loading) {
    return { ...c, messages: c.messages.map(m => this.setLoading(m, loading)) }
  }

  setLoading(m, loading) {
    return m.type === 'input' ? { ...m, loading } : m
  }

  removeTemporaryCommandState(command) {
    if (command.type === 'tree') {
      return removeTemporaryState(command)
    } else {
      return command
    }
  }

  async componentDidMount() {
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollIntoView()
    }
  }

  componentWillUnmount() {}

  addMessages = messageOrArray => {
    const { store } = this.props
    let { commandIds, commands } = this.state
    let clear = false
    let loadedMessage = undefined
    let scrollToBottom = false
    const newMessages = Array.isArray(messageOrArray)
      ? messageOrArray
      : [messageOrArray]
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

  setMessageState({ messageIds, messages }) {
    const { channel } = this.props
    this.setState({ commandIds: messageIds, commands: messages })
    if (channel) {
      channel.messageIds = messageIds
      channel.messages = messages
      channel.saveMessages()
    }
  }

  setCommands = (commandIds, commands) => {
    this.setMessageState({ messageIds: commandIds, messages: commands })
  }

  send = async () => {
    const { channel } = this.props
    const { text: message } = this.state
    const parsed = parseCommand(message)
    if (Array.isArray(parsed) && parsed.length) {
      this.setState({ text: '' })
      await channel.runCommand({
        message,
        parsed,
        onMessage: this.addMessages,
      })
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
    const { channel } = this.props
    const { commands } = this.state
    const parentMessage = (
      getNested(commands, [commandId, 'messages']) || []
    ).filter(message => message.type === 'tree')[0]
    const parsed = parseCommand(message)
    await channel.runCommand({
      message,
      parsed,
      onMessage: this.addMessages,
      parentMessageId: parentCommandId,
      parentMessage,
      formData,
    })
  }

  handleAddMessage = message => {
    this.addMessages([message])
  }

  render() {
    const { onFocusChange, codeMirrorComponent, theme } = this.props
    const { text, commandIds, commands, lastCommandId } = this.state
    const scrollRef = this.scrollRef

    return (
      <div className="chat">
        <MessageList
          commands={commands}
          commandIds={commandIds}
          lastCommandId={lastCommandId}
          scrollRef={scrollRef}
          onPickId={this.handlePickId}
          onSubmitForm={this.handleSubmitForm}
          onMessage={this.handleAddMessage}
          codeMirrorComponent={codeMirrorComponent}
          theme={theme}
        />
        <div className="channel-input-wrapper">
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
            align-items: stretch;
            height: 100%;
            box-sizing: border-box;
            flex-grow: 1;
            background-color: ${theme.background};
            color: ${theme.foreground};
            font-family: ${theme.fontFamily};
            font-size: 80%;
            padding: 3px;
          }

          .chat :global(::selection) {
            color: ${theme.selectionColor};
            background: ${theme.selectionBackground};
          }
        `}</style>
      </div>
    )
  }
}
