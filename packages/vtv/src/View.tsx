import React from 'react'
import { getTheme } from './themes'
import NodeView from './tree/NodeView'
import Clipboard from './util/Clipboard'
import { RuleList, updateTree } from 'vtv-model'
import { Context } from 'vtv'

const defaultClipboard = new Clipboard()

export default function View({
  onChange,
  onAction,
  onPickId,
  theme,
  clipboard = undefined,
  codeMirrorComponent = undefined,
  name,
  value,
  state = {},
  rules = {},
}) {
  const onMessage = (message) => {
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
    <div className={`vtv-view vtv-theme-${getTheme(theme).dark ? 'dark' : 'light'}`}>
      <NodeView
        path={[]}
        name={'root'}
        value={value}
        state={state}
        context={{
          document: {
            name,
            value,
            state,
          },
          ruleList: new RuleList(rules),
          onMessage: onMessage,
          clipboard: clipboard || defaultClipboard,
          theme: getTheme(theme),
          onPickId,
          codeMirrorComponent,
        }}
      />
    </div>
  )
}
