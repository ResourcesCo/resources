import { getCollectionPaths, displayPath, getAtPath, detectUrl } from './analyze'
import Link from './link'

const Summary = ({value, onPickId, theme}) => {
  if (typeof value === 'string') {
    if (detectUrl(value)) {
      return <Link url={value} onPickId={onPickId} theme={theme} />
    } else {
      return value
    }
  } else if (typeof value === 'object' && value !== null) {
    const length = Object.keys(value).length
    if (length > 0) {
      return Array.isArray(value) ? '[]' : '{}'
    } else {
      return `${Array.isArray(value) ? 'Array' : 'Object'} (${length} items)`
    }
  } else {
    return <em>{`${value}`}</em>
  }
}

export default ({value, onPickId, theme}) => {
  const paths = getCollectionPaths(value)
  return <div className="table">
    <table>
      <thead>
        <tr>
          <th>key</th>
          {paths.map((path, i) => <th key={i}>{displayPath(path)}</th>)}
        </tr>
      </thead>
      <tbody>
        {
          Object.keys(value).map(key => (
            <tr key={key}>
              <td>{key}</td>
              {
                paths.map((path, i) => <td key={i}>
                  <Summary
                    value={getAtPath(value[key], path)}
                    onPickId={onPickId}
                    theme={theme}
                  />
                </td>)
              }
            </tr>
          ))
        }
      </tbody>
    </table>
    <style jsx>{`
      .table {
        padding: 5px;
        padding-left: 30px;
        font-size: 70%;
      }
      table {
        border-collapse: collapse;
      }
      table th, table td {
        border: 1px solid ${theme.bubble1};
        padding: 3px;
      }
    `}</style>
  </div>
}
