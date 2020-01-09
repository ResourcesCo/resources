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
      args: ['commandId', 'treeUpdate'],
      help: 'send a command update',
      run({args: {commandId, data}}) {
        return {
          type: 'form-status',
          treeUpdate: JSON.parse(data),
          commandId,
        }
      }
    },
  },
}
