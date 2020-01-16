import { useRef } from 'react'
import { getState } from './state'
import { hasChildren } from './analyze'
import useClickOutside from './useClickOutside'
import { Popper } from 'react-popper'

export const MenuItem = ({ onClick, children }) => {
  return <div>
    <button onClick={onClick}>{children}</button>
    <style jsx>{`
      div {
        background: none;
      }
      button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0 0 8px;
        margin: 0;
        outline: none;
      }
    `}</style>
  </div>
}

export default ({ onClose, theme, children }) => {
  const ref = useRef(null)
  useClickOutside(ref, onClose)

  return (
    <div className="outer" ref={ref}>
      <div className="inner">
        {
          React.Children.map(children, child => {
            return React.isValidElement(child) ? React.cloneElement(child, {
              onClick: e => {
                child.props.onClick(e)
                onClose()
              }
            }) : child
          })
        }
      </div>
      <style jsx>{`
        div {
          background: none;
        }
        .outer {
          background: none;
        }
        .inner {
          width: 3cm;
          background-color: ${theme.menuBackground};
          opacity: .95;
          padding: 0 5px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  )
}
