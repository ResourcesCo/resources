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
  onMessage,
  theme,
}) {
  if (view === 'json') {
    return (
      <CodeView
        editMode="json"
        path={path}
        value={value}
        state={state}
        onMessage={onMessage}
        theme={theme}
      />
    )
  } else if (view === 'image') {
    return <ImageView value={value} state={state} theme={theme} />
  } else {
    return null
  }
}
