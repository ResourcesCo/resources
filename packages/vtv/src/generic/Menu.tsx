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
import findNode from '../util/findNode'
import { MENU_CLASS, MENU_ITEM_CLASS } from '../util/constants'

export function Separator({ context }: { context?: Context }) {
  return (
    <>
      <div className="vtv--menu--separator" />
    </>
  )
}

function findMenuItem(target: Element): Element | undefined {
  const menuItem = target.closest(`.${MENU_ITEM_CLASS}`)
  const menu = target.closest(`.${MENU_CLASS}`)
  if (menuItem instanceof Element && !(menu instanceof Element && !menu.contains(menuItem))) {
    return menuItem
  }
}

interface MenuItemProps {
  checked?: boolean
  onClick?: MouseEventHandler
  copyToClipboard?: string
  submenu?: ReactElement
  children: ReactNode
  context?: Context
  onClose?: () => void
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(({
  checked,
  onClick,
  copyToClipboard,
  submenu,
  children,
  context,
}, ref) => {
  const [itemHover, setItemHover] = useState(false)
  const [submenuHover, setSubmenuHover] = useState(false)
  const [mouseMoved, setMouseMoved] = useState(false)
  const setHoverOff = () => {
    setItemHover(false)
    setSubmenuHover(false)
  }

  // the context is added by <Menu>
  if (!context) return null
  const { theme } = context

  const onMouseEnter = ({target}: React.MouseEvent<HTMLDivElement>) => {
    if (target instanceof HTMLElement) {
      const menuItem = findMenuItem(target)
      if (mouseMoved && menuItem instanceof HTMLDivElement) {
        menuItem.focus()
      }
      setItemHover(true)
    }
  }

  const onMouseMove = ({target}: React.MouseEvent<HTMLDivElement>) => {
    if (target instanceof Element) {
      const menuItem = findMenuItem(target)
      if (menuItem instanceof HTMLDivElement) {
        menuItem.focus()
      }
      setItemHover(true)
      setMouseMoved(true)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    
  }

  return submenu ? (
    <Manager>
      <Reference>
        {({ ref }) => {
          return <div
            tabIndex={-1}
            className={clsx('vtv--menu--menu-item', { checked })}
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onMouseLeave={() => { setHoverOff() }}
            onKeyDown={onKeyDown}
          >
            <button className="vtv--menu--menu-item-button" onClick={onClick}>{children}</button>
            <FontAwesomeIcon icon={faCaretRight} size="sm" />
            {
              ((mouseMoved && (itemHover || submenuHover)) &&
                React.cloneElement(submenu, {
                  onMouseEnter: () => { setSubmenuHover(true); setItemHover(false); },
                  onMouseLeave: ({target, relatedTarget}) => {
                    setSubmenuHover(false)
                    setItemHover(true)
                  },
                  isSubmenu: true,
                })
              )
            }
          </div>
        }}
      </Reference>
    </Manager>
  ) : (
    <div
      ref={ref}
      tabIndex={-1}
      className={clsx('vtv--menu--menu-item', { checked })}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onClick={onClick}
    >
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
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, onClose)

  const menuItems = React.Children.map(children, child => {
    return React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<any>, {
          onClick(e: MouseEvent) {
            child.props.onClick(e)
            onClose()
          },
          context,
        })
      : child
  })

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const code = e.code
    const target = e.target
    if (target instanceof HTMLElement) {
      if (code === 'Escape') {
        onClose()
      } else if (code === 'ArrowUp' || code === 'ArrowDown') {
        const nextNode = findNode(ref.current, target, code, `.${MENU_ITEM_CLASS}`, `.${MENU_CLASS}`)
        if (nextNode instanceof HTMLElement) {
          nextNode.focus()
        }
      }
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
