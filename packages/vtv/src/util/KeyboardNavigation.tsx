import React from 'react'

const NODE_CLASS = 'vtv--node-view--row'
const NODE_CHILDREN_CLASS = 'vtv--node-view--children'
const NODE_NAME_CLASS = 'vtv--name-button'
const CODE_VIEW_CLASS = 'vtv--code-view--textarea-wrapper'
const MAX_DEPTH = 20

const KeyboardNavigation = React.forwardRef(({themeClass, children}, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    let node = target
    let arrowNavigation = true
    let treeNavigation = false
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
        if (e.code === 'ArrowUp') {
          e.preventDefault()
          console.log('up arrow')
        } else if (e.code === 'ArrowDown') {
          e.preventDefault()
          console.log('down arrow')
        } else if (treeNavigation) {
          if (e.code === 'ArrowLeft') {
            e.preventDefault()
            console.log('left arrow')
          } else if (e.code === 'ArrowRight') {
            e.preventDefault()
            console.log('right arrow')
          }
        }
      } else {
        if (e.code === 'Escape') {
          e.preventDefault()
          console.log('escape')
          // TODO: focus node containing code view (sibling of NODE_CHILDREN_CLASS)
        }
      }
    }
  }
  return <div style={{padding: '5px'}} ref={ref} tabIndex={0} className={`vtv--view ${themeClass}`} onKeyDown={handleKeyDown}>
    {children}
  </div>
})

export default KeyboardNavigation