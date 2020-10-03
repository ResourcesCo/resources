import React from 'react'

export default function CollectionSummary({
  type,
  length,
  context: { theme },
}) {
  return (
    <span className="vtv--collection-summary">
      {type === 'object' ? '{' : '['}
      {length > 0 && `${length} ${length === 1 ? 'item' : 'items'}`}
      {type === 'object' ? '}' : ']'}
    </span>
  )
}
