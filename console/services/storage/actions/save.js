export default async function save({
  fileStore,
  path,
  parentMessage: { value },
}) {
  let result
  try {
    result = await fileStore.put({
      path: '/' + path.map(s => encodeURIComponent(s)).join('/'),
      value,
    })
  } catch (err) {
    return {
      type: 'text',
      text: err.message,
    }
  }
}
