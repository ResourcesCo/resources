import React from 'react'
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
    <div className="vtv--inline-node-view--node">
      {inlineItem.showLabel && (
        <div className="vtv--inline-node-view--name">{joinPath(inlineItem.path)}</div>
      )}
      {summaryString}
      {url && <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />}
    </div>
  )
  return url ? (
    <a className="vtv--inline-node-view--link" href={sanitizeUrl(url) || '#'} target="_blank">
      {bubble}
    </a>
  ) : (
    bubble
  )
}
