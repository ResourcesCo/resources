import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
import TextareaAutosize from 'react-autosize-textarea'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({
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

  return (
    <div className="chat-input">
      <TextareaAutosize
        placeholder=">"
        value={text}
        onChange={onTextChange}
        onKeyDown={handleKeyPress}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        autoFocus
        ref={textareaRef}
        maxRows={8}
        autoCorrect="off"
        autoCapitalize="none"
        autoFocus
      />
      <button onClick={onSend}>
        <span className="rocket">
          <FontAwesomeIcon icon={faSpaceShuttle} />
        </span>
      </button>
      <style jsx>{`
        .chat-input {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin: 0 1px 0 3px;
        }

        div :global(textarea) {
          background: none;
          width: 100%;
          border-radius: 5px;
          outline: none;
          font-size: 20px;
          line-height: 28px;
          padding: 2px 5px;
          height: 32px;
          resize: none;
          border: 1px solid ${theme.inputBorder};
        }

        button {
          background: none;
          outline: none;
          border: none;
          padding: 0 5px;
          font-size: 32px;
        }

        button :global(svg) {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
