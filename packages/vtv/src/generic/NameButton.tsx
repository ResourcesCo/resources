import React from 'react'
import { FunctionComponent, MouseEventHandler, KeyboardEventHandler } from 'react'
import { Context } from 'vtv'

interface NameButtonProps {
  onClick?: MouseEventHandler
  onContextMenu?: MouseEventHandler
  onKeyUp?: KeyboardEventHandler
  context: Context
}

const NameButton: FunctionComponent<NameButtonProps> = ({
  children,
  onClick,
  onContextMenu,
  onKeyDown,
  context: { theme },
}) => {
  return (
    <button className="vtv--name-button id" onClick={onClick} onContextMenu={onContextMenu} onKeyDown={onKeyDown} tabIndex={-1}>
      {children}
    </button>
  )
}

export default NameButton
