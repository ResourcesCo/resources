import React from 'react'

const ROOT_CLASS = 'vtv--view'
const NODE_CLASS = 'vtv--node-view--row'
const NODE_CHILDREN_CLASS = 'vtv--node-view--children'
const NODE_NAME_CLASS = 'vtv--name-button'
const NODE_EXPAND_CLASS = 'vtv--expand-button'
const CODE_VIEW_CLASS = 'vtv--code-view--textarea-wrapper'
const MAX_DEPTH = 20

function isVisible(el: Element) {
  if (el instanceof HTMLElement) {
    return el.offsetParent !== null
  } else {
    return false
  }
}

function findNode(root: HTMLElement, node: Element, direction: string): HTMLElement | undefined {
  let parent = node
  for (let parentDepth = 0; parentDepth < MAX_DEPTH; parentDepth++) {
    const nodes = [...parent.querySelectorAll(`.${NODE_CLASS}`)]
    if (direction === 'ArrowUp') {
      nodes.reverse()
    }
    let returnNext = false
    for (let i = 0; i < nodes.length; i++) {
      const currentNode = nodes[i]
      if (returnNext) {
        if (isVisible(currentNode) && currentNode instanceof HTMLElement) {
          return currentNode
        }
      }
      if (currentNode === node) {
        returnNext = true
      }
    }
    if (parent === root) {
      break;
    }
    parent = parent.parentElement
    if (!(parent instanceof HTMLElement)) {
      break;
    }
  }
  return undefined
}

function navigate(root: HTMLElement, node: HTMLElement, direction: string): HTMLElement | undefined {
  if (direction === 'ArrowUp' || direction === 'ArrowDown') {
    const nodeContainer = node.closest(`.${NODE_CLASS}`)
    const navNode = findNode(root, nodeContainer, direction)
    if (navNode) {
      const nodeNameEl = navNode.querySelector(`.${NODE_NAME_CLASS}`)
      if (nodeNameEl instanceof HTMLElement) {
        nodeNameEl.focus()
      }
    }
  }
  return undefined
}

const KeyboardNavigation = React.forwardRef(({themeClass, children}, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    let node = target
    let arrowNavigation = true
    let treeNavigation = false
    let root = target.closest(ROOT_CLASS) as HTMLElement
    for (let i=0; i < MAX_DEPTH; i++) {
      if (
        node &&
        node.classList && (
          node.classList.contains(NODE_CLASS) ||
          node.classList.contains(NODE_CHILDREN_CLASS)
        )
      ) {
        break
      } else if (node && node.classList && node.classList.contains(CODE_VIEW_CLASS)) {
        arrowNavigation = false
      } else if (node && node.classList && node.classList.contains(NODE_NAME_CLASS)) {
        treeNavigation = true
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
          if (e.code === 'Space') {
            const nodeContainer = node.closest(`.${NODE_CLASS}`)
            if (nodeContainer instanceof HTMLElement) {
              const expandButton = nodeContainer.querySelector(`.${NODE_EXPAND_CLASS} button`)
              if (expandButton instanceof HTMLElement) {
                console.log({nodeContainer, expandButton})
                const event = new Event('click')
                expandButton.dispatchEvent(event)
                expandButton.click()
              }
            }
          }
          // TODO: open menu on enter - menu needs keyboard too
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