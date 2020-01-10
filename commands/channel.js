export default {
  commands: {
    _updateCommand: {
      args: [],
      help: 'send a command update (internal)',
      run({formCommandId, formData}) {
        return {
          type: 'form-status',
          treeUpdate: formData,
          formCommandId,
        }
      }
    },
    updateCommand: {
      args: ['commandId', 'data'],
      help: 'send a command update',
      run({args: {commandId, data}}) {
        return {
          type: 'form-status',
          treeUpdate: JSON.parse(data),
          formCommandId: commandId,
        }
      }
    },
    setExpanded: {
      args: ['commandId', 'path', 'expanded'],
      help: 'set expanded',
      run({args: {commandId, path, expanded}}) {
        return {
          type: 'form-status',
          treeUpdate: {path: path.split('.'), state: {_expanded: JSON.parse(expanded)}},
          formCommandId: commandId,
        }
      }
    },
    setViewType: {
      args: ['commandId', 'path', 'viewType'],
      help: 'set expanded',
      run({args: {commandId, path, viewType}}) {
        return {
          type: 'form-status',
          treeUpdate: {path: path.split('.'), state: {_viewType: viewType, expanded: true}},
          formCommandId: commandId,
        }
      }
    },
  },
}
