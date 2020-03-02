import React from 'react'

export default ({ primary = false, children, theme, ...props }) => (
  <button
    className={`${primary ? 'primary' : ''} ${primary ? 'primary' : ''}`}
    {...props}
  >
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
