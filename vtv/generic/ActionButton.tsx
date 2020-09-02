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
      <button ref={ref} className={clsx({ primary })} {...props}>
        {children}
        <style jsx>{`
          button {
            cursor: pointer;
            color: ${theme.actionTextColor};
            background-color: ${theme.actionColor};
            border-radius: 9999px;
            outline: none;
            padding: 3px 7px;
            font-size: inherit;
            border: 0;
          }

          button.primary {
            background-color: ${theme.primaryActionColor};
          }

          button:disabled,
          button.primary:disabled {
            color: ${theme.disabledActionTextColor};
            background-color: ${theme.disabledActionColor};
          }
        `}</style>
      </button>
    )
  }
)
