import { getNodeType, joinPath } from '../../vtv-model/analyze'
import CollectionSummary from './CollectionSummary'

export default function InlineNodeView({
  value,
  state,
  path,
  id,
  showLabel,
  labelPath,
  context: { theme },
}) {
  const nodeType = getNodeType(value)
  const summaryString = `${value}`.replace(/\n\t/g, '').substr(0, 40)
  return (
    <div className="node">
      {showLabel && <div className="name">{joinPath(labelPath)}</div>}
      <div className="value">
        {['object', 'array'].includes(nodeType) ? (
          <CollectionSummary
            type={nodeType}
            length={Object.keys(value).length}
            context={context}
          />
        ) : (
          summaryString
        )}
      </div>
      <style jsx>{`
        div.node {
          background-color: ${theme.bubble2};
          display: flex;
          color: ${theme.lightTextColor};
          margin-right: 10px;
          border-radius: 9999px;
          padding: 3px 7px;
        }
        div.name {
          margin-right: 6px;
          color: ${theme.lighterTextColor};
        }
      `}</style>
    </div>
  )
}
