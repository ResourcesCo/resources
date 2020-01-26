import { getCollectionPaths, displayPath, getAtPath } from './analyze'
import Summary from './Summary'
import LabelButton from './LabelButton'

export default ({ value, onPickId, onMessage, name, state, theme }) => {
  const paths = getCollectionPaths(value)
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>key</th>
            {paths.map((path, i) => (
              <th key={i}>{displayPath(path)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(value).map(key => (
            <tr key={key}>
              <td>
                {/*<LabelButton theme={theme} name={key} />*/}
                {key}
              </td>
              {paths.map((path, i) => (
                <td key={i}>
                  <Summary
                    onMessage={onMessage}
                    value={getAtPath(value[key], path)}
                    onPickId={onPickId}
                    theme={theme}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .table {
          padding: 5px;
          padding-left: 30px;
        }
        table {
          border-collapse: collapse;
        }
        table th,
        table td {
          border: 1px solid ${theme.bubble1};
          padding: 3px;
        }
      `}</style>
    </div>
  )
}
