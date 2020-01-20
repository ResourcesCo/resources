import { useRef } from 'react'
import { getState } from './state'
import { hasChildren } from './analyze'
import useClickOutside from './useClickOutside'
import { Popper } from 'react-popper'

export const MenuItem = ({ onClick, children, theme }) => {
  return (
    <div>
      <button onClick={onClick}>{children}</button>
      <style jsx>{`
        div {
          background: none;
        }
        button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          margin: 0;
          outline: none;
          width: 100%;
          text-align: left;
        }
        button:hover {
          background-color: ${theme.menuHighlight};
        }
      `}</style>
    </div>
  )
}

export default ({ onClose, theme, children }) => {
  const ref = useRef(null)
  useClickOutside(ref, onClose)

  return (
    <Popper placement="bottom-start" modifiers={{ offset: { offset: '8, 3' } }}>
      {({ ref: popperRef, style, placement }) => (
        <div
          className="popper"
          ref={popperRef}
          style={style}
          data-placement={placement}
        >
          <div className="menu" ref={ref}>
            {React.Children.map(children, child => {
              return React.isValidElement(child)
                ? React.cloneElement(child, {
                    onClick: e => {
                      child.props.onClick(e)
                      onClose()
                    },
                    theme,
                  })
                : child
            })}
          </div>
          <style jsx>{`
            .menu {
              background-color: ${theme.menuBackground};
              opacity: 0.95;
              padding: 2px;
              border-radius: 5px;
            }
          `}</style>
        </div>
      )}
    </Popper>
  )
}
