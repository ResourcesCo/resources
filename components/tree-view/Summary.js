import { detectUrl } from './analyze'
import Link from './Link'

const CollectionSummary = ({ type, length, theme }) => {
  return (
    <span>
      {type === 'object' ? '{' : '['}
      {length > 0 && `${length} ${length === 1 ? 'item' : 'items'}`}
      {type === 'object' ? '}' : ']'}
      <style jsx>{`
        color: ${theme.summaryColor};
      `}</style>
    </span>
  )
}

export default ({ value, onPickId, theme }) => {
  if (typeof value === 'string') {
    if (detectUrl(value)) {
      return <Link url={value} onPickId={onPickId} theme={theme} />
    } else {
      return value
    }
  } else if (typeof value === 'object' && value !== null) {
    return (
      <CollectionSummary
        type={Array.isArray(value) ? 'array' : 'object'}
        length={Object.keys(value).length}
        theme={theme}
      />
    )
  } else if (typeof value === 'number') {
    return (
      <span>
        {`${value}`}
        <style jsx>{`
          span {
            color: ${theme.numberColor};
          }
        `}</style>
      </span>
    )
  } else {
    return (
      <span>
        {`${value}`}
        <style jsx>{`
          span {
            color: ${theme.valueColor};
          }
        `}</style>
      </span>
    )
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
