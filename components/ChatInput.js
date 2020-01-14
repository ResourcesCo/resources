import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
import TextareaAutosize from 'react-autosize-textarea'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({onFocusChange, text, onTextChange, onSend, textareaRef, theme}) => {
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
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        onKeyDown={handleKeyPress}
        autoFocus
        ref={textareaRef}
      />
      <button onClick={onSend}><span className="rocket"><FontAwesomeIcon icon={faSpaceShuttle} /></span></button>
      <style jsx>{`
        .chat-input {
          display: flex;
          flex-direction: row;
          margin: 0 1px 0 3px;
        }

        div :global(textarea) {
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
