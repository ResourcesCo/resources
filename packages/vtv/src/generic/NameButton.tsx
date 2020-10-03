import React from 'react'
import { FunctionComponent, MouseEventHandler } from 'react'
import { Context } from 'vtv'

interface NameButtonProps {
  onClick?: MouseEventHandler
  context: Context
}

const NameButton: FunctionComponent<NameButtonProps> = ({
  children,
  onClick,
  context: { theme },
}) => {
  return (
    <button className="vtv--name-button id" onClick={onClick} tabIndex={-1}>
      {children}
    </button>
  )
}

export default NameButton
