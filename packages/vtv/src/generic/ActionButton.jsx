import React from 'react'
import clsx from 'clsx'

export default React.forwardRef(
  ({ primary = false, children, theme, ...props }, ref) => (
    <button ref={ref} className={clsx({ primary })} {...props}>
      {children}
      <style jsx>{`
        button {
          cursor: pointer;
          color: ${theme.actionTextColor};
          background-color: ${theme.actionColor};
          border-radius: 9999px;
          outline: none;
          padding: 4px 7px;
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
)
