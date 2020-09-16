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
    <button className="id" onClick={onClick} tabIndex={-1}>
      {children}
      <style jsx>{`
        button {
          cursor: pointer;
          background-color: ${theme.bubble1};
          color: ${theme.foreground};
          font-family: ${theme.fontFamily};
          border-radius: 9999px;
          outline: none;
          padding: 3px 7px;
          font-size: inherit;
          border: 0;
        }
      `}</style>
    </button>
  )
}

export default NameButton
