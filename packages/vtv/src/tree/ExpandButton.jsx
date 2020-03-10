import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'

export default ({ onClick, expanded, hasChildren, theme }) => (
  <div className={expanded ? 'expanded' : ''}>
    <button
      onClick={onClick}
      className={hasChildren ? '' : 'invisible'}
      tabIndex="-1"
    >
      <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretRight} size="xs" />
    </button>
    <style jsx>{`
      button {
        outline: none;
        border: none;
        cursor: pointer;
        margin: 0;
        margin-top: -2px;
        font-size: 1.5em;
        text-align: left;
        padding: 0 0 0 10px;
        width: 22px;
        background: none;
        color: ${theme.foreground};
      }
      .expanded button {
        padding: 0 0 0 8px;
      }
      .invisible {
        visibility: hidden;
      }
    `}</style>
  </div>
)
