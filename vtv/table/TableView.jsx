import React from 'react'
import {
  getCollectionPaths,
  joinPath,
  getAtPath,
} from '../../vtv-model/analyze'
import { getChildState } from '../../vtv-model'
import InlineContent from '../content/InlineContent'
import RowHeaderView from './RowHeaderView'
import ColumnHeaderView from './ColumnHeaderView'

export default ({ name, value, path, state, context: { theme }, context }) => {
  const paths = getCollectionPaths(value).slice(0, 15) // TODO: support customizing displayed columns
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>
              <ColumnHeaderView context={context}>
                <em>key</em>
              </ColumnHeaderView>
            </th>
            {paths.map((path, i) => (
              <th key={i}>
                <ColumnHeaderView context={context}>
                  {path.length === 0 ? <em>value</em> : joinPath(path)}
                </ColumnHeaderView>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(value).map(key => (
            <tr key={key}>
              <td>
                <RowHeaderView context={context}>{key}</RowHeaderView>
              </td>
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
          padding: 3px 10px;
          text-align: left;
        }
      `}</style>
    </div>
  )
}
