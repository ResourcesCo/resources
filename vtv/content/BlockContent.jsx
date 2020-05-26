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
  codeMirrorComponent,
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
        codeMirrorComponent={codeMirrorComponent}
        theme={theme}
      />
    )
  } else if (view === 'image') {
    return <ImageView value={value} state={state} theme={theme} />
  } else if (['text', 'code'].includes(view)) {
    return (
      <CodeView
        editMode="text"
        path={path}
        value={value}
        state={state}
        mediaType={view === 'code' ? mediaType : null}
        onMessage={onMessage}
        codeMirrorComponent={codeMirrorComponent}
        theme={theme}
      />
    )
  } else {
    return null
  }
}
