import { getNodeType, joinPath } from 'vtv-model'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { sanitizeUrl } from '@braintree/sanitize-url'

export default function InlineNodeView({
  value,
  state,
  path,
  inlineItem,
  context: {
    theme,
    document: { value: docValue },
  },
}) {
  const nodeType = getNodeType(value)
  const summaryString = `${value}`.replace(/\n\t/g, '').substr(0, 40)
  const url = inlineItem.getUrl({
    value: docValue,
    path: path.slice(0, path.length - inlineItem.path.length),
  })
  const bubble = (
    <div className="node">
      {inlineItem.showLabel && (
        <div className="name">{joinPath(inlineItem.path)}</div>
      )}
      {summaryString}
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
    <a href={sanitizeUrl(url) || '#'} target="_blank">
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
