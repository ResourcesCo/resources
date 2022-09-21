import React from 'react'
import ValueInlineContent from './ValueInlineContent'
import InlineNodeView from './InlineNodeView'
import ActionButton from './ActionButton'
import { get as getNested } from 'lodash-es'
import { getNestedState } from 'vtv-model'

export default function InlineContent({
  name,
  value,
  state,
  path,
  nodeType,
  stringType,
  mediaType,
  rules,
  autoEdit = true,
  context: { onMessage },
  context,
}) {
  let inlineRule
  for (const rule of rules) {
    if (rule.inline) {
      inlineRule = rule
    }
  }
  return (
    <>
      {inlineRule &&
        inlineRule.inline.map((inlineItem, i) => {
          if (inlineItem.type === 'node') {
            return (
              <InlineNodeView
                key={i}
                value={getNested(value, inlineItem.path)}
                state={getNestedState(state, inlineItem.path)}
                path={[...path, ...inlineItem.path]}
                inlineItem={inlineItem}
                context={context}
              />
            )
          } else if (inlineItem.type === 'action') {
            return (
              <ActionButton
                key={i}
                path={path}
                actionLink={inlineItem}
                context={context}
              />
            )
          } else {
            return null
          }
        })}
      <ValueInlineContent
        name={name}
        value={value}
        state={state}
        path={path}
        nodeType={nodeType}
        stringType={stringType}
        mediaType={mediaType}
        autoEdit={autoEdit}
        context={context}
      />
    </>
  )
}
