import React, {
  useState,
  useRef,
  MouseEventHandler,
  MouseEvent,
  ReactNode,
  FunctionComponent,
  ReactElement,
} from 'react'
import clsx from 'clsx'
import useClickOutside from '../util/useClickOutside'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { Popper, Manager, Reference, PopperProps } from 'react-popper'
import CopyToClipboard from 'react-copy-to-clipboard'
import chroma from 'chroma-js'
import { Context } from 'vtv'

export function Separator({ context }: { context?: Context }) {
  // context will be passed in by Menu
  if (!context) {
    return null
  }
  const { theme } = context

  const color = chroma(theme.foreground)
    .alpha(0.4)
    .hex()
  return (
    <>
      <hr />
      <style jsx>{`
        hr {
          border: none;
          height: 2px;
          background-color: ${color};
        }
      `}</style>
    </>
  )
}

interface MenuItemProps {
  checked?: boolean
  onClick?: MouseEventHandler
  copyToClipboard?: string
  children: ReactNode
  submenu?: ReactElement
  context?: Context
}

export function MenuItem({
  checked,
  onClick,
  copyToClipboard,
  children,
  submenu,
  context,
}: MenuItemProps) {
  const [itemHover, setItemHover] = useState(false)
  const [submenuHover, setSubmenuHover] = useState(false)
  const setHoverOff = () => {
    setItemHover(false)
    setSubmenuHover(false)
  }

  // the context is added by <Menu>
  if (!context) return null
  const { theme } = context

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
    <div className={clsx('menu-item', { checked })} onClick={onClick}>
      {copyToClipboard ? (
        <CopyToClipboard text={copyToClipboard}>
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
  modifiers: [{ name: 'offset', options: { offset: [8, 3] } }],
}

interface MenuProps {
  onClose?: () => void
  popperProps?: object
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  children: React.ReactNode
  context: Context
}

const Menu: FunctionComponent<MenuProps> = ({
  onClose,
  popperProps = defaultPopperProps,
  context: { theme },
  context,
  children,
  onMouseEnter,
  onMouseLeave,
}: MenuProps) => {
  const ref = useRef(null)
  useClickOutside(ref, onClose)

  const menuItems = React.Children.map(children, child => {
    return React.isValidElement(child)
      ? React.cloneElement(child, {
          onClick(e: MouseEvent) {
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
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
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

export default Menu
