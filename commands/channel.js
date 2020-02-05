export default {
  actions: {
    updateCommand: {
      params: ['commandId', 'data'],
      help: 'send a command update',
      run({ params: { commandId, data } }) {
        return {
          type: 'tree-update',
          treeCommandId: commandId,
          ...JSON.parse(data),
        }
      },
    },
    setExpanded: {
      params: ['commandId', 'path', 'expanded'],
      help: 'set expanded',
      run({ params: { commandId, path, expanded } }) {
        return {
          type: 'tree-update',
          path: path.split('.'),
          state: { _expanded: JSON.parse(expanded) },
          treeCommandId: commandId,
        }
      },
    },
    setViewType: {
      params: ['commandId', 'path', 'viewType'],
      help: 'set expanded',
      run({ params: { commandId, path, viewType } }) {
        return {
          type: 'tree-update',
          path: path.split('.'),
          state: { _viewType: viewType, expanded: true },
          treeCommandId: commandId,
        }
      },
    },
  },
}
