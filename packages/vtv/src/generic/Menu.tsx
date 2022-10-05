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
import { Popper, Manager, Reference } from 'react-popper'
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
      <hr className="vtv--menu--separator" />
    </>
  )
}

interface MenuItemProps {
  checked?: boolean
  onClick?: MouseEventHandler
  copyToClipboard?: string
  submenu?: ReactElement
  children: ReactNode
  context?: Context
}

export const MenuItem = React.forwardRef(({
  checked,
  onClick,
  copyToClipboard,
  submenu,
  children,
  context,
}: MenuItemProps, ref) => {
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
            tabIndex={-1}
            className={clsx('vtv--menu--menu-item', { checked })}
            ref={ref}
            onMouseEnter={() => setItemHover(true)}
            onMouseLeave={() => setHoverOff()}
          >
            <button className="vtv--menu--menu-item-button" onClick={onClick}>{children}</button>
            <FontAwesomeIcon icon={faCaretRight} size="sm" />
          </div>
        )}
      </Reference>
      {(itemHover || submenuHover) &&
        React.cloneElement(submenu, {
          onMouseEnter: () => setSubmenuHover(true),
          onMouseLeave: () => setSubmenuHover(false),
          isSubmenu: true,
        })}
    </Manager>
  ) : (
    <div ref={ref} tabIndex={-1} className={clsx('vtv--menu--menu-item', { checked })} onClick={onClick}>
      {copyToClipboard ? (
        <CopyToClipboard text={copyToClipboard}>
          <button className="vtv--menu--menu-item-button">{children}</button>
        </CopyToClipboard>
      ) : (
        <button className="vtv--menu--menu-item-button" onClick={onClick}>{children}</button>
      )}
    </div>
  )
})

const defaultPopperProps = {
  placement: 'bottom-start',
  modifiers: [{ name: 'offset', options: { offset: [8, 3] } }],
}

const submenuPopperProps = {
  placement: 'right-start',
  modifiers: [{ name: 'offset', options: { offset: [0, -3] } }],
}

interface MenuProps {
  onClose?: () => void
  popperProps?: object
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  isSubmenu?: boolean
  children: React.ReactNode
  context: Context
}

const Menu: FunctionComponent<MenuProps> = ({
  onClose,
  popperProps,
  onMouseEnter,
  onMouseLeave,
  isSubmenu = false,
  children,
  context: { theme },
  context,
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

  const onKeyDown = (e) => {
    const code = e.code
    if (code === 'Escape') {
      onClose()
    }
  }

  const sortedMenuItems = placement =>
    (placement || '').startsWith('top-') ? [...menuItems].reverse() : menuItems
  return (
    <Popper {...(popperProps ? popperProps : (isSubmenu ? submenuPopperProps : defaultPopperProps))}>
      {({ ref: popperRef, style, placement }) => (
        <div
          className="vtv--menu--popper"
          ref={popperRef}
          style={style}
          data-placement={placement}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onKeyDown={onKeyDown}
        >
          <div className="vtv--menu--menu" ref={ref}>
            {sortedMenuItems(placement)}
          </div>
        </div>
      )}
    </Popper>
  )
}

export default Menu
