import React from 'react'
import ActionButton from '../generic/ActionButton'

function InlineActionView({
  value,
  actions,
  context: { onMessage, onPickId },
  context,
}) {
  return (
    <div className="vtv--inline-action-view">
      {actions.map(({ name, title, primary, action }) => (
        <ActionButton
          key={name}
          primary={primary}
          onClick={() =>
            action === 'pasteIntoConsole'
              ? onPickId(value)
              : onMessage({ action: 'runAction', actionName: name })
          }
          context={context}
        >
          {title}
        </ActionButton>
      ))}
    </div>
  )
}

export default InlineActionView
