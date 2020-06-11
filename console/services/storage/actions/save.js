export default async function save({
  fileStore,
  url,
  parentMessage: { value },
}) {
  const path = url.split('/').slice(1)
  try {
    return await fileStore.put({
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
