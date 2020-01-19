export default {
  commands: {
    updateCommand: {
      args: ['commandId', 'data'],
      help: 'send a command update',
      run({args: {commandId, data}}) {
        return {
          type: 'tree-update',
          treeCommandId: commandId,
          ...JSON.parse(data),
        }
      }
    },
    setExpanded: {
      args: ['commandId', 'path', 'expanded'],
      help: 'set expanded',
      run({args: {commandId, path, expanded}}) {
        return {
          type: 'tree-update',
          path: path.split('.'),
          state: {_expanded: JSON.parse(expanded)},
          treeCommandId: commandId,
        }
      }
    },
    setViewType: {
      args: ['commandId', 'path', 'viewType'],
      help: 'set expanded',
      run({args: {commandId, path, viewType}}) {
        return {
          type: 'tree-update',
          path: path.split('.'),
          state: {_viewType: viewType, expanded: true},
          treeCommandId: commandId,
        }
      }
    },
  },
}
