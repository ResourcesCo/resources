import React from 'react'

export default function ActionButton({
  path,
  actionLink,
  context: {
    onPickId,
    document: { value: docValue },
    theme,
  },
}) {
  const runAction = () => {
    const { url: actionUrl, action, args } = actionLink.getAction({
      value: docValue,
      path,
    })
    onPickId(`${actionUrl} :${action} ${args || ''}`.trim())
  }
  return (
    <button className="vtv--content-action-button--button action" onClick={runAction}>
      {actionLink.name}
    </button>
  )
}
