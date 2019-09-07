import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
import TextareaAutosize from 'react-autosize-textarea'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({onFocusChange, text, onTextChange, onSend}) => {
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
        onKeyPress={handleKeyPress}
        autoFocus
      />
      <button onClick={onSend}><span className="rocket"><FontAwesomeIcon icon={faSpaceShuttle} /></span></button>
      <style jsx>{`
        .chat-input {
          display: flex;
          flex-direction: row;
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
