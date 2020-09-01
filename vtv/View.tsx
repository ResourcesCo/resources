import React from 'react'
import { updateTree } from '../vtv-model/state'
import { getTheme } from './themes'
import NodeView from './tree/NodeView'
import Clipboard from './util/Clipboard'
import RuleList from '../vtv-model/rules/RuleList'
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
  )
}
