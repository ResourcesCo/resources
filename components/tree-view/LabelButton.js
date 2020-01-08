import { useState } from 'react'

export default ({children, theme, ...props}) => {
  return <div>
    <button className="id" {...props}>{children}</button>
    <style jsx>{`
      button {
        cursor: pointer;
        background-color: ${theme.bubble1};
        border-radius: 9999px;
        outline: none;
        padding: 4px;
        padding: 4px 3px;
      }
    `}</style>
  </div>
}
