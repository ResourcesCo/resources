import React from 'react'
import { isObject } from './model/analyze'
import { updateTree } from './model/state'
import { getTheme } from './themes'
import NodeView from './tree/NodeView'
import Clipboard from './util/Clipboard'

const defaultClipboard = new Clipboard()

export default function View({
  onChange,
  onMessage,
  onAction,
  onPickId,
  theme,
  clipboard,
  codeMirrorComponent,
  receiveAllMessages = false,
  name,
  value,
  state,
}) {
  let onMessageHandler = onMessage
  if (typeof onMessageProp !== 'function') {
    onMessageHandler = message => {
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
  }
  return (
    <NodeView
      name={name}
      value={value}
      state={state}
      context={{
        onMessage: onMessageHandler,
        clipboard: clipboard || defaultClipboard,
        theme: getTheme(theme),
        onPickId,
        codeMirrorComponent,
      }}
    />
  )
}
