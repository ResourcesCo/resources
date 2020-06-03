import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import useClickOutside from '../util/useClickOutside'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { Popper, Manager, Reference } from 'react-popper'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export function MenuItem({
  checked,
  onClick,
  copyToClipboard,
  children,
  submenu,
  context: { theme },
}) {
  const [itemHover, setItemHover] = useState(false)
  const [submenuHover, setSubmenuHover] = useState(false)
  const setHoverOff = () => {
    setItemHover(false)
    setSubmenuHover(false)
  }
  return submenu ? (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div
            className={clsx('menu-item', { checked })}
            ref={ref}
            onMouseEnter={() => setItemHover(true)}
            onMouseLeave={() => setHoverOff()}
          >
            <button onClick={onClick}>{children}</button>
            <FontAwesomeIcon icon={faCaretRight} size="sm" />
            <style jsx>{`
              div.menu-item {
                background: none;
                display: flex;
                align-items: center;
              }
              div.menu-item button {
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
              div.menu-item {
                padding-right: 3px;
              }
              div.menu-item.checked button {
                font-weight: bold;
              }
            `}</style>
          </div>
        )}
      </Reference>
      {(itemHover || submenuHover) &&
        React.cloneElement(submenu, {
          onMouseEnter: () => setSubmenuHover(true),
          onMouseLeave: () => setSubmenuHover(false),
        })}
    </Manager>
  ) : (
    <div className={clsx('menu-item', { checked })}>
      {copyToClipboard ? (
        <CopyToClipboard text={copyToClipboard} onCopy={onClick}>
          <button>{children}</button>
        </CopyToClipboard>
      ) : (
        <button onClick={onClick}>{children}</button>
      )}
      <style jsx>{`
        div.menu-item {
          background: none;
          display: flex;
          align-items: center;
        }
        div.menu-item button {
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
        div.menu-item {
          padding-right: 3px;
        }
        div.menu-item.checked button {
          font-weight: bold;
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
  context: { theme },
  context,
  children,
  ...props
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
          context,
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
          {...props}
        >
          <div className="menu" ref={ref}>
            {sortedMenuItems(placement)}
          </div>
          <style jsx>{`
            .popper {
              z-index: 10;
            }
            .menu {
              background-color: ${theme.menuBackground};
              opacity: 0.95;
              padding: 2px;
              border-radius: 5px;
              display: flex;
              flex-direction: column;
              align-items: stretch;
            }
          `}</style>
        </div>
      )}
    </Popper>
  )
}
