import { MAX_DEPTH, NODE_CLASS } from './constants'

export default function findNode(root: HTMLElement, node: Element, direction: string): HTMLElement | undefined {
  let nodeContainer = node.closest(`.${NODE_CLASS}`)
  let parent = nodeContainer
  for (let parentDepth = 0; parentDepth < MAX_DEPTH; parentDepth++) {
    const nodes = [...parent.querySelectorAll(`.${NODE_CLASS}`)]
    if (direction === 'ArrowUp') {
      nodes.reverse()
    }
    let returnNext = false
    for (let i = 0; i < nodes.length; i++) {
      const currentNode = nodes[i]
      if (returnNext) {
        if (currentNode instanceof HTMLElement) {
          return currentNode
        }
      }
      if (currentNode === nodeContainer) {
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