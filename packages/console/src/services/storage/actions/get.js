export default async function get({ fileStore, path, args }) {
  if (path.length === 0) {
    return {
      type: 'text',
      text: 'List not yet implemented',
    }
  } else {
    let result
    try {
      result = await fileStore.get({
        path: '/' + path.map(s => encodeURIComponent(s)).join('/'),
      })
    } catch (err) {
      return {
        type: 'text',
        text: 'Error getting file',
      }
    }
    return {
      type: 'tree',
      name: path[path.length - 1],
      value: result.body,
      state: {
        _expanded: true,
        _actions: [
          { name: 'save', title: 'Save', primary: true, show: 'changed' },
          { name: 'reload', title: 'Reload', show: 'delete' },
          { name: 'delete', title: 'Delete', show: 'changed' },
        ],
      },
    }
  }
}
