import React, {
  useState,
  useRef,
  useEffect,
  MouseEventHandler,
  MouseEvent,
  FocusEventHandler,
  ReactNode,
  FunctionComponent,
  ReactElement,
  KeyboardEventHandler,
} from 'react'
import clsx from 'clsx'
import useClickOutside from '../util/useClickOutside'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { Popper, Manager, Reference } from 'react-popper'
import CopyToClipboard from 'react-copy-to-clipboard'
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
  onClick?: (event: MouseEvent | undefined) => void
  copyToClipboard?: string
  submenu?: ReactElement
  autoFocus?: boolean
  children: ReactNode
  context?: Context
  onClose?: () => void
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(({
  checked,
  onClick,
  copyToClipboard,
  submenu,
  autoFocus = false,
  children,
  context,
}, ref) => {
  const buttonRef = useRef<HTMLButtonElement>()
  const [itemHover, setItemHover] = useState(false)
  const [submenuHover, setSubmenuHover] = useState(false)
  const [mouseMoved, setMouseMoved] = useState(false)
  const [keyOpen, setKeyOpen] = useState(false)
  const setHoverOff = () => {
    setItemHover(false)
    setSubmenuHover(false)
  }
  useEffect(() => {
    if (autoFocus && buttonRef.current) {
      const menuItem = buttonRef.current.closest(`.${MENU_ITEM_CLASS}`)
      if (menuItem instanceof HTMLElement) {
        menuItem.focus()
      }
    }
  }, [autoFocus, buttonRef.current])

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
      setKeyOpen(false)
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
      setKeyOpen(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (submenu && (e.code === 'ArrowRight' || e.code === 'Enter')) {
      setItemHover(true)
      setKeyOpen(true)
    } else if (!submenu && e.code === 'Enter') {
      onClick(undefined)
      e.preventDefault()
      e.stopPropagation()
    } else if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      const {target} = e
      if (target instanceof Element) {
        const targetMenuItem = target.closest(`.${MENU_ITEM_CLASS}`)
        if (targetMenuItem instanceof HTMLElement) {
          const targetMenu = target.closest(`.${MENU_CLASS}`)
          if (targetMenu instanceof HTMLElement) {
            const nextNode = findNode(targetMenu, targetMenuItem, e.code, `.${MENU_ITEM_CLASS}`, `.${MENU_CLASS}`)
            if (nextNode instanceof HTMLElement) {
              setSubmenuHover(false)
              setItemHover(false)
              setKeyOpen(false)
              setMouseMoved(false)
              nextNode.focus()
            }
          }
        }
      }
      e.stopPropagation()
    }
  }

  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const {target, relatedTarget} = e
    if (
      target instanceof Element &&
      relatedTarget instanceof Element
    ) {
      const targetMenu = target.closest(`.${MENU_CLASS}`)
      if (targetMenu instanceof Element) {
        const targetMenuItem = targetMenu.closest(`.${MENU_ITEM_CLASS}`)
        const relatedTargetMenuItem = relatedTarget.closest(`.${MENU_ITEM_CLASS}`)
        if (
          targetMenuItem instanceof Element &&
          relatedTargetMenuItem instanceof Element &&
          targetMenuItem.contains(relatedTargetMenuItem)
        ) {
          return
        }
      }
    }
    setSubmenuHover(false)
    setItemHover(false)
    setKeyOpen(false)
    setMouseMoved(false)
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
            onMouseLeave={({target}) => {
              const button = buttonRef.current
              if (target instanceof Element && button instanceof Element) {
                const buttonMenuItem = button.closest(`.${MENU_ITEM_CLASS}`)
                const targetMenu = target.closest(`.${MENU_CLASS}`)
                if (
                  buttonMenuItem instanceof Element &&
                  targetMenu instanceof Element &&
                  buttonMenuItem.contains(targetMenu)
                ) {
                  return
                }
              }
              setHoverOff()
            }}
            onKeyDown={onKeyDown}
          >
            <button ref={buttonRef} className="vtv--menu--menu-item-button" onClick={onClick}>{children}</button>
            <FontAwesomeIcon icon={faCaretRight} size="sm" />
            {
              (((mouseMoved || keyOpen) && (itemHover || submenuHover)) &&
                React.cloneElement(submenu, {
                  autoFocus: keyOpen,
                  onMouseEnter: () => { setSubmenuHover(true); setItemHover(false); },
                  onMouseLeave: ({target, relatedTarget}) => {
                    if (
                      target instanceof Element &&
                      relatedTarget instanceof Element
                    ) {
                      const relatedTargetMenu = relatedTarget.closest(`.${MENU_CLASS}`)
                      const relatedTargetMenuItem = relatedTarget.closest(`.${MENU_ITEM_CLASS}`)
                      if (relatedTargetMenu instanceof Element) {
                        setSubmenuHover(false)
                        setItemHover(relatedTargetMenuItem instanceof Element ? relatedTargetMenuItem.contains(target) : false)
                      }
                    }
                  },
                  onKeyDown: (e: KeyboardEvent) => {
                    if (e.code === 'ArrowLeft') {
                      e.stopPropagation()
                      setKeyOpen(false)
                      setMouseMoved(false)
                      setSubmenuHover(false)
                      setItemHover(false)
                      if (buttonRef.current) {
                        const menuItem = buttonRef.current.closest(`.${MENU_ITEM_CLASS}`)
                        if (menuItem instanceof HTMLElement) {
                          menuItem.focus()
                        }
                      }
                    }
                  },
                  onBlur,
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
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      {copyToClipboard ? (
        <CopyToClipboard text={copyToClipboard}>
          <button ref={buttonRef} className="vtv--menu--menu-item-button">{children}</button>
        </CopyToClipboard>
      ) : (
        <button ref={buttonRef} className="vtv--menu--menu-item-button" onClick={onClick}>{children}</button>
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
  onBlur?: FocusEventHandler
  onKeyDown?: KeyboardEventHandler
  isSubmenu?: boolean
  autoFocus?: boolean
  children: React.ReactNode
  context: Context
}

const Menu: FunctionComponent<MenuProps> = ({
  onClose,
  popperProps,
  onMouseEnter,
  onMouseLeave,
  onBlur,
  onKeyDown: extraOnKeyDown,
  isSubmenu = false,
  autoFocus = false,
  children,
  context: { theme },
  context,
}: MenuProps) => {
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, onClose)

  const menuItems = React.Children.map(children, (child, childIndex) => {
    return React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<any>, {
          onClick(e: MouseEvent) {
            child.props.onClick(e)
            if (onClose) {
              onClose()
            }
          },
          autoFocus: autoFocus ? childIndex === 0 : false,
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
      }
    }
    if (extraOnKeyDown) {
      extraOnKeyDown(e)
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
          onBlur={onBlur}
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
