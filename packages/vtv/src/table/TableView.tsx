import React from 'react'
import {
  getCollectionPaths,
  joinPath,
  getChildState,
  getNestedState,
  getNodeInfo,
} from 'vtv-model'
import { get as getNested } from 'lodash'
import ValueInlineContent from '../content/ValueInlineContent'
import RowHeaderView from './RowHeaderView'
import ColumnHeaderView from './ColumnHeaderView'

export default function TableView({
  name,
  value,
  path,
  state,
  context: { theme },
  context,
}) {
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
          {Object.keys(value).map((key) => (
            <tr key={key}>
              <td>
                <RowHeaderView context={context}>{key}</RowHeaderView>
              </td>
              {paths.map((columnPath, i) => {
                const cellValue = getNested(value, [key, ...columnPath])
                const cellState = getNestedState(value, [key, ...columnPath])
                const { nodeType, stringType, mediaType } = getNodeInfo(
                  cellValue,
                  cellState
                )
                return (
                  <td key={i}>
                    <ValueInlineContent
                      name={name}
                      value={cellValue}
                      path={[...path, key, ...columnPath]}
                      state={cellState}
                      nodeType={nodeType}
                      stringType={stringType}
                      mediaType={mediaType}
                      context={context}
                    />
                  </td>
                )
              })}
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
