import { getNodeType, joinPath } from '../../vtv-model/analyze'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import CollectionSummary from './CollectionSummary'

export default function InlineNodeView({
  value,
  state,
  path,
  summaryItem,
  context: {
    theme,
    document: { value: docValue },
  },
}) {
  const nodeType = getNodeType(value)
  const summaryString = `${value}`.replace(/\n\t/g, '').substr(0, 40)
  const url = summaryItem.getUrl({
    value: docValue,
    path: path.slice(0, path.length - summaryItem.path.length),
  })
  const bubble = (
    <div className="node">
      {summaryItem.showLabel && (
        <div className="name">{joinPath(summaryItem.path)}</div>
      )}
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
      {url && <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />}
      <style jsx>{`
        div.node {
          background-color: ${theme.bubble2};
          display: flex;
          align-items: center;
          color: ${theme.lightTextColor};
          margin-right: 10px;
          border-radius: 9999px;
          padding: 3px 7px;
        }
        div.name {
          margin-right: 6px;
          color: ${theme.lighterTextColor};
        }
        div.node :global(svg) {
          margin-left: 5px;
        }
      `}</style>
    </div>
  )
  return url ? (
    <a href={url} target="_blank">
      {bubble}
      <style jsx>{`
        a:hover {
          text-decoration: none;
        }
      `}</style>
    </a>
  ) : (
    bubble
  )
}
