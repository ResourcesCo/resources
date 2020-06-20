import React from 'react'
import { updateTree } from './model/state'
import { getTheme } from './themes'
import NodeView from './tree/NodeView'
import Clipboard from './util/Clipboard'

const defaultClipboard = new Clipboard()

export default function View({
  onChange,
  onAction,
  onPickId,
  theme,
  clipboard,
  codeMirrorComponent,
  name,
  value,
  state,
}) {
  const onMessage = message => {
    if (message.action === 'runAction') {
      if (typeof onAction === 'function') {
        onAction(message)
      }
    } else {
      const treeData = {
        name,
        value,
        state,
      }
      onChange(updateTree(treeData, message))
    }
  }
  return (
    <NodeView
      name={name}
      value={value}
      state={state}
      context={{
        onMessage: onMessage,
        clipboard: clipboard || defaultClipboard,
        theme: getTheme(theme),
        onPickId,
        codeMirrorComponent,
      }}
    />
  )
}
