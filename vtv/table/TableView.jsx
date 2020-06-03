import React from 'react'
import { getCollectionPaths, joinPath, getAtPath } from '../model/analyze'
import { getChildState } from '../model'
import InlineContent from '../content/InlineContent'

export default ({ name, value, path, state, context: { theme }, context }) => {
  const paths = getCollectionPaths(value)
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>key</th>
            {paths.map((path, i) => (
              <th key={i}>{joinPath(path)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(value).map(key => (
            <tr key={key}>
              <td>{key}</td>
              {paths.map((columnPath, i) => (
                <td key={i}>
                  <InlineContent
                    name={name}
                    value={getAtPath(value[key], columnPath)}
                    path={[...path, key, ...columnPath]}
                    state={getChildState(value[key], columnPath)}
                    context={context}
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
