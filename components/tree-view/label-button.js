import { useState } from 'react'

export default ({children, theme}) => {
  return <div>
    <button className="id">{children}</button>
    <style jsx>{`
      button {
        cursor: pointer;
        background-color: ${theme.bubble1};
        border-radius: 9999px;
        outline: none;
        padding: 3px;
        padding: 4px 12px;
      }
    `}</style>
  </div>
}
