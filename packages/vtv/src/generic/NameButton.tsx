import React from 'react'
import { FunctionComponent, MouseEventHandler, KeyboardEventHandler } from 'react'
import { Context } from 'vtv'

interface NameButtonProps {
  onClick?: MouseEventHandler
  onContextMenu?: MouseEventHandler
  onKeyDown?: KeyboardEventHandler
  context: Context
  children: React.ReactNode
}

const NameButton = React.forwardRef<HTMLButtonElement, NameButtonProps>(({
  children,
  onClick,
  onContextMenu,
  onKeyDown,
  context: { theme },
}, ref) => {
  return (
    <button ref={ref} className="vtv--name-button id" onClick={onClick} onContextMenu={onContextMenu} onKeyDown={onKeyDown} tabIndex={-1}>
      {children}
    </button>
  )
})

export default NameButton
