import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
import TextareaAutosize from 'react-autosize-textarea'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({onFocusChange, text, onTextChange, onSend, textareaRef}) => {
  const handleKeyPress = e => {
    if (e.which == 13 && e.shiftKey == false) {
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
        }

        div :global(textarea) {
          width: 100%;
          border-radius: 5px;
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
