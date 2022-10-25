import { MAX_DEPTH, NODE_CLASS, ROOT_CLASS } from './constants'

export default function findNode(
  root: HTMLElement,
  node: Element,
  direction: string,
  selector: string = `.${NODE_CLASS}`,
  rootSelector: string = `.${ROOT_CLASS}`
): HTMLElement | undefined {
  let nodeContainer = node.closest(selector)
  let parent = nodeContainer
  const mainRoot = root.closest(rootSelector)
  for (let parentDepth = 0; parentDepth < MAX_DEPTH; parentDepth++) {
    const nodes = [...parent.querySelectorAll(selector)]
    if (direction === 'ArrowUp') {
      nodes.reverse()
    }
    let returnNext = false
    for (let i = 0; i < nodes.length; i++) {
      const currentNode = nodes[i]
      if (currentNode instanceof HTMLElement) {
        const currentRoot = currentNode.closest(rootSelector)
        if (currentRoot instanceof HTMLElement && currentRoot != mainRoot) {
          continue
        }
      }
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