import React from 'react'

import {
  MAX_DEPTH,
  ROOT_CLASS,
  NODE_CLASS,
  NODE_CHILDREN_CLASS,
  NODE_NAME_CLASS,
  NODE_EXPAND_CLASS,
  CODE_VIEW_CLASS,
  MENU_CLASS
} from './constants'
import findNode from './findNode'

function navigate(root: HTMLElement, node: HTMLElement, direction: string): HTMLElement | undefined {
  if (direction === 'ArrowUp' || direction === 'ArrowDown') {
    const navNode = findNode(root, node, direction)
    if (navNode) {
      const nodeNameEl = navNode.querySelector(`.${NODE_NAME_CLASS}`)
      if (nodeNameEl instanceof HTMLElement) {
        nodeNameEl.focus()
      }
    }
  }
  return undefined
}

const KeyboardNavigation = React.forwardRef<
  HTMLDivElement,
  {themeClass: string, children: React.ReactNode}
>(({themeClass, children}, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    let node = target
    let arrowNavigation = true
    let treeNavigation = true
    const root = target.closest(`.${ROOT_CLASS}`) as HTMLElement
    for (let i=0; i < MAX_DEPTH; i++) {
      if (
        node &&
        node.classList && (
          node.classList.contains(NODE_CLASS) ||
          node.classList.contains(NODE_CHILDREN_CLASS)
        )
      ) {
        break
      } else if (
        node instanceof HTMLElement && (
          node.classList.contains(CODE_VIEW_CLASS) ||
          node.classList.contains(MENU_CLASS)
        )
      ) {
        arrowNavigation = false
        treeNavigation = false
      } else if (
        node instanceof HTMLElement &&
        (
          node.tagName === 'INPUT' ||
          node.tagName === 'TEXTAREA' ||
          node.contentEditable === 'true'
        )
      ) {
        treeNavigation = false
      }
      node = node ? node.parentElement : node
    }
    if (
      node &&
      node.classList
      && (
        node.classList.contains(NODE_CLASS) ||
        node.classList.contains(NODE_CHILDREN_CLASS)
      )
    ) {
      if (arrowNavigation) {
        if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
          e.preventDefault()
          navigate(root, node, e.code)
        } else if (treeNavigation) {
          const nodeContainer = node.closest(`.${NODE_CLASS}`)
          if (nodeContainer instanceof HTMLElement) {
            if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
              const button = nodeContainer.querySelector(`.${NODE_NAME_CLASS}`)
              if (button instanceof HTMLElement) {
                const event = new KeyboardEvent('keydown', {code: e.code, bubbles: true})
                button.dispatchEvent(event)
              }
            }
          }
        }
      } else {
        if (e.code === 'Escape') {
          // TODO: if in code view, navigate to parent element
        }
      }
    }
  }
  return <div style={{padding: '5px'}} ref={ref} tabIndex={0} className={`vtv--view ${themeClass}`} onKeyDown={handleKeyDown}>
    {children}
  </div>
})

export default KeyboardNavigation