export default function defaultView({
  nodeType,
  stringType,
  mediaType,
}: {
  nodeType?: string
  stringType?: string
  mediaType?: string
}) {
  if (nodeType === 'string' && stringType !== 'inline') {
    if ((mediaType || '').startsWith('image/')) {
      return 'image'
    } else {
      return 'text'
    }
  } else {
    return 'tree'
  }
}
