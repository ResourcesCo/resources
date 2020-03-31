import React, { useRef } from 'react'
import { getState } from '../model/state'
import { hasChildren } from '../model/analyze'
import useClickOutside from '../util/useClickOutside'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { Popper } from 'react-popper'

export function MenuItem({ onClick, children, submenu, theme }) {
  return (
    <div className="menu-item">
      <button onClick={onClick}>{children}</button>
      {submenu && <FontAwesomeIcon icon={faCaretRight} size="md" />}
      <style jsx>{`
        div.menu-item {
          background: none;
          display: flex;
          align-items: center;
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
          color: ${theme.foreground};
          font-family: ${theme.fontFamily};
        }
        div.menu-item:hover {
          background-color: ${theme.menuHighlight};
        }
        div.menu-item :global(svg) {
          padding-right: 3px;
        }
      `}</style>
    </div>
  )
}

const defaultPopperProps = {
  placement: 'bottom-start',
  modifiers: { offset: { offset: '8, 3' } },
}

export default ({
  onClose,
  popperProps = defaultPopperProps,
  theme,
  children,
}) => {
  const ref = useRef(null)
  useClickOutside(ref, onClose)

  const menuItems = React.Children.map(children, child => {
    return React.isValidElement(child)
      ? React.cloneElement(child, {
          onClick: e => {
            child.props.onClick(e)
            onClose()
          },
          theme,
        })
      : child
  })

  const sortedMenuItems = placement =>
    (placement || '').startsWith('top-') ? [...menuItems].reverse() : menuItems

  return (
    <Popper {...popperProps}>
      {({ ref: popperRef, style, placement }) => (
        <div
          className="popper"
          ref={popperRef}
          style={style}
          data-placement={placement}
        >
          <div className="menu" ref={ref}>
            {sortedMenuItems(placement)}
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
