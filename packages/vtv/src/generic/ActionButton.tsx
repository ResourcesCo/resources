import React, { ReactNode } from 'react'
import clsx from 'clsx'
import { Context } from 'vtv'

interface ActionButtonProps {
  primary: boolean
  children: ReactNode
  context: Context
  [key: string]: unknown
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ primary = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx('vtv--generic-action-button--button', { primary })}
        {...props}
      />
    )
  }
)

export default ActionButton
