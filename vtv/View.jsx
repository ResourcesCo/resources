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
  theme,
  clipboard,
  receiveAllMessages = false,
  ...props
}) {
  const clipboardProp = clipboard || defaultClipboard
  let onMessageProp = onMessage
  if (typeof onMessageProp !== 'function') {
    onMessageProp = message => {
      if (message.action === 'runAction') {
        if (typeof onAction === 'function') {
          onAction(message)
        }
      } else {
        const treeData = {
          name: props.name,
          value: props.value,
          state: props.state,
        }
        onChange(updateTree(treeData, message))
      }
    }
  }
  return (
    <NodeView
      {...props}
      onMessage={onMessageProp}
      clipboard={clipboardProp}
      theme={getTheme(theme)}
    />
  )
}
