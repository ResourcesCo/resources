import { useRef } from 'react'
import { getState } from './state'
import { hasChildren } from './analyze'
import useClickOutside from './useClickOutside'

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

  return <div className="outer" ref={ref}>
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
        position: relative;
        left: 0;
        top: 0;
      }
      .inner {
        position: absolute;
        top: 100%;
        top: calc(100% + 5px);
        left: 12px;
        width: 5cm;
        background-color: ${theme.menuBackground};
        padding: 0 5px;
        border-radius: 5px;
      }
    `}</style>
  </div>
}
