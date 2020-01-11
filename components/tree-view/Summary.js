import { detectUrl } from './analyze'
import Link from './Link'

const CollectionSummary = ({type, length}) => {
  if (length === 0) {
    return <span>{type === 'object' ? '{}' : '[]'}</span>
  } else {
    return <em>({length} {length === 1 ? 'item' : 'items'})</em>
  }
}

export default ({value, onPickId, theme}) => {
  if (typeof value === 'string') {
    if (detectUrl(value)) {
      return <Link url={value} onPickId={onPickId} theme={theme} />
    } else {
      return value
    }
  } else if (typeof value === 'object' && value !== null) {
    return <CollectionSummary type={Array.isArray(value) ? 'array' : 'object'} length={Object.keys(value).length} />
    const length = Object.keys(value).length
    if (length > 0) {
      return Array.isArray(value) ? '[]' : '{}'
    } else {
      return `${Array.isArray(value) ? 'Array' : 'Object'} (${length} items)`
    }
  } else {
    return <em>
      {`${value}`}
      <style jsx>{`
        em {
          font-style: normal;
        }
      `}</style>
    </em>
  }
}
//
//   {isObject(value) && <CollectionSummary type="object" value={value} />}
//   {Array.isArray(value) && <CollectionSummary type="array" value={value} />}
//   {typeof value === 'string' && (
//     detectUrl(value) ? <Link url={value} onPickId={onPickId} theme={theme} /> : value
//   )}
//   {value === null && <em>null</em>}
//   {typeof value !== 'string' && typeof value !== 'object' && <em>{JSON.stringify(value)}</em>}
//   {typeof value === 'undefined' && <em>undefined</em>}
// </div>
