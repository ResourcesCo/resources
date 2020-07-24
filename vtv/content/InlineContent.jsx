import ValueInlineContent from './ValueInlineContent'
import InlineNodeView from './InlineNodeView'
import getNested from 'lodash/get'
import { getNestedState } from '../../vtv-model/state'

export default function InlineContent({
  name,
  value,
  state,
  path,
  rules,
  autoEdit = true,
  context: { onMessage },
  context,
}) {
  let summaryRule
  for (const rule of rules) {
    if (rule.summary) {
      summaryRule = rule
    }
  }
  return (
    <>
      {summaryRule &&
        summaryRule.summary.map(summaryItem => {
          if (summaryItem.type === 'node') {
            return (
              <InlineNodeView
                value={getNested(value, summaryItem.path)}
                state={getNestedState(state, summaryItem.path)}
                path={[...path, ...summaryItem.path]}
                showLabel={summaryItem.showLabel}
                labelPath={summaryItem.path}
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
        autoEdit={autoEdit}
        context={context}
      />
    </>
  )
}
