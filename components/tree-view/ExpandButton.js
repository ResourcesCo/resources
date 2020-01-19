import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({onClick, expanded, hasChildren}) => (
  <div>
    <button onClick={onClick} className={hasChildren ? '' : 'invisible'}>
      <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretRight} size="xs" />
    </button>
    <style jsx>{`
      button {
        outline: none;
        border: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
        margin-top: -2px;
        font-size: 1.5em;
        min-width: 20px;
        background: none;
      }
      .invisible {
        visibility: hidden
      }
    `}</style>
  </div>
)
