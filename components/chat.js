import { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
import runCommand from './commands'
import Message from './messages/message'
import { urlTracker } from './browser/url-tracker'
import { messageStore } from './browser/message-store'

import TextareaAutosize from 'react-autosize-textarea'

class Chat extends PureComponent {
  state = {
    messages: [],
    currentPageDocs: [],
    text: '',
    url: '',
  }

  constructor(props) {
    super(props)
    this.scrollRef = React.createRef()
  }

  componentDidMount() {
    const loadMessages = async () => {
      await messageStore.load()
      this.setState({messages: messageStore.messages})
    }
    const loadUrl = async () => {
      await urlTracker.load()
      const url = urlTracker.urls[urlTracker.activeTab]
      const currentPageDocs = await runCommand(`docs ${url}`)
      this.setState({url, currentPageDocs})
    }
    loadMessages()
    loadUrl()
  }

  componentWillUnmount() {

  }

  addMessages = newMessages => {
    const {messages} = this.state
    const updatedMessages = [...messages, ...newMessages]
    this.setState({messages: updatedMessages})
    messageStore.messages = updatedMessages
    messageStore.save()
  }

  send = async () => {
    const {text} = this.state
    this.setState({text: ''})
    const newMessages = await runCommand(text)
    this.addMessages(newMessages)
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
    const { text, messages, url, currentPageDocs } = this.state
    const scrollRef = this.scrollRef

    return (
      <div className="chat">
        <div className="messages-pane">
          <div className="messages-scroll">
            <div className="current-page-docs">
              {
                currentPageDocs.map((message, i) => (
                  <div
                    className={`chat-message ${message.type === 'input' ? 'input-message' : 'output-message'}`}
                    key={i}
                  >
                    <Message key={i} {...message} />
                  </div>
                ))
              }
              <div className="the-end" ref={scrollRef}></div>
            </div>
            <div className="messages">
              {
                messages.map((message, i) => (
                  <div
                    className={`chat-message ${message.type === 'input' ? 'input-message' : 'output-message'}`}
                    key={i}
                  >
                    <Message key={i} {...message} />
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
}

export default Chat