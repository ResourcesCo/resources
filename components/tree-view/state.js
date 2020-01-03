export const updateTreeMessage = (treeMessage, updateMessage) => {
  return {
    ...treeMessage,
    value: updateMessage.treeUpdate.value || treeMessage.value,
    state: updateMessage.treeUpdate.state || treeMessage.state,
  }
}

export const getState = (state, path) => {
  const expandedPaths = ((state || {}).expanded || [])
  const expanded = expandedPaths.some(e => e.length === path.length && e.every((item, i) => item === path[i]))
  return { expanded }
}
