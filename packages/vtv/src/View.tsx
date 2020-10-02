import React, { useRef, useEffect } from 'react'
import { getTheme, themeProperties } from './themes'
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
  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
    if (ref.current && typeof theme === 'object' && theme !== null) {
      for (const prop of Object.keys(themeProperties)) {
        if (theme[prop]) {
          ref.current.style.setProperty(themeProperties[prop], theme[prop])
        }
      }
    }
  }, [ref])
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
  const themeClass = typeof theme === 'string' ? `vtv-theme-${theme}` : ''
  return (
    <div ref={ref} className={`vtv-view ${themeClass}`}>
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
