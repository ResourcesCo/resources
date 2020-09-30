import React, { ReactNode } from 'react'
import clsx from 'clsx'
import { Context } from 'vtv'

interface ActionButtonProps {
  primary: boolean
  children: ReactNode
  context: Context
  [key: string]: any
}

export default React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  function ActionButton(
    { primary = false, children, context: { theme }, ...props },
    ref
  ) {
    return (
      <button ref={ref} className={clsx("vtv--generic-action-button--button", { primary })} {...props}>
        {children}
      </button>
    )
  }
)
