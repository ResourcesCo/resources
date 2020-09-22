import React from 'react'
import CodeView from './CodeView'
import ImageView from './ImageView'

export default function BlockContent({
  view,
  path,
  value,
  state,
  nodeType,
  stringType,
  mediaType,
  context,
}) {
  if (view === 'json') {
    return (
      <CodeView
        editMode="json"
        path={path}
        value={value}
        state={state}
        context={context}
      />
    )
  } else if (view === 'image') {
    return <ImageView value={value} />
  } else if (['text', 'code'].includes(view)) {
    return (
      <CodeView
        editMode="text"
        path={path}
        value={value}
        state={state}
        mediaType={view === 'code' ? mediaType : null}
        context={context}
      />
    )
  } else {
    return null
  }
}
