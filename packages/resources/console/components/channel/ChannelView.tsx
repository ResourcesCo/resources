import React, { PureComponent, FocusEventHandler, ComponentType } from 'react'
import Head from 'next/head'
import insertTextAtCursor from 'insert-text-at-cursor'
import { pick, pickBy, identity, get as getNested } from 'lodash-es'
import { parseCommand, updateTree, removeTemporaryState } from 'vtv-model'
import Message from '../messages/Message'
import ChannelInput, { ChannelInputMethods } from './ChannelInput'
import { Theme } from 'vtv'
import ConsoleCommand from 'api/channel/ConsoleCommand'
import ConsoleChannel from 'api/channel/ConsoleChannel'
import { MemoryStore, LocalStorageStore } from '../../store'

interface MessageListProps {
  commands: { [key: string]: ConsoleCommand }
  commandIds: string[]
  lastCommandId?: string
  scrollRef: React.Ref<HTMLDivElement>
  onPickId
  onSubmitForm
  onMessage
  theme
}

class MessageList extends PureComponent<MessageListProps> {
  render() {
    const {
      commands,
      commandIds,
      lastCommandId,
      scrollRef,
      onPickId,
      onSubmitForm,
      onMessage,
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
            .filter((m) => typeof m === 'object' && !!m)
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
            overflow-y: scroll;
            overflow-x: auto;
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

interface ChannelViewProps {
  onFocusChange?: FocusEventHandler
  theme: Theme
  onThemeChange: Function
  channel: ConsoleChannel
  store: MemoryStore | LocalStorageStore
}

interface ChannelViewState {
  commandIds: string[]
  commands: { [key: string]: ConsoleCommand }
  lastCommandId?: string
}

export default class ChannelView extends PureComponent<
  ChannelViewProps,
  ChannelViewState
> {
  scrollRef: React.RefObject<HTMLDivElement>
  channelInputRef: React.RefObject<ChannelInputMethods>

  constructor(props) {
    super(props)
    this.state = {
      commandIds: props.channel.messageIds,
      commands: props.channel.messages,
      lastCommandId: undefined,
    }
    this.scrollRef = React.createRef()
    this.channelInputRef = React.createRef()
  }

  setCommandLoading(c, loading) {
    return {
      ...c,
      messages: c.messages.map((m) => this.setLoading(m, loading)),
    }
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

  addMessages = (messageOrArray) => {
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
            messages: command.messages.map((m) => this.setLoading(m, false)),
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
          (message) => message.type === 'tree'
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
            .map((m) => this.setLoading(m, Boolean(message.loading)))
            .map((message) =>
              message.type === 'tree' ? updatedTreeMessage : message
            ),
        }
      } else if (message.type === 'form-status') {
        const formCommand = commands[message.parentCommandId]
        if (formCommand) {
          let commandMessages = formCommand.messages
            .map((m) => this.setLoading(m, !!message.loading))
            .filter(({ type }) => type !== 'form-status')
          const formStatusMessage = {
            ...message,
            commandId: message.parentCommandId,
          }
          commands[formStatusMessage.commandId] = {
            ...formCommand,
            messages: [...commandMessages, formStatusMessage],
          }
        }
        scrollToBottom = false
      } else {
        let newMessage = message
        if (message.type === 'message-get') {
          const treeCommand = commands[message.parentCommandId]
          const treeMessage = treeCommand.messages.find(
            (message) => message.type === 'tree'
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

  send = (message) => {
    const { channel } = this.props
    const parsed = parseCommand(message)
    if (Array.isArray(parsed) && parsed.length) {
      channel.runCommand({
        message,
        parsed,
        onMessage: this.addMessages,
      })
      return true
    }
    return false
  }

  scrollToBottom = () => {
    setTimeout(() => {
      if (this.scrollRef.current) {
        this.scrollRef.current.scrollIntoView()
      }
    }, 10)
  }

  handlePickId = (text) => {
    // TODO: insert text
    // const el = this.textareaRef.current
    // insertTextAtCursor(el, `${id}`)
    // el.focus()
    this.channelInputRef.current.insertAction(text)
  }

  handleSubmitForm = async ({ commandId, formData, message }) => {
    const { channel } = this.props
    const { commands } = this.state
    const parentMessage = (
      getNested(commands, [commandId, 'messages']) || []
    ).filter((message) => message.type === 'tree')[0]
    const parsed = parseCommand(message)
    await channel.runCommand({
      message,
      parsed,
      onMessage: this.addMessages,
      parentMessageId: commandId,
      parentMessage,
      formData,
    })
  }

  handleAddMessage = (message) => {
    this.addMessages([message])
  }

  getHistory = (position: number): string | undefined => {
    let n = position
    for (let i=this.state.commandIds.length - 1; i >= 0; i--) {
      const messages = (this.state.commands[this.state.commandIds[i]] || {}).messages || []
      for (let j=messages.length - 1; j >= 0; j--) {
        if (messages[j].type === 'input') {
          if (n === 0) {
            return messages[j].text
          } else {
            n -= 1
          }
        }
      }
    }
  }

  render() {
    const { onFocusChange, channel, theme } = this.props
    const { commandIds, commands, lastCommandId } = this.state
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
          theme={theme}
        />
        <div className="channel-input-wrapper">
          <ChannelInput
            ref={this.channelInputRef}
            onFocusChange={onFocusChange}
            onSend={this.send}
            getHistory={this.getHistory}
            channel={channel}
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

        `}</style>
        <Head>
          <style type="text/css" key="customScrollbars">{`
            div {
              scrollbar-width: thin;
              scrollbar-color: ${theme.dark ? '#333' : '#ccc'} ${
            theme.background
          } !important;
            }
            div::-webkit-scrollbar {
              width: 11px;
              height: 11px;
            }
            div::-webkit-scrollbar-track, div::-webkit-scrollbar-corner {
              background: ${theme.background};
            }
            div::-webkit-scrollbar-thumb {
              background-color: ${theme.dark ? '#333' : '#ccc'};
              border-radius: 1000px;
              border: 2px solid ${theme.background};
            }
          `}</style>
        </Head>
      </div>
    )
  }
}
