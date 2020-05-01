export default function defaultView({ nodeType, stringType, mediaType }) {
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
