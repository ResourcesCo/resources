import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'

export default function ExpandButton({
  onClick,
  expanded,
  disabled,
  context: { theme },
}) {
  return (
    <div className={clsx('vtv--expand-button', {expanded})}>
      <button
        onClick={onClick}
        className={clsx({ invisible: disabled })}
        tabIndex={-1}
      >
        <FontAwesomeIcon
          icon={expanded ? faCaretDown : faCaretRight}
          size="xs"
        />
      </button>
    </div>
  )
}
