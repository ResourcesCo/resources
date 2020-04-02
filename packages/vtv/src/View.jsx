import React from 'react'
import { isObject } from './model/analyze'
import { updateTree } from './model/state'
import { getTheme } from './themes'
import NodeView from './tree/NodeView'
import Clipboard from './util/Clipboard'

const optionDefaults = {
  bubbleMenu: true,
  dotMenu: true,
}

export default function View({
  onChange,
  onMessage,
  onAction,
  theme,
  clipboard,
  receiveAllMessages = false,
  options = {},
  ...props
}) {
  const clipboardProp = clipboard || new Clipboard()
  if (typeof onMessage === 'function') {
    return (
      <NodeView
        {...props}
        onMessage={onMessage}
        clipboard={clipboardProp}
        theme={getTheme(theme)}
      />
    )
  } else {
    let themeProp = theme
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
        options={{ ...optionDefaults, ...options }}
        clipboard={clipboardProp}
        theme={getTheme(theme)}
      />
    )
  }
}
