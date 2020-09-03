import React, {
  useEffect,
  FunctionComponent,
  ChangeEventHandler,
  MouseEventHandler,
  EventHandler,
} from 'react'
import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
import TextareaAutosize from 'react-autosize-textarea'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Theme } from 'vtv'

interface ChannelInputProps {
  text: string
  onFocusChange: Function
  onTextChange: ChangeEventHandler<HTMLTextAreaElement>
  onSend: Function
  textareaRef: React.RefObject<HTMLTextAreaElement>
  theme: Theme
}

const ChannelInput: FunctionComponent<ChannelInputProps> = ({
  text,
  onFocusChange,
  onTextChange,
  onSend,
  textareaRef,
  theme,
}) => {
  const handleKeyPress = e => {
    if (e.key == 'Enter' && e.shiftKey == false) {
      e.preventDefault()
      onSend()
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [textareaRef])

  const handleFocusChange = focused => {
    if (onFocusChange) {
      onFocusChange(focused)
    }
  }

  const handlePaste = e => {
    try {
      const data = e.clipboardData.getData('text/plain')
      if (data.length > 2000) {
        e.preventDefault()
        onSend(data)
      }
    } catch (err) {
      // ignore error
    }
  }

  return (
    <div className="chat-input">
      <TextareaAutosize
        placeholder=">"
        value={text}
        onChange={onTextChange}
        onKeyDown={handleKeyPress}
        onFocus={() => handleFocusChange(true)}
        onBlur={() => handleFocusChange(false)}
        onPaste={handlePaste}
        ref={textareaRef}
        maxRows={8}
        autoCorrect="off"
        autoCapitalize="none"
      />
      <button onClick={e => onSend()}>
        <span className="rocket">
          <FontAwesomeIcon icon={faSpaceShuttle} />
        </span>
      </button>
      <style jsx>{`
        .chat-input {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        div :global(textarea) {
          flex-grow: 1;
          background: none;
          width: 100%;
          border-radius: 5px;
          outline: none;
          font-size: 18px;
          line-height: 1.2;
          padding: 5px 5px;
          resize: none;
          border: 1px solid ${theme.inputBorder};
          color: ${theme.foreground};
          font-family: ${theme.fontFamily};
        }

        button {
          background: none;
          outline: none;
          border: none;
          padding: 0 2px 0 5px;
          color: ${theme.foreground};
          cursor: pointer;
          font-size: 28px;
          line-height: 1.2;
        }
      `}</style>
    </div>
  )
}

export default ChannelInput
